// components/HeaderPages/PaymentMethods/PaymentMethods.tsx (WITH 18% TAX)
"use client";

import React, { useState } from "react";
import { paymentAPI } from "@/utils/api/payment.api";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: string,
    callback: (response: RazorpayErrorResponse) => void,
  ) => void;
}

interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, unknown>;
  };
}

interface PaymentMethodsProps {
  onPaymentSuccess?: () => Promise<void> | void;
  amount?: number;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onPaymentSuccess,
  amount = 0,
  customerDetails,
}) => {
  const [processing, setProcessing] = useState(false);

  // Calculate tax (18%) and total amount (amount + 18% tax)
  const calculateTotalWithTax = (baseAmount: number) => {
    const tax = baseAmount * 0.18; // 18% tax
    const total = baseAmount + tax;
    return {
      baseAmount,
      tax,
      total: Math.round(total), // Round to nearest integer for Razorpay
    };
  };

  const {
    baseAmount,
    tax,
    total: totalWithTax,
  } = calculateTotalWithTax(amount);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (
        document.querySelector(
          "script[src='https://checkout.razorpay.com/v1/checkout.js']",
        )
      ) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Invalid payment amount");
      return;
    }

    try {
      setProcessing(true);

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        setProcessing(false);
        return;
      }

      // Send the total amount with tax to the payment gateway
      const orderData = await paymentAPI.createOrder({
        amount: totalWithTax, // Send total with tax (base + 18%)
        currency: "INR",
        receipt: `order_${Date.now()}`,
      });

      console.log("Order created:", orderData);
      console.log(
        `Base amount: ₹${baseAmount}, Tax (18%): ₹${tax}, Total: ₹${totalWithTax}`,
      );

      if (!orderData.success) {
        throw new Error("Failed to create order");
      }

      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Osheen Oracle",
        description: `Service Booking Payment (Tax: ₹${tax.toFixed(2)})`,
        order_id: orderData.order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            const verification = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("Payment verification:", verification);

            if (verification.success) {
              if (onPaymentSuccess) {
                await onPaymentSuccess();
              }
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: customerDetails?.name || "",
          email: customerDetails?.email || "",
          contact: customerDetails?.phone || "",
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      razorpayInstance.on(
        "payment.failed",
        (response: RazorpayErrorResponse) => {
          console.error("Payment failed:", response.error);
          alert(
            `Payment failed: ${response.error.description || "Please try again"}`,
          );
          setProcessing(false);
        },
      );
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Complete Your Payment
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Secure payment powered by Razorpay
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Amount to Pay</p>
        <p className="text-4xl font-bold text-purple-700">₹{totalWithTax}</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span>📋</span> Payment Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Service Amount</span>
            <span className="font-semibold text-gray-800">
              ₹{baseAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Tax (GST 18%)</span>
            <span className="font-semibold text-gray-800">
              ₹{tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 pt-3">
            <span className="text-gray-800 font-bold">Total Amount</span>
            <span className="text-xl font-bold text-purple-700">
              ₹{totalWithTax}
            </span>
          </div>
        </div>
      </div>

      {customerDetails && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="text-xs text-gray-500 font-medium">PAYING AS</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-800">{customerDetails.name}</p>
            <p className="text-gray-500 text-xs">{customerDetails.email}</p>
            <p className="text-gray-500 text-xs">{customerDetails.phone}</p>
            {customerDetails.address && (
              <p className="text-gray-400 text-[10px] mt-1 border-t border-gray-200 pt-1">
                📍 {customerDetails.address}
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
      >
        {processing ? (
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Pay ₹${totalWithTax} Securely`
        )}
      </button>

      <div className="flex justify-center items-center gap-4 py-3">
        <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
          Visa
        </div>
        <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
          Master
        </div>
        <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-[10px] font-bold">
          UPI
        </div>
        <div className="w-10 h-6 bg-black rounded flex items-center justify-center text-white text-[10px] font-bold">
          GPay
        </div>
        <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-[10px] font-bold">
          Paytm
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-around items-center text-xs text-gray-600">
          <span className="flex items-center gap-1">🔒 256-bit SSL</span>
          <span className="flex items-center gap-1">🛡️ PCI DSS</span>
          <span className="flex items-center gap-1">⚡ Instant</span>
          <span className="flex items-center gap-1">✓ Verified</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400">
          By clicking Pay Securely you agree to our{" "}
          <a href="/termsofservice" className="text-purple-600 hover:underline">
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;
