"use client";
import React, { useEffect, useState } from "react";

const PolicyModal = ({
  isOpen,
  onClose,
  onAgree,
  defaultTab = "privacy",
}: {
  isOpen: boolean;
  onClose: () => void;
  onAgree?: () => void;
  defaultTab?: "privacy" | "terms";
}) => {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">(defaultTab);


  // Reset tab when modal opens with new defaultTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white max-w-6xl w-full rounded-2xl shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div></div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs - Only show if modal is opened from "view all" or similar */}
        <div className="flex border-b bg-gray-50">
          <button
            className={`px-8 py-2 font-semibold text-lg flex-1 transition-all ${
              activeTab === "privacy"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm"
                : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            📄 Privacy Policy
          </button>
          <button
            className={`px-8 py-4 font-semibold text-lg flex-1 transition-all ${
              activeTab === "terms"
                ? "text-purple-600 border-b-2 border-purple-600 bg-white shadow-sm"
                : "text-gray-600 hover:text-purple-500 hover:bg-purple-50"
            }`}
            onClick={() => setActiveTab("terms")}
          >
            📝 Terms of Use
          </button>
        </div>

        {/* Content - Scrollable Area */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          {activeTab === "privacy" ? (
            <div className="space-y-8">
              {/* Introduction */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  At <strong>Osheen Oracle</strong>, we are committed to protecting your privacy and ensuring that your personal information is handled safely and responsibly.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Section 1 */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Information We Collect</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-500">👤</span>
                        <h4 className="font-semibold text-gray-800">Personal Information</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Name, email, phone number when you contact us or register for services.
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-500">📊</span>
                        <h4 className="font-semibold text-gray-800">Usage Data</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        IP addresses, browser types, device info, pages viewed for analytics.
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-500">🍪</span>
                        <h4 className="font-semibold text-gray-800">Cookies</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        For enhanced user experience. Adjust browser settings to refuse.
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-yellow-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500">💬</span>
                        <h4 className="font-semibold text-gray-800">Communication Data</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Emails, messages, and any information you share with us.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">How We Use Your Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: "🎯", title: "Service Delivery", desc: "Provide requested services" },
                      { icon: "🚀", title: "Improvement", desc: "Optimize website performance" },
                      { icon: "📧", title: "Communications", desc: "Send updates with consent" },
                      { icon: "🛡️", title: "Security", desc: "Protect against fraud" },
                      { icon: "📈", title: "Analytics", desc: "Analyze usage patterns" },
                      { icon: "🤝", title: "Support", desc: "Respond to inquiries" },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.title}</h4>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3 */}
                <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Data Protection & Security</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-red-500 text-2xl">🔐</span>
                        <h4 className="font-semibold text-gray-800">Security Measures</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Encryption</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Firewalls</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Secure Servers</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Regular Audits</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <span className="text-yellow-600 text-xl">⚠️</span>
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                          <p className="text-yellow-700 text-sm">
                            While we implement industry-standard security, no method is 100% secure. We continuously work to protect your data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold">
                      4
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Your Rights</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: "👁️", title: "Access", color: "blue" },
                      { icon: "✏️", title: "Correction", color: "green" },
                      { icon: "🗑️", title: "Deletion", color: "red" },
                      { icon: "🚫", title: "Opt-Out", color: "purple" },
                    ].map((item, idx) => (
                      <div key={idx} className={`bg-white p-4 rounded-lg shadow-sm text-center`}>
                        <div className={`w-12 h-12 ${item.color === 'blue' ? 'bg-blue-100' : item.color === 'green' ? 'bg-green-100' : item.color === 'red' ? 'bg-red-100' : 'bg-purple-100'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-500">📧</span>
                        <div>
                          <p className="font-medium text-gray-700">Email</p>
                          <p className="text-gray-600">Oracleosheen2@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-green-500">🌐</span>
                        <div>
                          <p className="font-medium text-gray-700">Website</p>
                          <p className="text-gray-600">https://osheenoracle.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-purple-500">📱</span>
                        <div>
                          <p className="font-medium text-gray-700">Phone</p>
                          <p className="text-gray-600">+91 8146668328</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">📱</span>
                        <div>
                          <p className="font-medium text-gray-700">Alternate Phone</p>
                          <p className="text-gray-600">+91 99158 10965</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Introduction */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  SERVICE INSTRUCTION: By accepting these service instructions, the client is willing to avail the service(s) provided by the service provider and is confirming to be bound by the terms and conditions.
                </p>
              </div>

              {/* Service Terms */}
              <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Services Terms and Conditions</h3>
                <p className="text-gray-600 text-sm">
                  The Service Provider provides services relating to astrology, spirituality, numerology, reiki healing, psychic/tarot card reading, charging crystals and bracelets, energy exchange, performance of spells and pooja.
                </p>
              </div>

              {/* Main Terms Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Payment */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">1. Payment</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Fee is payable in advance and is non-refundable. Negotiation in fees is not appreciated as the service involves exchange of spiritual energies. If appointment is cancelled, fees remain non-refundable but can be rescheduled.
                  </p>
                </div>

                {/* Complaint */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">2. Complaint</h4>
                  <p className="text-gray-600 text-xs leading-relaxed text-blue-800">
                    Query or issue affecting interests can be reported to contact@osheenoracle.com. Please ensure patience of 10 days for redressal of grievance.
                  </p>
                </div>

                {/* Sacred Union */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">3. Sacred Union & Restrictions</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Cheating, extra marital affairs, or emotional detachment outside sacred marital union leads to failure of spells. Consuming alcohol, smoking, non-veg, or narcotics is strictly prohibited as it obstructs energy.
                  </p>
                </div>

                {/* Health & Support */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2">4. Medical Notice</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    If client is suffering from depression, anxiety, suicidal tendencies, the provider holds no responsibility. Remedies cannot guarantee 100% certainty.
                  </p>
                </div>
              </div>

              {/* Legal Recourse */}
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                <h4 className="font-bold text-red-900 mb-2">5. Indemnification & Arbitration</h4>
                <p className="text-red-700 text-xs leading-relaxed">
                  In case the client attempts to threaten, mentally/physically harass, or illegally extort fees, the client shall indemnify the service provider against all losses. Dispute, controversy, or claim shall be referred to Arbitration in SAS Nagar Mohali, India under commercial arbitration rules.
                </p>
              </div>

              {/* Acceptance */}
              <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-200 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Acceptance of Terms</h3>
                <p className="text-gray-600 text-sm mb-3">
                  I accept these Terms & Conditions at my free will and volunteered consent.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {onAgree && (
          <div className="border-t p-4 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-2 border rounded-xl hover:bg-gray-100 transition-all text-sm font-semibold text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAgree();
                onClose();
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold shadow-md cursor-pointer"
            >
              I Agree
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyModal;