"use client";

import Link from "next/link";
import React from "react";

export default function OrderConfirmationPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4 pt-32"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-2xl text-center transform hover:scale-[1.01] transition-all duration-300">
        {/* Animated Checkmark Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-200 animate-pulse">
          <svg
            className="w-12 h-12 text-white animate-[bounce_1s_infinite_alternate]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Header Text */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 font-montserrat">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Thank you for your purchase. Your payment was verified, and your order has been successfully placed in our database.
        </p>

        {/* Premium Details Card */}
        <div className="bg-white/80 rounded-2xl p-5 mb-8 border border-white/40 text-left space-y-3">
          <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
            <span className="text-gray-500 font-medium">Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">
              PAID
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
            <span className="text-gray-500 font-medium">Payment Method</span>
            <span className="text-gray-700 font-semibold">Razorpay Secure</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Shipping Status</span>
            <span className="text-purple-600 font-semibold">Processing</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/header/orders"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-md hover:shadow-lg text-center"
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="w-full border-2 border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-600 font-bold py-3.5 px-6 rounded-xl transition duration-300 bg-white/50 text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
