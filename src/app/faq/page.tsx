"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HelpCircle, ChevronDown, Search } from "lucide-react";
import CommonPageHeader from "@/components/CommonPages/CommonPageHeader";
import { fetchData } from "@/utils/api/api";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    _id: "1",
    question: "What is an Astrological Reading?",
    answer: "An astrological reading analyzes the positions of the planets and stars at the time of your birth to offer insights into your personality, relationships, career, and life path."
  },
  {
    _id: "2",
    question: "How do I join the Membership plans?",
    answer: "You can explore and join our membership plans directly from the home page. Benefits include daily personalized guidance, discounts on readings, and custom spell alignments."
  },
  {
    _id: "3",
    question: "Can I extend or upgrade my membership?",
    answer: "Yes! Navigate to your Profile page, click on the 'Membership' tab, and you'll find options to Extend your current subscription or Upgrade to a higher tier."
  },
  {
    _id: "4",
    question: "How long does a tarot reading take to deliver?",
    answer: "Digital tarot readings are typically compiled and delivered to your registered email address within 24 to 48 hours of booking."
  }
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response: any = await fetchData("/faqs");
        if (Array.isArray(response)) {
          setFaqs(response);
          setFilteredFaqs(response);
        } else if (response && Array.isArray(response.data)) {
          setFaqs(response.data);
          setFilteredFaqs(response.data);
        } else {
          setFaqs(DEFAULT_FAQS);
          setFilteredFaqs(DEFAULT_FAQS);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs(DEFAULT_FAQS);
        setFilteredFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  useEffect(() => {
    const filtered = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaqs(filtered);
  }, [searchTerm, faqs]);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBB5E7]/25 via-white to-[#C4F9FF]/25 pb-20">
      <CommonPageHeader title="Frequently Asked Questions" subtitle="Home - FAQ" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 mt-12">
        {/* Search Bar */}
        <div className="relative mb-10 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-4 pl-12 rounded-full border border-purple-100 bg-white/80 backdrop-blur shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 transition"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openIndex === faq._id;
              return (
                <div
                  key={faq._id}
                  className="bg-white/80 backdrop-blur border border-purple-50/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(faq._id)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-purple-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="font-bold text-gray-800 tracking-wide font-sans text-sm sm:text-base">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transform transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-purple-600" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-purple-50/50 text-gray-600 text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 backdrop-blur rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 mb-2">No matching questions found.</p>
            <p className="text-xs text-gray-400">Try searching for other terms like &quot;membership&quot;, &quot;reading&quot; or &quot;tarot&quot;.</p>
          </div>
        )}
      </div>
    </div>
  );
}
