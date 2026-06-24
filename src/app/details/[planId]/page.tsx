// app/details/[planId]/page.tsx
"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MembershipPlan, membershipPlans } from "@/utils/plandata";
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
  const [submitError, setSubmitError] = useState<string>( "");
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
            setActivePlan(matched);
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

      const amountToCharge = getNumericPrice(activePlan.price);
      if (amountToCharge <= 0) {
        setSubmitError("Invalid plan price. Please try another plan.");
        setIsSubmitting(false);
        return;
      }

      // Create Razorpay Order
      const orderResponse = await paymentAPI.createOrder({
        amount: amountToCharge,
        currency: "INR",
        receipt: `membership_${Date.now()}`,
      });

      if (!orderResponse.success) {
        throw new Error("Failed to create order on payment gateway.");
      }

      // Open Razorpay Checkout Modal
      const options: any = {
        key: orderResponse.key_id,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "Osheen Oracle",
        description: `${activePlan.name} Membership`,
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
              // Submit the application with status "active"
              const submitResponse = await membershipApi.submitApplication({
                ...formData,
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

  return (
    <div
      className="min-h-screen "
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      {/* Header */}
      <div className="relative bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link
              href="/become-a-member"
              className="flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
            >
              ← Back to All Plans
            </Link>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {activePlan.price}
                <span className="text-lg text-gray-600">/{activePlan.period}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {activePlan.popular && (
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full text-sm mb-6 shadow-lg">
                ⭐ Most Popular Choice ⭐
              </div>
            )}
            <h1 className="text-4xl md:text-6xl text-gray-900 mb-6 leading-tight font-bold">
              {activePlan.name}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {activePlan.longDescription || activePlan.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {activePlan.features ? activePlan.features.length : 0}
              </div>
              <div className="text-gray-600 text-sm">Divine Features</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {activePlan.includedServices ? activePlan.includedServices.length : 3}
              </div>
              <div className="text-gray-600 text-sm">Core Services</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 text-sm">Energetic Support</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">VIP</div>
              <div className="text-gray-600 text-sm">Priority Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Features & Benefits */}
            <div className="lg:col-span-2 space-y-12">
              {/* Features */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  What&rsquo;s Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activePlan.features && activePlan.features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-100"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Details */}
              {activePlan.includedServices && activePlan.includedServices.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Service Details
                  </h2>
                  <div className="space-y-6">
                    {activePlan.includedServices.map((service: any, index: number) => (
                      <div
                        key={index}
                        className="border-l-4 border-purple-500 pl-6 py-2"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {service.name}
                          </h3>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {service.sessions}
                          </span>
                        </div>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {activePlan.faqs && activePlan.faqs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {activePlan.faqs.map((faq: any, index: number) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Plan Card */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-500 p-8 sticky top-28">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {activePlan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      {activePlan.price}
                    </span>
                    <span className="text-gray-600 ml-2 text-lg">
                      /{activePlan.period}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{activePlan.description}</p>
                </div>

                <button
                  onClick={scrollToForm}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl block text-center"
                >
                  Choose This Plan
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-sm">
                    ✨ Begin your transformation today ✨
                  </p>
                </div>
              </div>

              {/* Benefits */}
              {activePlan.benefits && activePlan.benefits.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {activePlan.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-3 mt-1">✦</span>
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended For */}
              {activePlan.recommendedFor && activePlan.recommendedFor.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Perfect For
                  </h3>
                  <ul className="space-y-2">
                    {activePlan.recommendedFor.map((persona: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                        <span className="text-gray-700 text-sm">{persona}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Begin Your Spiritual Journey?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of spiritual seekers who have transformed their lives
            with Osheen Oracle&rsquo;s guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Select This Plan
            </button>
          </div>
        </div>
      </section>

      {/* Registration & Checkout Form Section */}
      <section id="registration-form-section" className="py-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
            {formSubmitted && (
              <div className="mb-8 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-2xl animate-fade-in">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">✨</div>
                  <div>
                    <p className="text-green-800 font-medium">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-8 p-4 bg-gradient-to-r from-red-100 to-rose-100 border border-red-200 rounded-2xl animate-fade-in">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">⚠️</div>
                  <div>
                    <p className="text-red-800 font-medium">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Begin Your{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Spiritual Transformation
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                You are subscribing to the <span className="font-semibold text-purple-600">{activePlan.name}</span> plan ({activePlan.price}/{activePlan.period})
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
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
                      className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 bg-white/50 text-sm text-gray-900 w-32"
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
                        errors.phone ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Your 10-digit contact number"
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="flex items-center p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-500 border-gray-300 rounded focus:ring-purple-400"
                />
                <label
                  htmlFor="newsletter"
                  className="ml-3 text-sm text-gray-700"
                >
                  Receive weekly spiritual insights, moon cycle guidance, and
                  exclusive Osheen Oracle updates
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center text-sm">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
