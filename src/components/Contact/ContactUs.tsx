"use client"

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Mail, MapPin, Phone, MessageCircle, Loader } from "lucide-react";
import CommonPageHeader from "../CommonPages/CommonPageHeader";
import { createConsultation } from "@/utils/api/contact.api";
import toast from "react-hot-toast";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await createConsultation(formData);

      if (response.success) {
        toast.success(response.message || "Message sent successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error(response.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CommonPageHeader title="Contacts" subtitle="Home - Contact Us" />
      <div className="bg-[#C4F9FF] py-12 px-4 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Section */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Get In Touch And Explore.
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Have a question or want to book a session? Reach out to us and we'll get back to you as soon as possible.
            </p>

            <div className="mt-8 space-y-6">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#d2f0f7] to-[#efc7f4] shadow-md">
                  <MapPin className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">Our Location</h4>
                  <p className="text-gray-500 text-sm">Mohali, Punjab, India</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#d2f0f7] to-[#efc7f4] shadow-md">
                  <Phone className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">Phone</h4>
                  <p className="text-gray-500 text-sm">+91 81466 68328, +91 98770 97916, +91 81469 77206</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#d2f0f7] to-[#efc7f4] shadow-md">
                  <Mail className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-lg">Email</h4>
                  <p className="text-gray-500 text-sm">contact@osheenoracle.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="bg-black/60 text-white rounded-2xl p-6 md:p-10 shadow-lg">

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
                  maxLength={10}
                  className="w-full px-4 py-2 bg-white rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Message</label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please write your message here..."
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      SEND MESSAGE
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
