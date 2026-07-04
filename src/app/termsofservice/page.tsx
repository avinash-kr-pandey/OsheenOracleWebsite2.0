import React from "react";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Terms & Conditions
          </h1>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            SERVICE INSTRUCTION: By accepting these service instructions, the client is willing to avail the service(s) provided by the service provider and is confirming to be bound by the terms and conditions herein detailed.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">
              Services Terms and Conditions
            </h2>
            <p className="text-purple-100 leading-relaxed">
              The Service Provider provides services relating to astrology, spirituality, numerology, reiki healing, psychic/tarot card reading, charging crystals and bracelets, energy exchange, performance of spells and pooja.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="p-8 space-y-12">
            {/* Section 1 - Payment */}
            <section className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  1
                </span>
                Payment
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The client shall pay the service provider a fee in advance upon execution of this agreement to observe the fixation of appointment with the service provider. This fee shall be paid in full and is non-refundable.
                </p>
                <p className="bg-purple-50 p-4 rounded-lg font-medium text-purple-900 border-l-4 border-purple-400">
                  Any kind of negotiation in fees is not appreciated as the service involves exchange of spiritual energies between the service provider and the client.
                </p>
                <p>
                  In case of cancellation of appointment by the client for any reason, the fees remain non-refundable and client has liberty to re-schedule the appointment with service provider. Hence, clients are requested to request the services carefully with accurate disclosure of details accompanied with full consideration.
                </p>
              </div>
            </section>

            {/* Section 2 - Specifications */}
            <section className="border-l-4 border-red-500 pl-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  2
                </span>
                Specifications & Guidelines
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-900">
                  The service provider is duty bound to provide best services and readings to utmost satisfaction of the client and work in good faith towards the client.
                </p>
                <ul className="list-disc list-inside space-y-3 ml-4">
                  <li>
                    Services invoke powerful healing energies, spiritual exchanges and do not use any kind of harmful elements or substances of black magic or hoodoo.
                  </li>
                  <li>
                    The energy exchange, astrology, psychic or tarot readings, crystal or bracelet charging, spells or pooja brings positive exchanges which are highly effective and is not disadvantageous to health of the client. It involves success rate however, these remedies can never provide 100% guarantee or certainty about results, forecast or accuracy as effectiveness varies with beliefs, conditions or timely follow up of remedies by clients.
                  </li>
                  <li>
                    <strong>Prohibited Substances:</strong> The Client availing any of the above spiritual healing, crystal or bracelet healing or spell service is strictly prohibited from consuming alcohol or any kind of narcotic or psychotropic substance or non-vegetarian food or smoking as it obstructs the success of spell and can lead to failure of granting adequate relief sought from the remedy.
                  </li>
                  <li>
                    <strong>Sacred Union:</strong> Cheating upon spouse, extra marital affairs, emotional detachment or any kind of casual, physical or emotional relationship outside sacred marital union automatically leads to failure of spells or pooja or healing due to involvement of spiritual energies.
                  </li>
                  <li>
                    <strong>Medical Issues:</strong> If client is suffering from any medical issues or health condition like depression, anxiety disorders, suicidal tendencies etc. then the service provider holds no responsibility about effectiveness of remedy upon the client. The effectiveness of remedy and healings varies according to mental, physical and health conditions of the client. In exceptional cases, it can lead to longevity of healing sessions, spells or multiple remedies, which shall warrant patience of the client throughout the completion of process.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 - Complaint */}
            <section className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  3
                </span>
                Complaint & Grievance Redressal
              </h3>
              <div className="bg-blue-50 p-6 rounded-lg text-gray-600 leading-relaxed">
                <p>
                  In case of any complaint, the client can report the query or issue affecting his or her interest to the service provider through E-mail at{" "}
                  <a href="mailto:contact@osheenoracle.com" className="font-semibold text-blue-600 underline">
                    contact@osheenoracle.com
                  </a>.
                </p>
                <p className="mt-3 font-semibold text-blue-900">
                  The client may please ensure patience for 10 days from the date of complaint for redressal of grievance by the service provider.
                </p>
              </div>
            </section>

            {/* Section 4 - Indemnification */}
            <section className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  4
                </span>
                Indemnification
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In case the client indulges in illegal activities, sends intimidating messages or content or abets or attempts to threaten or assault or use any kind of criminal force against the service provider in order to mentally or physically harass the latter or tries to illegally extort the fee deposited in advance so, the client shall indemnify the service provider against any loss be it tangible or intangible.
                </p>
                <p className="bg-red-50 p-4 rounded-lg text-red-900 border-l-4 border-red-400">
                  The service provider is open to take appropriate legal recourse against such client and the service provider shall in no case be responsible to the client for any legal action taken or loss or injury caused to the client in consequence.
                </p>
              </div>
            </section>

            {/* Section 5 - Arbitration */}
            <section className="border-l-4 border-teal-500 pl-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  5
                </span>
                Arbitration & Jurisdiction
              </h3>
              <div className="bg-teal-50 p-6 rounded-lg text-gray-600 space-y-4 leading-relaxed">
                <p>
                  Any dispute, controversy, or claim arising out of or in connection with this agreement shall be referred to Arbitration and shall be addressed by single arbitrator duly appointed in accordance with commercial arbitration rules applicable in India.
                </p>
                <p>
                  If any party approaches initiate judicial proceedings in any court so, both the parties shall be bound to submit the dispute to the exclusive jurisdiction of competent court in the territory of <strong>SAS Nagar Mohali</strong>. Indian law shall be applicable between the parties.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="bg-gray-800 text-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h4 className="font-semibold text-lg mb-2">
                  Contact Information
                </h4>
                <p className="text-gray-300">Email: contact@osheenoracle.com</p>
                <p className="text-gray-300">
                  Website: https://osheenoracle.com
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-300 text-sm">
                  <strong>Note:</strong> Terms and conditions can be changed anytime without prior notice.
                  <br />
                  Osheen Oracle reserves the right to refuse service to anyone deemed unfit.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400 border-t border-gray-700 pt-4">
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

export default TermsOfUse;
