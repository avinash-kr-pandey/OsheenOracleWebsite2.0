"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import profileApi, { type Address } from "@/utils/api/profile.api";

// Local FormData interface - simplified for backend
interface FormData {
  type: string;
  name: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

const AddressPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    type: "Home",
    name: "",
    address: "",
    phone: "",
    isDefault: false,
  });

  // Fetch addresses when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    if (!isAuthenticated) {
      console.warn("Not authenticated, skipping address fetch");
      return;
    }

    try {
      setLoading(true);
      const response = await profileApi.getAddresses();

      // Backend returns { addresses: [...] }
      if (response && response.addresses && Array.isArray(response.addresses)) {
        setAddresses(response.addresses);
      } else {
        setAddresses([]);
      }
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
      setAddresses([]);
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to save address");
      return;
    }

    // Validation
    if (!formData.type.trim()) {
      toast.error("Please select address type");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Please enter recipient name");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter full address");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    setLoading(true);

    try {
      const apiData: Omit<Address, "_id"> = {
        type: formData.type,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        isDefault: formData.isDefault,
      };

      if (editingAddress) {
        await profileApi.updateAddress(editingAddress._id, apiData);
        toast.success("Address updated successfully!");
      } else {
        await profileApi.createAddress(apiData);
        toast.success("Address added successfully!");
      }

      await fetchAddresses();
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(
        editingAddress ? "Failed to update address" : "Failed to add address",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "Home",
      name: "",
      address: "",
      phone: "",
      isDefault: false,
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      phone: address.phone,
      isDefault: address.isDefault || false,
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to delete address");
      return;
    }

    try {
      await profileApi.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
      toast.success("Address deleted successfully!");
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const setAsDefault = async (addressId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to set default address");
      return;
    }

    try {
      await profileApi.updateAddress(addressId, { isDefault: true });
      // Refresh addresses to get updated list
      await fetchAddresses();
      toast.success("Default address updated!");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const getAddressTypeIcon = (type: string): string => {
    switch (type?.toLowerCase()) {
      case "home":
        return "🏠";
      case "work":
        return "💼";
      case "other":
        return "📍";
      default:
        return "📍";
    }
  };

  const handleAddressTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  // Show loading state
  if ((loading || !dataLoaded) && addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 pt-30 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 pt-30 pb-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-pink-600">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to view and manage your addresses
          </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 pt-30 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent mb-4">
            My Addresses
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Manage your delivery addresses for faster checkout
          </p>
        </div>

        {/* Add New Address Button */}
        <div className="flex justify-end mb-8 animate-slide-up">
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Address
          </button>
        </div>

        {/* Add/Edit Address Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Full name of recipient"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complete Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 resize-none"
                      placeholder="House No, Street, Area, City, State, PIN Code"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Example: 123, Main Street, Andheri East, Mumbai,
                      Maharashtra - 400069
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Type *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Home", "Work", "Other"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleAddressTypeSelect(type)}
                          disabled={loading}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 ${
                            formData.type === type
                              ? "border-pink-500 bg-pink-50 text-pink-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="block text-lg mb-1">
                            {getAddressTypeIcon(type)}
                          </span>
                          <span className="block text-sm font-medium">
                            {type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-amber-500 text-white rounded-xl hover:from-pink-600 hover:to-amber-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                    >
                      {loading
                        ? "Saving..."
                        : editingAddress
                          ? "Update Address"
                          : "Save Address"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 011.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Delete Address?
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this address? This action
                  cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Address Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address, index) => (
            <div
              key={address._id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 animate-fade-in-up ${
                address.isDefault ? "ring-2 ring-pink-500" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getAddressTypeIcon(address.type)}
                    </span>
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors duration-300"
                      title="Edit address"
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(address._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                      title="Delete address"
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-800">
                    {address.name}
                  </h3>
                  <p className="text-gray-600">{address.phone}</p>
                </div>

                {/* Address Details */}
                <div className="text-gray-600 mb-6">
                  <p className="whitespace-pre-wrap">{address.address}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {!address.isDefault && (
                    <button
                      onClick={() => setAsDefault(address._id)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 text-sm"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-xl font-medium hover:bg-pink-100 transition-all duration-300 text-sm"
                  >
                    Edit Address
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State Card for Adding New Address */}
          {addresses.length < 6 && (
            <div
              onClick={() => !loading && setShowAddForm(true)}
              className="bg-gradient-to-br from-pink-50 to-amber-50 rounded-2xl border-2 border-dashed border-pink-300 overflow-hidden flex flex-col items-center justify-center p-8 text-center transition-all duration-500 hover:border-pink-400 hover:shadow-lg cursor-pointer transform hover:scale-105 animate-fade-in-up"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-amber-400 flex items-center justify-center mb-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Add New Address
              </h3>
              <p className="text-gray-600 max-w-xs">
                Save a new delivery address for faster checkout
              </p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && !showAddForm && dataLoaded && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-r from-pink-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Addresses Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t added any delivery addresses yet. Add your first
              address to get started with faster checkout.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      {/* Custom animations */}
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
        @keyframes fade-in-up {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddressPage;
