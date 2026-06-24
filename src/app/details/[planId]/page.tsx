// app/details/[planId]/page.tsx
"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MembershipPlan, membershipPlans, addOnsList } from "@/utils/plandata";
import { membershipApi, countryCodes } from "@/utils/api/becomeamember.api";
import { paymentAPI } from "@/utils/api/payment.api";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const PlanDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;

  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Subscription configuration states
  const [selectedDuration, setSelectedDuration] = useState<string>("Monthly");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    plan: planId,
    newsletter: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Fetch plan content on mount (dynamic + static fallback)
  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        const response = await membershipApi.getAllContent();
        if (response.success && response.data) {
          const dbPlans = response.data.membershipPlans || [];
          const matched = dbPlans.find(
            (p: any) => p._id === planId || p.id === planId
          );
          if (matched) {
            const staticPlan = membershipPlans.find((p) => p.id === matched.id || p.id === planId);
            setActivePlan({
              ...staticPlan,
              ...matched,
            });
            setFormData((prev) => ({ ...prev, plan: matched._id || matched.id }));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching dynamic plans:", err);
      }

      // Static fallback
      const staticPlan = membershipPlans.find((p) => p.id === planId);
      if (staticPlan) {
        setActivePlan(staticPlan);
      }
      setLoading(false);
    };

    fetchPlanDetails();
  }, [planId]);

  // Load Razorpay Script Helper
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (
        document.querySelector(
          "script[src='https://checkout.razorpay.com/v1/checkout.js']"
        )
      ) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Convert price string (e.g., "₹2,100") to number
  const getNumericPrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const numericStr = priceStr.replace(/[^0-9]/g, "");
    return parseInt(numericStr, 10) || 0;
  };

  // Helper to calculate total price
  const calculateTotal = (): number => {
    if (!activePlan) return 0;
    const basePrice = getNumericPrice(activePlan.price);
    const matchedDuration = activePlan.durations?.find((d: any) => d.name === selectedDuration);
    const multiplier = matchedDuration ? matchedDuration.priceMultiplier : 1;
    
    const addOnsCost = selectedAddOns.reduce((sum, id) => {
      const addon = addOnsList.find(a => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    return (basePrice * multiplier) + addOnsCost;
  };

  // Validate Form Fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (formData.phone && phoneDigits.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
      if (submitError) setSubmitError("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitError) setSubmitError("");
  };

  const handleCountryCodeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFormData((prev) => ({
      ...prev,
      countryCode: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setSubmitError("Failed to load payment gateway. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      const totalToCharge = calculateTotal();
      if (totalToCharge <= 0) {
        setSubmitError("Invalid plan price. Please try another configuration.");
        setIsSubmitting(false);
        return;
      }

      // Create Razorpay Order
      const orderResponse = await paymentAPI.createOrder({
        amount: totalToCharge,
        currency: "INR",
        receipt: `membership_${Date.now()}`,
      });

      if (!orderResponse.success) {
        throw new Error("Failed to create order on payment gateway.");
      }

      const addOnNames = selectedAddOns.map(id => addOnsList.find(a => a.id === id)?.name).filter(Boolean).join(", ");
      const paymentDescription = `${activePlan.name} - ${selectedDuration}${addOnNames ? ` + Add-ons (${addOnNames})` : ""}`;

      // Open Razorpay Checkout Modal
      const options: any = {
        key: orderResponse.key_id,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "Osheen Oracle",
        description: paymentDescription,
        order_id: orderResponse.order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verification = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              const notesContent = `Duration: ${selectedDuration}\nAdd-ons: ${addOnNames || "None"}\nGrand Total Paid: ₹${totalToCharge}`;
              
              // Submit the application with status "active" and selections in notes
              const submitResponse = await membershipApi.submitApplication({
                ...formData,
                notes: notesContent,
                status: "active",
              });

              if (submitResponse.success) {
                setFormSubmitted(true);
                setSuccessMessage(
                  submitResponse.message ||
                    "Payment successful and membership activated! Welcome to the sacred circle."
                );
                
                // Clear form
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  countryCode: "+91",
                  plan: activePlan._id || activePlan.id,
                  newsletter: true,
                });
                setSelectedAddOns([]);
              } else {
                setSubmitError(
                  submitResponse.message ||
                    "Payment verified but failed to activate membership in database. Please contact support."
                );
              }
            } else {
              setSubmitError("Payment verification failed. Please contact support.");
            }
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            setSubmitError("Error verifying payment. Please contact support.");
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone ? `${formData.countryCode}${formData.phone}` : "",
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Error in checkout:", err);
      setSubmitError(err.message || "Something went wrong during checkout.");
      setIsSubmitting(false);
    }
  };

  // Scroll to Form helper
  const scrollToForm = () => {
    const el = document.getElementById("registration-form-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-700 text-lg">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (!activePlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
          <p className="text-gray-600 mb-8">
            The spiritual plan you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <Link
            href="/become-a-member"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Return to Plans
          </Link>
        </div>
      </div>
    );
  }

  const grandTotal = calculateTotal();

  return (
    <div
      className="min-h-screen text-[#3D2E4F]"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        fontFamily: "var(--font-montserrat)",
      }}
    >
        {/* Header */}
        <div className="relative bg-white/70 backdrop-blur-md shadow-sm border-b border-purple-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-5">
              <Link
                href="/become-a-member"
                className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300 text-sm sm:text-base cursor-pointer"
              >
                <span className="mr-2">←</span> Back to All Plans
              </Link>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {activePlan.price}
                  <span className="text-sm font-medium text-gray-500">/{activePlan.period}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 max-w-4xl mx-auto">
              {activePlan.popular && (
                <div className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-xs sm:text-sm mb-6 shadow-md font-medium tracking-wide">
                  ⭐ Most Popular Choice ⭐
                </div>
              )}
              <h1 className="text-4xl md:text-6xl text-[#3D2E4F] mb-6 leading-tight font-bold font-serif">
                {activePlan.name}
              </h1>
              <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
                {activePlan.longDescription || activePlan.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100/40 hover:shadow-md transition-shadow duration-300">
                <div className="text-xl sm:text-2xl font-extrabold text-purple-600 mb-1">
                  {activePlan.features ? activePlan.features.length : 0}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm font-medium">Divine Features</div>
              </div>
              <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100/40 hover:shadow-md transition-shadow duration-300">
                <div className="text-xl sm:text-2xl font-extrabold text-purple-600 mb-1">
                  {activePlan.includedServices ? activePlan.includedServices.length : 3}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm font-medium">Core Services</div>
              </div>
              <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100/40 hover:shadow-md transition-shadow duration-300">
                <div className="text-xl sm:text-2xl font-extrabold text-purple-600 mb-1">24/7</div>
                <div className="text-gray-500 text-xs sm:text-sm font-medium">Energetic Support</div>
              </div>
              <div className="text-center p-5 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100/40 hover:shadow-md transition-shadow duration-300">
                <div className="text-xl sm:text-2xl font-extrabold text-purple-600 mb-1">VIP</div>
                <div className="text-gray-550 text-xs sm:text-sm font-medium">Priority Access</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              {/* Left Column - Configurations & Details */}
              <div className="lg:col-span-2 space-y-8 md:space-y-12">
                
                {/* STEP 1: SELECT SUBSCRIPTION DURATION */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/50 p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3D2E4F] mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm font-extrabold">1</span>
                    Choose Subscription Duration
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activePlan.durations?.map((dur: any) => {
                      const basePriceNum = getNumericPrice(activePlan.price);
                      const durationPrice = basePriceNum * dur.priceMultiplier;
                      const isSelected = selectedDuration === dur.name;
                      
                      return (
                        <div
                          key={dur.name}
                          onClick={() => setSelectedDuration(dur.name)}
                          className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between hover:border-purple-400 hover:shadow-md ${
                            isSelected
                              ? "border-purple-500 bg-purple-50/40 shadow-sm"
                              : "border-purple-100/40 bg-white/70"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-extrabold text-[#3D2E4F] text-base sm:text-lg">{dur.name}</span>
                            <span className="text-purple-600 font-extrabold text-base sm:text-lg">
                              ₹{durationPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{dur.benefits}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: ADD-ONS (OPTIONAL) */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/50 p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3D2E4F] mb-2 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 text-sm font-extrabold">2</span>
                    Add-Ons (Optional)
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm mb-6 ml-11">Enhance your spiritual guidance on any plan.</p>

                  <div className="space-y-4">
                    {addOnsList.map((addon) => {
                      const isChecked = selectedAddOns.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-start gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-200 hover:border-purple-300 hover:bg-white/90 ${
                            isChecked
                              ? "border-purple-500 bg-purple-50/30 shadow-sm"
                              : "border-purple-100/40 bg-white/70"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddOns(prev => [...prev, addon.id]);
                              } else {
                                setSelectedAddOns(prev => prev.filter(id => id !== addon.id));
                              }
                            }}
                            className="mt-1.5 w-5 h-5 text-purple-600 border-purple-200 rounded focus:ring-purple-400 cursor-pointer"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <span className="font-extrabold text-[#3D2E4F] text-base">{addon.name}</span>
                              <span className="text-purple-600 font-extrabold text-sm bg-purple-100/60 px-2.5 py-1 rounded-lg">
                                + ₹{addon.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">{addon.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/50 p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2E4F] mb-6 font-serif">
                    What&rsquo;s Included
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activePlan.features && activePlan.features.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3.5 p-4 bg-purple-50/40 backdrop-blur-sm rounded-xl border border-purple-100/50"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-[#62aec5] rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits & Perfect For */}
                {(activePlan.benefits?.length > 0 || activePlan.recommendedFor?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activePlan.benefits && activePlan.benefits.length > 0 && (
                      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/50 p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-[#3D2E4F] mb-4 font-serif">
                          Key Benefits
                        </h3>
                        <ul className="space-y-3">
                          {activePlan.benefits.map((benefit: string, index: number) => (
                            <li key={index} className="flex items-start text-xs sm:text-sm">
                              <span className="text-purple-500 mr-2.5 mt-1 font-bold">✦</span>
                              <span className="text-gray-700 leading-relaxed whitespace-pre-wrap">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activePlan.recommendedFor && activePlan.recommendedFor.length > 0 && (
                      <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/50 p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl font-bold text-[#3D2E4F] mb-4 font-serif">
                          Perfect For
                        </h3>
                        <ul className="space-y-2.5">
                          {activePlan.recommendedFor.map((persona: string, index: number) => (
                            <li key={index} className="flex items-center text-xs sm:text-sm">
                              <span className="w-2 h-2 bg-[#62aec5] rounded-full mr-3 flex-shrink-0"></span>
                              <span className="text-gray-700 whitespace-pre-wrap">{persona}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Services Details */}
                {activePlan.includedServices && activePlan.includedServices.length > 0 && (
                  <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/50 p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2E4F] mb-6 font-serif">
                      Service Details
                    </h2>
                    <div className="space-y-6">
                      {activePlan.includedServices.map((service: any, index: number) => (
                        <div
                          key={index}
                          className="border-l-4 border-[#62aec5] pl-5 py-1"
                        >
                          <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-bold text-[#3D2E4F]">
                              {service.name}
                            </h3>
                            <span className="bg-purple-100/80 text-purple-700 px-3 py-0.5 rounded-full text-xs font-semibold">
                              {service.sessions}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs */}
                {activePlan.faqs && activePlan.faqs.length > 0 && (
                  <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-sm border border-purple-100/50 p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2E4F] mb-6 font-serif">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                      {activePlan.faqs.map((faq: any, index: number) => (
                        <div
                          key={index}
                          className="border-b border-purple-100/50 pb-5 last:border-b-0 last:pb-0"
                        >
                          <h3 className="text-base sm:text-lg font-semibold text-[#3D2E4F] mb-2 leading-snug">
                            {faq.question}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6 md:space-y-8">
                {/* Plan Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border-2 border-purple-300 p-6 sm:p-8 lg:sticky lg:top-36 z-10 relative">
                  <div className="text-center mb-6 pb-6 border-b border-purple-100/60">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#3D2E4F] mb-2 font-serif">
                      {activePlan.name}
                    </h3>
                    <p className="text-purple-600 font-semibold text-xs sm:text-sm mb-4">
                      Selected Duration: {selectedDuration}
                    </p>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-3 text-left text-xs sm:text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Plan Cost ({selectedDuration}):</span>
                        <span className="font-semibold text-[#3D2E4F]">
                          ₹{((getNumericPrice(activePlan.price)) * (activePlan.durations?.find((d: any) => d.name === selectedDuration)?.priceMultiplier || 1)).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {selectedAddOns.length > 0 && (
                        <div className="flex justify-between">
                          <span>Add-Ons:</span>
                          <span className="font-semibold text-[#3D2E4F]">
                            + ₹{selectedAddOns.reduce((sum, id) => sum + (addOnsList.find(a => a.id === id)?.price || 0), 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm sm:text-base font-bold text-[#3D2E4F] pt-3 border-t border-dashed border-purple-100">
                        <span>Grand Total:</span>
                        <span className="text-purple-700 font-extrabold text-base sm:text-lg">
                          ₹{grandTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={scrollToForm}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 px-6 rounded-xl font-bold text-base sm:text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] block text-center cursor-pointer"
                  >
                    Choose This Plan
                  </button>

                  <div className="mt-5 text-center">
                    <p className="text-[#62aec5] text-xs font-semibold tracking-wide uppercase animate-pulse">
                      ✨ Begin your transformation ✨
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3D2E4F] mb-4 font-serif">
              Ready to Begin Your Spiritual Journey?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of spiritual seekers who have transformed their lives
              with Osheen Oracle&rsquo;s guidance.
            </p>
            <div className="flex justify-center">
              <button
                onClick={scrollToForm}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3.5 rounded-xl font-bold text-base sm:text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                Select This Plan
              </button>
            </div>
          </div>
        </section>

        {/* Registration & Checkout Form Section */}
        <section id="registration-form-section" className="py-8 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-10 border border-purple-100/50">
              {formSubmitted && (
                <div className="mb-8 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 rounded-2xl animate-fade-in">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">✨</div>
                    <div>
                       <p className="text-green-800 font-semibold">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mb-8 p-4 bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 rounded-2xl animate-fade-in">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">⚠️</div>
                    <div>
                      <p className="text-red-800 font-semibold">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2E4F] mb-4 font-serif">
                  Begin Your{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Spiritual Transformation
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  You are subscribing to <span className="font-bold text-purple-600">{activePlan.name}</span> for <span className="font-bold text-purple-600">{selectedDuration}</span>
                  {selectedAddOns.length > 0 && <span> with selected add-ons</span>}.
                  <br />
                  <span className="font-extrabold text-[#3D2E4F] text-lg sm:text-xl mt-3 block">
                    Grand Total: ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-sm font-bold text-gray-700 mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white/50 text-sm text-gray-900 ${
                        errors.name ? "border-red-300" : "border-purple-100"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-red-500 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-bold text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white/50 text-sm text-gray-900 ${
                        errors.email ? "border-red-300" : "border-purple-100"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-500 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs sm:text-sm font-bold text-gray-700 mb-2"
                  >
                    Phone Number (Optional)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <select
                        id="countryCode"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleCountryCodeChange}
                        className="px-3 py-3 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white/50 text-sm text-gray-900 w-28 sm:w-32"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-grow">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white/50 text-sm text-gray-900 ${
                          errors.phone ? "border-red-300" : "border-purple-100"
                        }`}
                        placeholder="Your 10-digit contact number"
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100/50">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-purple-500 border-purple-200 rounded focus:ring-purple-400 cursor-pointer"
                  />
                  <label
                    htmlFor="newsletter"
                    className="ml-3 text-xs sm:text-sm text-gray-650 leading-relaxed cursor-pointer"
                  >
                    Receive weekly spiritual insights, moon cycle guidance, and
                    exclusive Osheen Oracle updates
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl font-bold text-base sm:text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center text-sm font-medium">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Opening Secure Payment Gateway...
                    </span>
                  ) : (
                    <>
                      <span className="mr-2 text-xl">🔮</span>
                      Begin Your Journey
                      <span className="ml-2 text-xl">🔮</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
    </div>
  );
};

export default PlanDetailsPage;
