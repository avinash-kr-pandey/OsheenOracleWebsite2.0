"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaStar,
  FaUndo,
  FaEye,
  FaShoppingBag,
} from "react-icons/fa";
import { fetchData, setAuthToken, postData, putData } from "@/utils/api/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import axios from "axios";
import { userServiceRequestAPI, ServiceRequest } from "@/utils/api/service.package.api";

// Define TypeScript interfaces
interface OrderApiResponse {
  _id?: string;
  id?: number | string;
  productName: string;
  price: string | number;
  date?: string;
  createdAt?: string;
  status?: string;
  image?: string;
  originalPrice?: string | number;
  quantity?: number;
  trackingId?: string;
  deliveryDate?: string;
  size?: string;
  color?: string;
  productId?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  carrier?: string;
}

interface Order {
  id: string | number;
  productName: string;
  price: string;
  date: string;
  status: "Pending" | "Packed" | "Shipped" | "Reached" | "Cancelled" | "Processing" | "Delivered";
  image: string;
  originalPrice?: string;
  reason?: string;
  quantity?: number;
  trackingId?: string;
  deliveryDate?: string;
  size?: string;
  color?: string;
  productId?: string;
  orderDate?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  carrier?: string;
}

// Define proper API response types
interface ApiResponse {
  data?: OrderApiResponse[] | unknown;
  orders?: OrderApiResponse[];
  [key: string]: unknown;
}

interface ErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

// Define request body types
interface StatusUpdateBody {
  status: string;
}

interface ReviewSubmitBody {
  productId: string;
  rating: number;
  comment: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number>(5);

  // Service requests states
  const [activeTab, setActiveTab] = useState<"products" | "services">("products");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [activeRequestFilter, setActiveRequestFilter] = useState<string>("all");

  // Get authentication state - WITH TOKEN
  const { token, isAuthenticated, user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  // Set auth token when component mounts or token changes
  useEffect(() => {
    console.log("Token in Orders:", token ? "Token available" : "No token");

    if (token) {
      setAuthToken(token);
      console.log("Auth token set successfully for Orders");
    }
  }, [token]);

  // Fetch orders and service requests when authenticated
  useEffect(() => {
    if (authLoading) return; // Wait until AuthContext initializes

    if (isAuthenticated && token) {
      console.log("Fetching orders and service requests for user:", user?.email);
      setLoading(true);
      Promise.all([
        fetchOrders(),
        fetchServiceRequests()
      ]).finally(() => {
        setLoading(false);
      });
    } else {
      console.log("Not authenticated, cannot fetch history");
      setLoading(false);
      toast.error("Please login to view history");
    }
  }, [isAuthenticated, token, user, authLoading]);

  const fetchServiceRequests = async () => {
    try {
      const response = await userServiceRequestAPI.getMyRequests();
      if (response && response.success && response.data) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error loading user service requests:", err);
      setRequests([]);
    }
  };

  // Helper functions for Service Bookings
  const getRequestsCountByStatus = (status: string) => {
    if (status === "all") return requests.length;
    return requests.filter((req) => req.status.toLowerCase() === status.toLowerCase()).length;
  };

  const getServiceStatusStyles = (status: string) => {
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

  const getServiceStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "Completed";
      case "confirmed": return "Confirmed";
      case "in_progress": return "In Progress";
      case "cancelled": return "Cancelled";
      case "pending":
      default:
        return "Pending Review";
    }
  };

  const getServiceCommunicationModeLabel = (mode: string) => {
    switch (mode) {
      case "video_call": return "📹 Video Call";
      case "voice_note": return "🎤 Voice Note";
      case "voice_call":
      default:
        return "📞 Voice Call";
    }
  };

  const getServiceTrackingSteps = (status: string) => {
    const s = status.toLowerCase();
    
    if (s === "cancelled") {
      return [
        { status: "Booking Submitted", completed: true, active: false },
        { status: "Cancelled", completed: true, active: true, isError: true }
      ];
    }

    return [
      { 
        status: "Booking Submitted", 
        completed: true, 
        active: s === "pending" 
      },
      { 
        status: "Confirmed", 
        completed: ["confirmed", "in_progress", "completed"].includes(s), 
        active: s === "confirmed" 
      },
      { 
        status: "Session in Progress", 
        completed: ["in_progress", "completed"].includes(s), 
        active: s === "in_progress" 
      },
      { 
        status: "Completed", 
        completed: s === "completed", 
        active: s === "completed" 
      },
    ];
  };

  const filteredRequests = requests.filter((req) => {
    if (activeRequestFilter === "all") return true;
    return req.status.toLowerCase() === activeRequestFilter.toLowerCase();
  });

  const fetchOrders = async () => {
    if (!isAuthenticated || !token) {
      console.warn("Not authenticated, skipping orders fetch");
      return;
    }

    try {
      setLoading(true);
      console.log("Making API request to /orders...");

      const response = await fetchData("/orders");
      console.log("Orders API Response:", response);

      // ✅ HANDLE ALL POSSIBLE RESPONSE SHAPES - TYPE SAFE
      let ordersData: OrderApiResponse[] = [];

      if (Array.isArray(response)) {
        // Case 1: Response is directly an array
        ordersData = response;
      } else {
        // Case 2: Response is an object with data/orders property
        const apiResponse = response as ApiResponse;
        if (Array.isArray(apiResponse.data)) {
          ordersData = apiResponse.data as OrderApiResponse[];
        } else if (Array.isArray(apiResponse.orders)) {
          ordersData = apiResponse.orders;
        }
        // Case 3: Response is some other format - log for debugging
        else {
          console.log("Unexpected response format:", response);
        }
      }

      if (ordersData.length === 0) {
        console.log("No orders found");
        setOrders([]);
        return;
      }

      const formattedOrders = ordersData.map((order: OrderApiResponse) => {
        const orderId = order._id || order.id || String(Math.random());
        return {
          id: orderId,
          productName: order.productName || "Product",
          price: order.price ? `₹${order.price}` : "₹0",
          date:
            order.date ||
            order.createdAt ||
            new Date().toISOString().split("T")[0],
          status: (order.status || "Pending") as any,
          image: order.image || "/placeholder-product.jpg",
          originalPrice: order.originalPrice
            ? `₹${order.originalPrice}`
            : undefined,
          reason: getStatusReason(order.status || "Pending"),
          quantity: order.quantity || 1,
          trackingId:
            order.trackingId || `TRK${String(orderId).substring(0, 9).toUpperCase()}`,
          deliveryDate:
            order.deliveryDate ||
            calculateDeliveryDate(
              order.date || order.createdAt || new Date().toISOString().split("T")[0]
            ),
          size: order.size || "Standard",
          color: order.color || "Default",
          productId: order.productId,
          orderDate: order.date || order.createdAt,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          carrier: order.carrier || "",
        };
      });

      setOrders(formattedOrders);
      toast.success(`Loaded ${formattedOrders.length} order(s)`);
    } catch (error) {
      console.error("Error fetching orders:", error);

      // ✅ Type-safe error handling
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;

        if (status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else if (status === 403) {
          toast.error("You don't have permission to view orders");
        } else if (status === 404) {
          // No orders endpoint - this might be expected
          console.log("Orders endpoint not found - may be normal");
          setOrders([]);
        } else {
          toast.error(`Server error: ${errorMessage}`);
        }
      } else if (error instanceof Error) {
        toast.error(error.message || "Failed to load orders");
      } else {
        toast.error("Something went wrong while fetching orders");
      }

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate delivery date
  const calculateDeliveryDate = (orderDate: string) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7); // Add 7 days for delivery
    return date.toISOString().split("T")[0];
  };

  // Helper function to get status reason
  const getStatusReason = (status: string) => {
    switch (status.toLowerCase()) {
      case "reached":
      case "delivered":
        return "Successfully reached/delivered to your address.";
      case "transit":
        return "Your order is in transit to your destination.";
      case "shipped":
        return "Expected delivery within 3-5 business days.";
      case "cancelled":
        return "Order was cancelled as requested.";
      case "packed":
        return "Your order is packed and ready for dispatch.";
      case "pending":
      case "processing":
      default:
        return "Your order is placed and is pending processing.";
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(
    (order) =>
      activeFilter === "all" ||
      order.status.toLowerCase() === activeFilter.toLowerCase()
  );

  const getStatusIcon = (status: Order["status"]) => {
    switch (status.toLowerCase()) {
      case "reached":
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "transit":
        return <FaShippingFast className="text-cyan-500" />;
      case "shipped":
        return <FaShippingFast className="text-blue-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "packed":
        return <FaBox className="text-indigo-500" />;
      default:
        return <FaBox className="text-amber-500" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status.toLowerCase()) {
      case "reached":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "transit":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "packed":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const cancelOrder = async (orderId: string | number) => {
    if (!isAuthenticated || !token) {
      toast.error("Please login to cancel order");
      return;
    }

    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const statusUpdate: StatusUpdateBody = { status: "Cancelled" };
      await putData(`/orders/${orderId}/status`, statusUpdate);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );

      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);

      const err = error as ErrorResponse;
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to cancel order");
      }
    }
  };

  const reorderProduct = (order: Order) => {
    if (!isAuthenticated || !token) {
      toast.error("Please login to add to cart");
      return;
    }

    try {
      const priceString = String(order.price || "0");
      const cleanPrice = parseFloat(priceString.replace(/[₹,]/g, "")) || 0;

      addToCart({
        id: order.productId || order.id,
        name: order.productName,
        price: cleanPrice,
        image: order.image || "/placeholder-product.jpg",
        quantity: order.quantity || 1,
        size: order.size,
        color: order.color,
      });

      toast.success(`Added ${order.productName} to cart!`);
    } catch (error) {
      console.error("Error reordering product:", error);
      toast.error("Failed to add to cart");
    }
  };

  const writeReview = async (order: Order) => {
    if (!isAuthenticated || !token) {
      toast.error("Please login to write review");
      return;
    }

    let resolvedProductId = order.productId;

    // Fallback: if order doesn't have a productId (e.g. legacy order), try to find the product by name
    if (!resolvedProductId) {
      try {
        console.log(`Searching for product ID for legacy order: "${order.productName}"`);
        const productsResponse = await fetchData("/products");
        let productsList: any[] = [];
        
        if (Array.isArray(productsResponse)) {
          productsList = productsResponse;
        } else if (productsResponse && typeof productsResponse === "object") {
          const res = productsResponse as any;
          if (Array.isArray(res.data)) productsList = res.data;
          else if (Array.isArray(res.products)) productsList = res.products;
        }

        const matchedProduct = productsList.find(
          (p: any) => p.name?.toLowerCase().trim() === order.productName?.toLowerCase().trim()
        );

        if (matchedProduct) {
          resolvedProductId = matchedProduct._id || matchedProduct.id;
          console.log(`Resolved legacy product ID for "${order.productName}": ${resolvedProductId}`);
        }
      } catch (err) {
        console.error("Error resolving legacy product ID:", err);
      }
    }

    setReviewProduct({
      ...order,
      productId: resolvedProductId,
    });
    setSelectedRating(5);
    setShowReviewModal(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewProduct || !isAuthenticated || !token) {
      toast.error("Please login to submit review");
      return;
    }

    const targetProductId = reviewProduct.productId;
    if (!targetProductId) {
      toast.error("Could not resolve product ID for this order. Review cannot be submitted.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const reviewText = (form.review as HTMLTextAreaElement)?.value || "";

    try {
      await postData(`/products/${targetProductId}/reviews`, {
        name: user?.name || "Anonymous",
        rating: selectedRating,
        comment: reviewText,
      });

      toast.success(`Review submitted for ${reviewProduct.productName}!`);
      setShowReviewModal(false);
      setReviewProduct(null);
    } catch (error) {
      console.error("Error submitting review:", error);

      const err = error as ErrorResponse;
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  const getOrderCountByStatus = (status: string) => {
    if (status === "all") return orders.length;
    return orders.filter(
      (order) => order.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  // Calculate savings
  const calculateSavings = (order: Order) => {
    if (!order.originalPrice) return 0;

    const priceNum = parseInt(order.price.replace(/[₹,]/g, "")) || 0;
    const originalPriceNum =
      parseInt(order.originalPrice.replace(/[₹,]/g, "")) || 0;

    return originalPriceNum > priceNum ? originalPriceNum - priceNum : 0;
  };

  // Show loading spinner if auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-pink-600">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Debug Info (Remove in production) */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p>
            <strong>Debug Info:</strong> User: {user?.email || "Not logged in"},
            Authenticated: {isAuthenticated ? "Yes" : "No"}
          </p>
          <p>Orders: {orders.length} | Bookings: {requests.length}</p>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FaShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent mb-3">
            My Purchase History
          </h1>
          <p className="text-gray-600 text-lg">
            Track and manage your orders and spiritual sessions effortlessly
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-md border border-gray-100 flex gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === "products"
                  ? "bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              🛍️ Product Orders
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === "services"
                  ? "bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              🔮 Spiritual Bookings
            </button>
          </div>
        </div>

        {/* ==================== PRODUCT TAB CONTENT ==================== */}
        {activeTab === "products" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  status: "all",
                  label: "Total Orders",
                  icon: "📦",
                  color: "from-pink-500 to-amber-500",
                },
                {
                  status: "packed",
                  label: "Packed",
                  icon: "📦",
                  color: "from-indigo-400 to-indigo-600",
                },
                {
                  status: "shipped",
                  label: "Shipped",
                  icon: "🚚",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  status: "reached",
                  label: "Reached",
                  icon: "✅",
                  color: "from-green-400 to-green-600",
                },
              ].map((stat) => (
                <div
                  key={stat.status}
                  className={`bg-white rounded-2xl p-4 shadow-lg border-l-4 transform hover:scale-105 transition-all duration-300 cursor-pointer ${
                    activeFilter === stat.status ? "border-pink-500 bg-pink-50/10" : "border-gray-200"
                  }`}
                  onClick={() => setActiveFilter(stat.status)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {getOrderCountByStatus(stat.status)}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white`}
                    >
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: "all", label: "All Orders" },
                { key: "pending", label: "Pending" },
                { key: "packed", label: "Packed" },
                { key: "shipped", label: "Shipped" },
                { key: "reached", label: "Reached" },
                { key: "cancelled", label: "Cancelled" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeFilter === filter.key
                      ? "bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-amber-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white text-lg font-semibold">
                    Order History
                  </h2>
                  <span className="bg-white bg-opacity-20 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {filteredOrders.length} orders
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <div
                      key={order.id}
                      className="p-6 transition-all duration-300 hover:bg-gray-50 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border-2 border-amber-200 flex-shrink-0">
                            <Image
                              src={order.image}
                              alt={order.productName}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-product.jpg";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-800 mb-1">
                              {order.productName}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                              <span>Size: {order.size}</span>
                              <span>Color: {order.color}</span>
                              <span>Qty: {order.quantity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-pink-600">
                                {order.price}
                              </span>
                              {order.originalPrice && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">
                                    {order.originalPrice}
                                  </span>
                                  {calculateSavings(order) > 0 && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      Save ₹{calculateSavings(order)}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Ordered on {order.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start lg:items-end gap-3">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="font-medium capitalize">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors duration-200 text-sm"
                            >
                              <FaEye className="w-3 h-3" /> View Details
                            </button>

                            {(order.status.toLowerCase() === "delivered" || order.status.toLowerCase() === "reached") && (
                              <button
                                onClick={() => writeReview(order)}
                                className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors duration-200 text-sm"
                              >
                                <FaStar className="w-3 h-3" /> Write Review
                              </button>
                            )}

                            {["pending", "processing", "packed"].includes(order.status.toLowerCase()) && (
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm"
                              >
                                <FaTimesCircle className="w-3 h-3" /> Cancel Order
                              </button>
                            )}

                            <button
                              onClick={() => reorderProduct(order)}
                              className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm"
                            >
                              <FaUndo className="w-3 h-3" /> Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 text-lg mb-4">
                      No orders found matching this status filter.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/products")}
                      className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ==================== SERVICES TAB CONTENT ==================== */}
        {activeTab === "services" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                {
                  status: "all",
                  label: "Total Bookings",
                  icon: "🔮",
                  color: "from-pink-500 to-amber-500",
                },
                {
                  status: "pending",
                  label: "Pending",
                  icon: "⏳",
                  color: "from-yellow-400 to-yellow-600",
                },
                {
                  status: "confirmed",
                  label: "Confirmed",
                  icon: "✅",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  status: "in_progress",
                  label: "In Progress",
                  icon: "🔄",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  status: "completed",
                  label: "Completed",
                  icon: "🎉",
                  color: "from-green-400 to-green-600",
                },
              ].map((stat) => (
                <div
                  key={stat.status}
                  className={`bg-white rounded-2xl p-4 shadow-lg border-l-4 transform hover:scale-105 transition-all duration-300 cursor-pointer ${
                    activeRequestFilter === stat.status ? "border-pink-500 bg-pink-50/10" : "border-gray-200"
                  }`}
                  onClick={() => setActiveRequestFilter(stat.status)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {getRequestsCountByStatus(stat.status)}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center text-white`}
                    >
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: "all", label: "All Bookings" },
                { key: "pending", label: "Pending" },
                { key: "confirmed", label: "Confirmed" },
                { key: "in_progress", label: "In Progress" },
                { key: "completed", label: "Completed" },
                { key: "cancelled", label: "Cancelled" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveRequestFilter(filter.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeRequestFilter === filter.key
                      ? "bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-amber-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white text-lg font-semibold">
                    Spiritual Bookings
                  </h2>
                  <span className="bg-white bg-opacity-20 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {filteredRequests.length} bookings
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req, index) => (
                    <div
                      key={req._id}
                      className="p-6 transition-all duration-300 hover:bg-gray-50 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden border-2 border-purple-200 flex-shrink-0 flex items-center justify-center text-4xl">
                            🔮
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {req.categoryName}
                            </span>
                            <h3 className="font-semibold text-lg text-gray-800 mt-1 mb-1">
                              {req.subcategoryName}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-2">
                              <span>Mode: {getServiceCommunicationModeLabel(req.communicationMode)}</span>
                              {req.preferredDate && (
                                <span>Date: {new Date(req.preferredDate).toLocaleDateString()}</span>
                              )}
                              {req.preferredTimeSlot && (
                                <span>Slot: {req.preferredTimeSlot}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-pink-600">
                                ₹{req.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Booked on {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start lg:items-end gap-3">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${getServiceStatusStyles(
                              req.status
                            )}`}
                          >
                            <span className="font-medium">
                              {getServiceStatusLabel(req.status)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="inline-flex items-center gap-1 bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                            >
                              <FaEye className="h-4 w-4" /> View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 text-lg mb-4">
                      No service bookings found matching this status filter.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/services/ourpackages")}
                      className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      Book a Service
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Order Details
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-white rounded-xl overflow-hidden border-2 border-amber-200 flex-shrink-0">
                    <Image
                      src={selectedOrder.image}
                      alt={selectedOrder.productName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-800 mb-2">
                      {selectedOrder.productName}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Size:</span>{" "}
                        {selectedOrder.size}
                      </div>
                      <div>
                        <span className="font-medium">Color:</span>{" "}
                        {selectedOrder.color}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span>{" "}
                        {selectedOrder.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Order Date:</span>{" "}
                        {selectedOrder.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-pink-600 text-lg">
                        {selectedOrder.price}
                      </span>
                      {selectedOrder.originalPrice && (
                        <span className="text-gray-500 line-through">
                          {selectedOrder.originalPrice}
                        </span>
                      )}
                      {selectedOrder.originalPrice &&
                        calculateSavings(selectedOrder) > 0 && (
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Save ₹{calculateSavings(selectedOrder)}
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">
                      Order Status
                    </span>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                        selectedOrder!.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder!.status)}
                      <span className="font-medium capitalize">
                        {selectedOrder!.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {selectedOrder!.reason}
                  </p>
                </div>

                {/* Additional Information */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">
                    Order Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Order ID:</span> #
                      {selectedOrder.id}
                    </div>
                    <div>
                      <span className="font-medium">Tracking ID:</span>{" "}
                      {selectedOrder.trackingId}
                    </div>
                    <div>
                      <span className="font-medium">Expected Delivery:</span>{" "}
                      {selectedOrder.deliveryDate || "Not available"}
                    </div>
                    {selectedOrder.carrier && (
                      <div>
                        <span className="font-medium">Carrier:</span>{" "}
                        {selectedOrder.carrier}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {selectedOrder.paymentMethod || "Credit Card"}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Shipping Address
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Close
                  </button>
                  {selectedOrder.status.toLowerCase() === "processing" && (
                    <button
                      onClick={() => {
                        cancelOrder(selectedOrder.id);
                        setSelectedOrder(null);
                      }}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => {
                      reorderProduct(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-xl hover:from-pink-600 hover:to-amber-600 transition-all duration-300 font-medium"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spiritual Booking Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>🔮</span> Spiritual Booking Details
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Service Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex-shrink-0 flex items-center justify-center text-4xl border-2 border-purple-200">
                    🔮
                  </div>
                  <div className="flex-1">
                    <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedRequest.categoryName}
                    </span>
                    <h3 className="font-semibold text-xl text-gray-800 mt-1 mb-2">
                      {selectedRequest.subcategoryName}
                    </h3>
                    <div className="flex items-center gap-2 text-lg font-bold text-pink-600">
                      ₹{selectedRequest.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                {/* Booking Status */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">Booking Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getServiceStatusStyles(selectedRequest.status)}`}>
                      {getServiceStatusLabel(selectedRequest.status)}
                    </span>
                  </div>
                  {selectedRequest.adminNotes && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium text-gray-700">Message from Guide:</span>
                      <p className="text-gray-600 italic bg-white p-3 rounded-lg border border-gray-100 mt-1 whitespace-pre-line">
                        {selectedRequest.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Session Booking Progress */}
                <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm">
                  <h4 className="font-semibold text-purple-950 mb-4 flex items-center gap-2">
                    <span>📍</span> Session Booking Progress
                  </h4>
                  <div className="relative space-y-4">
                    {/* Connecting line */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-purple-100 z-0" />
                    
                    {getServiceTrackingSteps(selectedRequest.status).map((step, idx) => (
                      <div key={idx} className="relative flex items-center gap-4 z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            step.completed
                              ? step.isError
                                ? "bg-red-500 text-white"
                                : "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          }`}
                        >
                          {step.completed ? (
                            step.isError ? "✕" : "✓"
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold text-sm ${
                              step.completed
                                ? step.isError
                                  ? "text-red-600"
                                  : "text-purple-900"
                                : "text-gray-400"
                            }`}
                          >
                            {step.status}
                          </p>
                          <p className="text-xs text-gray-500">
                            {step.active 
                              ? `Current Stage`
                              : step.completed 
                                ? "Finished" 
                                : "Awaiting previous steps"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Details */}
                <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 space-y-3">
                  <h4 className="font-semibold text-purple-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <span>📅</span> Session Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <span className="font-medium text-gray-500">Preferred Date:</span>{" "}
                      {selectedRequest.preferredDate ? new Date(selectedRequest.preferredDate).toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Preferred Slot:</span>{" "}
                      {selectedRequest.preferredTimeSlot || "Not specified"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Communication Mode:</span>{" "}
                      {getServiceCommunicationModeLabel(selectedRequest.communicationMode)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Booked On:</span>{" "}
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 space-y-3">
                  <h4 className="font-semibold text-amber-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <span>📝</span> Contact & Booking Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div>
                      <span className="font-medium text-gray-500">Name:</span> {selectedRequest.name}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Email:</span> {selectedRequest.email}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Phone:</span> {selectedRequest.phone}
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Address:</span> {selectedRequest.address}
                    </div>
                  </div>
                  {selectedRequest.description && (
                    <div className="pt-2 border-t border-amber-100">
                      <span className="font-medium text-gray-500">Requirements / Details:</span>
                      <p className="mt-1 text-gray-600 bg-white p-2.5 rounded-lg border border-amber-100/50">
                        {selectedRequest.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-xl hover:from-pink-600 hover:to-amber-600 transition-all duration-300 font-semibold text-sm shadow-md"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Write a Review
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={submitReview} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={reviewProduct.image}
                      alt={reviewProduct.productName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {reviewProduct.productName}
                    </h3>
                    <p className="text-pink-600 font-medium">
                      {reviewProduct.price}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= selectedRating
                            ? "text-amber-400 hover:text-amber-500"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review
                  </label>
                  <textarea
                    name="review"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-xl hover:from-pink-600 hover:to-amber-600 transition-all duration-300 font-medium"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Orders;
