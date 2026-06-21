import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Cancellation & Refund Policy
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At Osheen Oracle, we value transparency and commitment to our spiritual consultations and wellness services. Please read our policy below.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">
              Our Policies
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Because our astrological readings, tarot sessions, and spiritual consultations require dedicated pre-scheduled time and custom spiritual preparation, we operate under the following cancellation and refund guidelines.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="p-8 space-y-12">
            {/* Section 1 */}
            <section className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  1
                </span>
                Cancellation of Consultation
              </h3>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Cancellation of consultation meet means temporary cancellation of consultation meet going to be conducted in next 24 hours.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    1.1. Advance Cancellations
                  </h4>
                  <p>
                    Cancellations must be applied by email request at least 24 hours in advance. You will be given a chance to reschedule the consultation meet and no refund will be processed.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    1.2. Within 24 Hours
                  </h4>
                  <p>
                    No cancellation or rescheduling of the consultation meet shall be allowed within 24 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  2
                </span>
                No Refund Policy
              </h3>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  At Osheen Oracle, all services including Tarot Card Readings, Astrology Consultations, Energy Healing Sessions, and Spiritual Wellness Consultations are non-refundable.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    2.1. Post-Delivery Policy
                  </h4>
                  <p>
                    We do not offer refunds after the service is delivered.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    2.2. Non-Refundable Circumstances
                  </h4>
                  <p className="mb-2">Refunds will not be provided under the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                    <li><strong>2.2.1.</strong> Change of decision by you after booking,</li>
                    <li><strong>2.2.2.</strong> Dissatisfaction with the service/s,</li>
                    <li><strong>2.2.3.</strong> Missed or unattended consultation meet by any reason, where Osheen is not at fault,</li>
                    <li><strong>2.2.4.</strong> Incorrect information provided by you,</li>
                    <li><strong>2.2.5.</strong> Failure to join the consultation meet at the scheduled time,</li>
                    <li><strong>2.2.6.</strong> Cancellation of consultation by you. In case of such cancellation, you can reschedule the consultation meet, but refund is not allowed.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="bg-gray-800 text-white p-6 text-center">
            <p className="text-gray-300">
              By purchasing services or booking consultations on our site, you agree to this Cancellation & Refund Policy.
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
