"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import profileApi, { type Address } from "@/utils/api/profile.api";
import { useAuth } from "@/contexts/AuthContext";

interface AddressSectionProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
}

interface GranularAddress {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  street: string;
  type: string;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  onAddressSelect,
  selectedAddressId,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState<GranularAddress>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    street: "",
    type: "Home",
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getAddresses();
      if (response && response.addresses) {
        setAddresses(response.addresses);
        // If an address exists and none is selected, select the first one or default
        if (response.addresses.length > 0 && !selectedAddressId) {
          const defaultAddr = response.addresses.find(a => a.isDefault) || response.addresses[0];
          onAddressSelect(defaultAddr);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Concatenate granular fields into the single 'address' string the API expects
      const fullAddressString = `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}, ${formData.country} (Email: ${formData.email})`;

      const apiData: Omit<Address, "_id"> = {
        name: formData.name,
        phone: formData.phone,
        address: fullAddressString,
        type: formData.type,
        isDefault: addresses.length === 0, // Set as default if it's the first one
      };

      const response = await profileApi.createAddress(apiData);
      toast.success("Address added successfully!");
      
      // Refresh list
      await fetchAddresses();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating address:", error);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-lg border border-red-100">
        <p className="text-gray-600 mb-4">Please login to manage your shipping addresses.</p>
        <button 
          onClick={() => window.location.href = "/login"}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-all"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Select Shipping Address</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
          >
            + Add New Address
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="+91 9999999999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address / House No.</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="123, Star Apartment"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="123456"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Country"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-bold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save & Select"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.length === 0 ? (
            <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">No addresses found. Please add a shipping address to continue.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
              >
                + Add First Address
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address._id}
                onClick={() => onAddressSelect(address)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedAddressId === address._id
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-100 bg-white hover:border-purple-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-lg">{address.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full uppercase font-semibold">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  {selectedAddressId === address._id && (
                    <span className="text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-1">{address.phone}</p>
                <p className="text-gray-500 text-sm">{address.address}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSection;
