"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import PaymentMethods from "@/components/HeaderPages/PaymentMethods/PaymentMethods";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AddressSection from "@/components/Cart/AddressSection";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const [checkoutStep, setCheckoutStep] = useState<"CART" | "ADDRESS" | "PAYMENT">("CART");
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Calculate total - NO TAX
  const subtotal = getTotalPrice();
  const total = subtotal; // No tax added

  // Handle successful payment
  const handlePaymentSuccess = async () => {
    console.log("✅ Payment successful!");

    // Clear cart after successful payment
    clearCart();

    // Show success message
    alert("🎉 Payment Successful! Your order has been placed.");

    // Redirect to order confirmation or products page
    window.location.href = "/order-confirmation";
  };

  // Handle proceed to Address Selection
  const handleProceedToAddress = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please login to proceed with checkout");
      window.location.href = "/login";
      return;
    }
    setCheckoutStep("ADDRESS");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle proceed to Payment
  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      alert("Please select a shipping address first!");
      return;
    }
    setCheckoutStep("PAYMENT");
    setShowPayment(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get customer details for payment
  const getCustomerDetails = () => {
    if (isAuthenticated && user) {
      return {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      };
    }
    // Default values if not logged in
    return {
      name: "Guest User",
      email: "guest@example.com",
      phone: "9999999999",
    };
  };

  if (cartItems.length === 0 && !showPayment) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-8 px-4 pt-32"
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        }}
      >
        <div className="text-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to see them here!
          </p>
          <Link
            href="/products"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4 pt-32"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Step Indicator */}
        {cartItems.length > 0 && (
          <div className="flex justify-center mb-12">
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex flex-col items-center flex-1 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${checkoutStep === "CART" ? "bg-purple-600 text-white shadow-lg scale-110" : "bg-green-500 text-white"}`}>
                  {checkoutStep === "CART" ? "1" : "✓"}
                </div>
                <span className="text-xs font-bold mt-2 text-gray-700">Cart</span>
              </div>
              <div className={`h-1 flex-1 mx-2 rounded ${checkoutStep !== "CART" ? "bg-green-500" : "bg-gray-200"}`}></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${checkoutStep === "ADDRESS" ? "bg-purple-600 text-white shadow-lg scale-110" : checkoutStep === "PAYMENT" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {checkoutStep === "PAYMENT" ? "✓" : "2"}
                </div>
                <span className="text-xs font-bold mt-2 text-gray-700">Address</span>
              </div>
              <div className={`h-1 flex-1 mx-2 rounded ${checkoutStep === "PAYMENT" ? "bg-green-500" : "bg-gray-200"}`}></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${checkoutStep === "PAYMENT" ? "bg-purple-600 text-white shadow-lg scale-110" : "bg-gray-200 text-gray-500"}`}>
                  3
                </div>
                <span className="text-xs font-bold mt-2 text-gray-700">Payment</span>
              </div>
            </div>
          </div>
        )}

        {checkoutStep === "CART" ? (
          <>
            {/* Cart View */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Shopping Cart
              </h1>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium text-sm hover:scale-105 cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-white/50"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                          {item.name}
                        </h3>

                        {/* Size and Color */}
                        <div className="flex gap-4 text-sm text-gray-600 mb-2">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>

                        {/* Price */}
                        <p className="text-xl font-bold text-pink-600 mb-3">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 font-bold text-gray-900 min-w-8 text-center border-l border-r border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors font-medium text-sm cursor-pointer hover:scale-105"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({getTotalItems()})</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToAddress}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    href="/products"
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold text-lg text-center block hover:border-pink-400 hover:text-pink-600 transition-all duration-300"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : checkoutStep === "ADDRESS" ? (
          <>
            <div className="mb-6">
              <button
                onClick={() => setCheckoutStep("CART")}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-all hover:translate-x-[-4px]"
              >
                ← Back to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AddressSection 
                  onAddressSelect={(addr) => setSelectedAddress(addr)}
                  selectedAddressId={selectedAddress?._id}
                />
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Summary</h2>
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-lg font-bold text-gray-800">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={!selectedAddress}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg mb-4 disabled:opacity-50 disabled:scale-100"
                  >
                    Continue to Payment
                  </button>
                  {!selectedAddress && (
                    <p className="text-xs text-center text-red-500 font-medium">Please select a delivery address</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Payment View */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowPayment(false);
                  setCheckoutStep("ADDRESS");
                }}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-all hover:translate-x-[-4px]"
              >
                ← Back to Address Selection
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary Column */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-28">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                    <h2 className="text-white text-xl font-bold flex items-center gap-2">
                      <span>📋</span> Order Summary
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.size}-${item.color}`}
                          className="flex gap-3 pb-3 border-b border-gray-100"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {item.name}
                            </h4>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-sm font-bold text-purple-600">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            {(item.size || item.color) && (
                              <div className="text-xs text-gray-400 mt-1">
                                {item.size && <span>Size: {item.size} </span>}
                                {item.color && <span>Color: {item.color}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">
                            ₹{subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping</span>
                          <span className="text-green-600 font-semibold">
                            FREE
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span className="text-purple-700">
                            ₹{total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address Confirmation */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span>📍</span> Shipping Address
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 border border-gray-100">
                        <p className="font-bold text-gray-800">{selectedAddress?.name}</p>
                        <p>{selectedAddress?.phone}</p>
                        <p className="mt-1">{selectedAddress?.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Component Column */}
              <div>
                <PaymentMethods
                  onPaymentSuccess={handlePaymentSuccess}
                  amount={Math.round(total)} // Send amount without tax, component will add tax
                  customerDetails={{
                    name: selectedAddress?.name || user?.name || "Guest",
                    email: user?.email || "guest@example.com",
                    phone: selectedAddress?.phone || user?.phone || "9999999999",
                    address: selectedAddress?.address || ""
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold text-lg">
              Processing Payment...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait while we process your order
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
