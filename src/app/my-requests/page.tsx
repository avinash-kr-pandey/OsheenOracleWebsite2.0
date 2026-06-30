"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  userServiceRequestAPI, 
  ServiceRequest 
} from "@/utils/api/service.package.api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FiClock, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiUser, 
  FiArrowLeft, 
  FiMessageSquare,
  FiX,
  FiSmile,
  FiSearch,
  FiCheckCircle,
  FiZap,
  FiAlertCircle
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

// Helper function to format date
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const formatPreferredDate = (dateString?: string) => {
  if (!dateString) return "Not Scheduled";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// Colors mapping for status badges
const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "confirmed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "in_progress":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "pending":
    default:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed": return "🎉 Completed";
    case "confirmed": return "✅ Confirmed";
    case "in_progress": return "🔄 In Progress";
    case "cancelled": return "❌ Cancelled";
    case "pending":
    default:
      return "⏳ Pending Review";
  }
};

const getCommunicationModeLabel = (mode: string) => {
  switch (mode) {
    case "video_call": return "📹 Video Call Session";
    case "voice_note": return "🎤 Voice Note Review";
    case "voice_call":
    default:
      return "📞 Voice Call Session";
  }
};

function RequestsDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, token } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCelebration, setShowCelebration] = useState(false);

  // Check query params for successful payment parameter
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowCelebration(true);
      toast.success("Payment completed & Booking registered!", { duration: 6000, position: "top-center" });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserRequests();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const loadUserRequests = async () => {
    try {
      setLoading(true);
      const response = await userServiceRequestAPI.getMyRequests();
      if (response && response.success && response.data) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error loading user service requests:", err);
      toast.error("Failed to load service requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.subcategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="pt-32 min-h-screen bg-gradient-to-b from-[#FBB5E7]/30 to-[#C4F9FF]/30 py-12 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-100">
            <span className="text-4xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Please log in to view your spiritual service bookings and requests history.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg transition-all"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-b from-[#FBB5E7]/20 via-white to-[#C4F9FF]/20 pb-20 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">

        {/* Celebration Success Banner */}
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 rounded-3xl p-6 text-white shadow-xl shadow-green-200 mb-8 border border-green-400 relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 opacity-15 transform translate-y-4 translate-x-4">
              <span className="text-[120px]">🎉</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl animate-bounce">
                🎉
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">Spiritual Booking Confirmed!</h2>
                <p className="text-green-50/90 text-sm mt-1">
                  Your payment has been successfully processed. The session request is registered in our dashboard and our team will get in touch with you shortly.
                </p>
              </div>
              <button
                onClick={() => setShowCelebration(false)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Back Link */}
        <Link
          href="/services/ourpackages"
          className="group flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-all w-fit"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Browse More Packages
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-800 to-pink-700 bg-clip-text text-transparent">
              My Spiritual Bookings
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track status, details, schedules, and instructions for all your purchased services.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-100 w-fit">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
            <span className="text-xs text-purple-800 font-bold uppercase tracking-wider">
              {requests.length} Requests
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-md border border-white/50 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by service name, category, details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-gray-700"
            />
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm text-gray-700"
            >
              <option value="all">All Bookings</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="in_progress">🔄 In Progress</option>
              <option value="completed">🎉 Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
            <button
              onClick={loadUserRequests}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 rounded-xl text-sm font-semibold transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Requests Loading/Empty/List States */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white/80 rounded-3xl p-12 text-center shadow-lg border border-white/40">
            <div className="text-6xl mb-4">🔮</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Service Bookings Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search query or filter settings." 
                : "You haven't scheduled any spiritual wellness or consultation sessions yet."}
            </p>
            <Link
              href="/services/ourpackages"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Book Service Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((req) => (
              <motion.div
                layoutId={req._id}
                key={req._id}
                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border border-purple-100 hover:border-purple-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {req.categoryName}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mt-1 line-clamp-1">
                        {req.subcategoryName}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(req.status)}`}>
                      {getStatusLabel(req.status)}
                    </span>
                  </div>

                  {/* Quick details */}
                  <div className="space-y-2.5 text-sm text-gray-600 border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-purple-500" />
                      <span className="font-medium text-gray-700">Communication Mode:</span>
                      <span className="text-gray-800">{getCommunicationModeLabel(req.communicationMode)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-purple-500" />
                      <span className="font-medium text-gray-700">Preferred Date:</span>
                      <span className="text-gray-800">{formatPreferredDate(req.preferredDate)}</span>
                    </div>

                    {req.preferredTimeSlot && (
                      <div className="flex items-center gap-2">
                        <FiClock className="text-purple-500" />
                        <span className="font-medium text-gray-700">Time Slot:</span>
                        <span className="text-gray-800">{req.preferredTimeSlot}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                  <div className="flex items-center gap-1 font-bold text-purple-700 text-lg">
                    <FaRupeeSign className="text-sm" />
                    <span>{req.price.toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 text-left"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-md">
                <div>
                  <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedRequest.categoryName}
                  </span>
                  <h2 className="text-2xl font-bold mt-1">{selectedRequest.subcategoryName}</h2>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-white"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                
                {/* Status and Price summary banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-purple-50/50 border border-purple-100 rounded-2xl gap-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Request Status</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyles(selectedRequest.status)}`}>
                      {getStatusLabel(selectedRequest.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Session Price (Paid)</span>
                    <span className="text-2xl font-extrabold text-purple-700 flex items-center gap-0.5">
                      <FaRupeeSign className="text-lg mt-0.5" />
                      {selectedRequest.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Booking Date</span>
                    <span className="text-sm font-semibold text-gray-700">{formatDate(selectedRequest.createdAt)}</span>
                  </div>
                </div>

                {/* Separate Service Settings */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <span className="text-purple-600">💫</span> Session Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                      <span className="text-xs text-gray-500 block">Communication Channel</span>
                      <span className="font-semibold text-gray-800 mt-1 block">
                        {getCommunicationModeLabel(selectedRequest.communicationMode)}
                      </span>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                      <span className="text-xs text-gray-500 block">Duration / Validity</span>
                      <span className="font-semibold text-gray-800 mt-1 block">
                        {selectedRequest.subcategory?.duration || "30 mins"}
                      </span>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                      <span className="text-xs text-gray-500 block">Preferred Schedule Date</span>
                      <span className="font-semibold text-gray-800 mt-1 block">
                        {formatPreferredDate(selectedRequest.preferredDate)}
                      </span>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                      <span className="text-xs text-gray-500 block">Preferred Time Slot</span>
                      <span className="font-semibold text-gray-800 mt-1 block">
                        {selectedRequest.preferredTimeSlot || "To Be Scheduled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Info provided in form */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <span className="text-purple-600">👤</span> Client Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100 p-4 rounded-2xl bg-gray-50/30">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FiUser className="text-purple-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 block">Name</span>
                        <span className="font-medium text-gray-800">{selectedRequest.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FiMail className="text-purple-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 block">Email</span>
                        <span className="font-medium text-gray-800 break-all">{selectedRequest.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FiPhone className="text-purple-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 block">Phone</span>
                        <span className="font-medium text-gray-800">{selectedRequest.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700 sm:col-span-2">
                      <FiMapPin className="text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 block">Address</span>
                        <span className="font-medium text-gray-800 leading-relaxed">{selectedRequest.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Requirement details */}
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <span className="text-purple-600">📝</span> Requirements & Description
                  </h3>
                  <div className="border border-gray-100 p-4 rounded-2xl bg-gray-50/30 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedRequest.description}
                  </div>
                </div>

                {/* Admin notes (if any) */}
                {selectedRequest.adminNotes && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                      <span className="text-purple-600">💬</span> Practitioner / Admin Notes
                    </h3>
                    <div className="border border-indigo-100 p-4 rounded-2xl bg-indigo-50/20 text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap flex gap-2">
                      <FiMessageSquare className="mt-1 flex-shrink-0 text-indigo-500 text-lg" />
                      <p>{selectedRequest.adminNotes}</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex justify-end">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-2.5 rounded-xl transition"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MyRequestsPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 min-h-screen bg-gradient-to-b from-[#FBB5E7]/30 to-[#C4F9FF]/30 py-12 px-4 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <RequestsDashboardContent />
    </Suspense>
  );
}
