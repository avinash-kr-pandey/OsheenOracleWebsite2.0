"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  membershipApi,
  MembershipPlan,
  Benefit,
  Stat,
  Testimonial,
} from "@/utils/api/becomeamember.api";

const BecomeAMember: React.FC = () => {
  const router = useRouter();

  // State for dynamic content
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [contentError, setContentError] = useState<string>("");

  // Fetch all dynamic content on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await membershipApi.getAllContent();

        console.log("API Response:", response); // Debug log

        if (response.success && response.data) {
          setMembershipPlans(response.data.membershipPlans || []);
          setBenefits(response.data.benefits || []);
          setStats(response.data.stats || []);
          setTestimonials(response.data.testimonials || []);

          // Debug: Check if data loaded
          console.log("Plans loaded:", response.data.membershipPlans?.length);
          console.log("Stats loaded:", response.data.stats?.length);
        } else {
          setContentError(response.message || "Failed to load content");
        }
      } catch (error: unknown) {
        console.error("Error fetching content:", error);
        setContentError("Failed to load content. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handlePlanDetails = (planId: string): void => {
    router.push(`/details/${planId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%)",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-700 text-lg">Loading spiritual wisdom...</p>
        </div>
      </div>
    );
  }

  // Show error if content failed to load
  if (contentError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%)",
        }}
      >
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl max-w-md">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Content
          </h2>
          <p className="text-gray-700 mb-4">{contentError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="become-a-member"
      className="min-h-screen overflow-hidden relative"
      style={{
        fontFamily: "var(--font-montserrat)",
        background: "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-spin-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-ping-slow"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200/50 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 animate-ping"></span>
            <span className="text-purple-700 font-medium text-sm">
              Join {stats.find(s => s.number === "5000+")?.number || "5000+"} Happy Lives
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl text-gray-900 mb-6 leading-tight animate-slide-up">
            Awaken Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Spiritual Journey
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            Join Osheen Oracle&rsquo;s sacred community where ancient wisdom
            meets modern spirituality. Transform your life with divine guidance
            and energetic healing.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up animation-delay-400">
            {stats.length > 0 ? (
              stats.map((stat, index) => (
                <div
                  key={stat._id || index}
                  className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-white/20"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium mt-2 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))
            ) : (
              // Fallback stats if no data
              <>
                <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600">
                    10+
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">
                    Years of Experience
                  </div>
                </div>
                <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600">
                    5000+
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">
                    Happy Lives
                  </div>
                </div>
                <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600">
                    1000+
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">
                    Kundli Analysis Completed
                  </div>
                </div>
                <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600">
                    95%
                  </div>
                  <div className="text-gray-600 mt-2 text-sm">
                    Client Satisfaction Rate
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl text-gray-900 mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Spiritual Path
              </span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Each plan is crafted to support your unique spiritual journey and
              personal growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {membershipPlans.length > 0 ? (
              membershipPlans.map((plan, index) => (
                <div
                  key={plan._id || plan.id}
                  className={`animate-slide-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="p-6 border-2 rounded-2xl border-white/50 bg-white/80 backdrop-blur-sm hover:border-purple-300 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 ml-2 text-lg">
                          /{plan.period}
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow mb-6">
                      <ul className="space-y-3">
                        {plan.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start text-left">
                            <span className="text-purple-500 mr-3 mt-0.5 flex-shrink-0">
                              ✨
                            </span>
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                        {plan.features.length > 4 && (
                          <li className="text-sm text-purple-500 ml-6">
                            +{plan.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-3 mt-auto">
                      <button
                        type="button"
                        onClick={() => handlePlanDetails(plan._id || plan.id)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] ${plan.popular
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg"
                          : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-md"
                          }`}
                      >
                        Select Plan
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                No membership plans available. Please check back later.
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl text-gray-900 mb-4">
              Transformational{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Stories
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id || index}
                  className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl mb-5 animate-pulse">
                    {testimonial.avatar}
                  </div>
                  <p className="text-gray-700 mb-6 italic text-sm leading-relaxed">
                    {testimonial.comment}
                  </p>
                  <div>
                    <div className="font-bold text-gray-900 text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.zodiac}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.date}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50">
                  <div className="text-4xl mb-5">🙏</div>
                  <p className="text-gray-700 mb-6 italic">
                    Osheen&apos;s guidance transformed my life.
                  </p>
                  <div className="font-bold">Priya Sharma</div>
                  <div className="text-gray-600 text-sm">Basic Aura Member</div>
                </div>
                <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50">
                  <div className="text-4xl mb-5">💖</div>
                  <p className="text-gray-700 mb-6 italic">
                    The tarot insights helped me make crucial decisions.
                  </p>
                  <div className="font-bold">Rahul Verma</div>
                  <div className="text-gray-600 text-sm">
                    Tarot Insight Member
                  </div>
                </div>
                <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50">
                  <div className="text-4xl mb-5">🌟</div>
                  <p className="text-gray-700 mb-6 italic">
                    I manifested my dream job within 3 months!
                  </p>
                  <div className="font-bold">Anita Patel</div>
                  <div className="text-gray-600 text-sm">Premium Member</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>



      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pingSlow {
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 20s linear infinite;
        }

        .animate-ping-slow {
          animation: pingSlow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default BecomeAMember;
