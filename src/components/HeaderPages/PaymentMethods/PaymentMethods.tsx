// components/HeaderPages/PaymentMethods/PaymentMethods.tsx

"use client";

import React, { useState } from "react";

interface PaymentMethod {
  id: number;
  type: string;
  title: string;
  number: string;
  expiry: string;
  isDefault: boolean;
  icon: string;
  provider: string;
}

interface PaymentMethodsProps {
  onPaymentSuccess?: () => Promise<void> | void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onPaymentSuccess,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: "card",
      title: "Visa Classic",
      number: "**** **** **** 4242",
      expiry: "12/25",
      isDefault: true,
      icon: "💳",
      provider: "Visa",
    },
    {
      id: 2,
      type: "card",
      title: "MasterCard Gold",
      number: "**** **** **** 5678",
      expiry: "09/24",
      isDefault: false,
      icon: "💳",
      provider: "MasterCard",
    },
    {
      id: 3,
      type: "paypal",
      title: "PayPal Account",
      number: "user@example.com",
      expiry: "",
      isDefault: false,
      icon: "🔵",
      provider: "PayPal",
    },
    {
      id: 4,
      type: "wallet",
      title: "Google Pay",
      number: "user@gmail.com",
      expiry: "",
      isDefault: false,
      icon: "📱",
      provider: "Google Pay",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newPaymentMethod: PaymentMethod = {
      id: paymentMethods.length + 1,
      type: "card",
      title: newCard.cardHolder,
      number: `**** **** **** ${newCard.cardNumber.slice(-4)}`,
      expiry: newCard.expiryDate,
      isDefault: newCard.isDefault,
      icon: "💳",
      provider: "Visa",
    };

    if (newCard.isDefault) {
      setPaymentMethods((prev) => [
        newPaymentMethod,
        ...prev.map((pm) => ({ ...pm, isDefault: false })),
      ]);
    } else {
      setPaymentMethods((prev) => [...prev, newPaymentMethod]);
    }

    setNewCard({
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      isDefault: false,
    });
    setShowAddForm(false);
  };

  const setAsDefault = (id: number) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    );
  };

  const deletePaymentMethod = (id: number) => {
    setPaymentMethods((prev) => {
      const newMethods = prev.filter((pm) => pm.id !== id);
      if (newMethods.length > 0 && !newMethods.some((pm) => pm.isDefault)) {
        newMethods[0].isDefault = true;
      }
      return newMethods;
    });
  };

  const handlePayNow = async (methodId: number) => {
    setSelectedMethod(methodId);
    setProcessing(true);
    setTimeout(async () => {
      setProcessing(false);
      if (onPaymentSuccess) {
        await onPaymentSuccess();
      } else {
        alert("Payment successful! (Demo)");
      }
    }, 2000);
  };

  const getProviderLogo = (provider: string) => {
    const logos: Record<string, { bg: string; text: string }> = {
      Visa: { bg: "bg-blue-600", text: "Visa" },
      MasterCard: { bg: "bg-red-600", text: "Master" },
      PayPal: { bg: "bg-blue-500", text: "PayPal" },
      "Google Pay": { bg: "bg-black", text: "G Pay" },
    };
    const logo = logos[provider];
    if (logo) {
      return (
        <div
          className={`w-10 h-6 ${logo.bg} rounded flex items-center justify-center text-white font-bold text-[10px]`}
        >
          {logo.text}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Payment Methods
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Select your preferred payment method
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-xs text-gray-500">Cards</p>
          <p className="text-xl font-bold text-purple-700">
            {paymentMethods.filter((pm) => pm.type === "card").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-xs text-gray-500">Wallets</p>
          <p className="text-xl font-bold text-purple-700">
            {paymentMethods.filter((pm) => pm.type !== "card").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-xs text-gray-500">Default</p>
          <p className="text-sm font-bold text-gray-700 truncate">
            {paymentMethods.find((pm) => pm.isDefault)?.title || "None"}
          </p>
        </div>
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add New Card
      </button>

      {/* Payment Methods List */}
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`bg-white rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
              method.isDefault ? "border-l-4 border-amber-500" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${method.isDefault ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white" : "bg-gray-100"}`}
                >
                  {method.icon}
                </div>
                {getProviderLogo(method.provider)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {method.title}
                    </h3>
                    {method.isDefault && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{method.number}</p>
                  {method.expiry && (
                    <p className="text-xs text-gray-400">
                      Expires {method.expiry}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!method.isDefault && (
                  <button
                    onClick={() => setAsDefault(method.id)}
                    className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition"
                    title="Set as default"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => deletePaymentMethod(method.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handlePayNow(method.id)}
                  disabled={processing && selectedMethod === method.id}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 text-xs"
                >
                  {processing && selectedMethod === method.id ? (
                    <div className="flex items-center gap-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Processing</span>
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Method Card */}
      <div
        onClick={() => setShowAddForm(true)}
        className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-800 text-sm">
          Add Payment Method
        </h3>
        <p className="text-xs text-gray-500">
          Add a new card or digital wallet
        </p>
      </div>

      {/* Security Tips */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center gap-1">🔒 Encrypted</span>
          <span className="flex items-center gap-1">🛡️ Protected</span>
          <span className="flex items-center gap-1">⚡ Instant</span>
          <span className="flex items-center gap-1">✓ Secure</span>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Card</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCard} className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                value={newCard.cardNumber}
                onChange={(e) =>
                  setNewCard({ ...newCard, cardNumber: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Card Holder Name"
                value={newCard.cardHolder}
                onChange={(e) =>
                  setNewCard({ ...newCard, cardHolder: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={newCard.expiryDate}
                  onChange={(e) =>
                    setNewCard({ ...newCard, expiryDate: e.target.value })
                  }
                  required
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={newCard.cvv}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cvv: e.target.value })
                  }
                  required
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newCard.isDefault}
                  onChange={(e) =>
                    setNewCard({ ...newCard, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm text-gray-700">
                  Set as default payment method
                </span>
              </label>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
