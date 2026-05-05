"use client"

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Mail, MapPin, Phone, MessageCircle, Loader } from "lucide-react";
import CommonPageHeader from "../CommonPages/CommonPageHeader";
import { createConsultation, ContactFormData } from "@/utils/api/contact.api";

interface MessageState {
  type: "success" | "error" | "";
  text: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    desiredDate: "",
    desiredTime: "",
    consultationType: "call",
    consultationDuration: 30,
    preferredAstrologer: "",
    astrologerSpecialization: "",
    additionalMessage: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: "", text: "" });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validate date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.desiredDate);

    if (selectedDate < today) {
      setMessage({
        type: "error",
        text: "Cannot book consultation for past dates",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await createConsultation(formData);

      if (response.success) {
        setMessage({
          type: "success",
          text:
            response.message ||
            "Consultation booked successfully! We will contact you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          desiredDate: "",
          desiredTime: "",
          consultationType: "call",
          consultationDuration: 30,
          preferredAstrologer: "",
          astrologerSpecialization: "",
          additionalMessage: "",
        });
      } else {
        setMessage({
          type: "error",
          text: response.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div>
      <CommonPageHeader title="Contacts" subtitle="Home - Contact" />
      <div className="bg-[#C4F9FF] py-12 px-4 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Section */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Get In Touch And Explore.
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Aenean id enim ut odio porttitor efficitur. Nulla commodo laoreet
              accumsan. Cras tempus odio nec mauris tempor, ac cursus enim
              finibus.
            </p>

            <div className="mt-8 space-y-6">
              {/* Have Queries */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#d2f0f7] to-[#efc7f4] shadow-md">
                  <MessageCircle className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">
                    Have Quires ?
                  </h4>
                  <p className="text-gray-500 text-sm">Chat with us</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#d2f0f7] to-[#efc7f4] shadow-md">
                  <MapPin className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">
                    Our Location
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Seestrasse St, Zurich, CH
                  </p>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#d2f0f7] to-[#efc7f4] shadow-md">
                  <Phone className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">
                    Mobile Number
                  </h4>
                  <p className="text-gray-500 text-sm">+961 348 6845</p>
                </div>
              </div>

              {/* Contact Support */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#d2f0f7] to-[#efc7f4] shadow-md">
                  <Mail className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">
                    Contact Support
                  </h4>
                  <p className="text-gray-500 text-sm">Support@osheen.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="bg-black/60 text-white rounded-2xl p-6 md:p-10 shadow-lg">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-500/20 border border-green-500"
                    : "bg-red-500/20 border border-red-500"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-2 rounded-full bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">Desired Date *</label>
                  <input
                    type="date"
                    name="desiredDate"
                    value={formData.desiredDate}
                    onChange={handleChange}
                    min={minDate}
                    required
                    className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Desired Time *</label>
                  <input
                    type="time"
                    name="desiredTime"
                    value={formData.desiredTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">
                    Consultation Type
                  </label>
                  <select
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="call">Phone Call</option>
                    <option value="video">Video Call</option>
                    <option value="chat">Chat</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    name="consultationDuration"
                    value={formData.consultationDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">
                    Preferred Astrologer (Optional)
                  </label>
                  <input
                    type="text"
                    name="preferredAstrologer"
                    value={formData.preferredAstrologer}
                    onChange={handleChange}
                    placeholder="Name of preferred astrologer"
                    className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">
                    Specialization (Optional)
                  </label>
                  <select
                    name="astrologerSpecialization"
                    value={formData.astrologerSpecialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="Vedic">Vedic Astrology</option>
                    <option value="Tarot">Tarot Reading</option>
                    <option value="Numerology">Numerology</option>
                    <option value="Palmistry">Palmistry</option>
                    <option value="Vastu">Vastu Shastra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Additional Message</label>
                <textarea
                  rows={4}
                  name="additionalMessage"
                  value={formData.additionalMessage}
                  onChange={handleChange}
                  placeholder="Please write any note here..."
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <span className="text-xs">✗</span> SEND{" "}
                      <span className="text-xs">✗</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
