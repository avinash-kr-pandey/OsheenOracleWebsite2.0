"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth, type UserData } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import profileApi, {
  Address,
  Order,
  UpdateProfileData,
  ChangePasswordData,
  type ProfileImageResponse,
} from "@/utils/api/profile.api";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const [ordersResult, addressesResult] = await Promise.allSettled([
        profileApi.getOrders(),
        profileApi.getAddresses(),
      ]);

      if (
        ordersResult.status === "fulfilled" &&
        ordersResult.value?.success &&
        Array.isArray(ordersResult.value.data)
      ) {
        setOrders(ordersResult.value.data);
      } else {
        setOrders([]);
      }

      // Fix: Backend returns { addresses: [...] } not { data: [...] }
      if (
        addressesResult.status === "fulfilled" &&
        addressesResult.value?.addresses &&
        Array.isArray(addressesResult.value.addresses)
      ) {
        setAddresses(addressesResult.value.addresses);
      } else {
        setAddresses([]);
      }

      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setOrders([]);
      setAddresses([]);
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
     const response = await profileApi.uploadProfileImage(file);

      if (response?.success && response.data) {
        const imageData = response.data as ProfileImageResponse;
        const newAvatar = imageData.avatar || imageData.profileImage || "";
        if (newAvatar && user) {
          updateUser({ ...user, avatar: newAvatar });
        }
        toast.success("Profile picture updated successfully!");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingImage(false);
    }
  };

  console.log("User ID from auth:", user?.id);
  console.log("User _id from auth:", user?._id);

  const handleEditProfile = () => {
    setIsEditing(true);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updateData: UpdateProfileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
      };

      const response = await profileApi.updateUserProfile(updateData);

      if (response?.success) {
        if (user) {
          updateUser({
            ...user,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
          });
        }
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error(response?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await profileApi.changePassword(passwordData);

      if (response?.success) {
        toast.success("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(response?.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // FIXED: Accept string _id, not number
  const deleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const response = await profileApi.deleteAddress(addressId);
      if (response?.addresses) {
        setAddresses(response.addresses);
        toast.success("Address deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  // FIXED: Accept string _id, not number
  const setDefaultAddress = async (addressId: string) => {
    try {
      const response = await profileApi.updateAddress(addressId, {
        isDefault: true,
      });
      if (response?.addresses) {
        setAddresses(response.addresses);
        toast.success("Default address updated!");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to update default address");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Shipped":
        return "text-blue-600 bg-blue-100";
      case "Processing":
        return "text-amber-600 bg-amber-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // FIXED: Handle type correctly (Home, Work, Other)
  const getAddressTypeIcon = (type?: string) => {
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

  const getMemberSince = () => user?.joinDate || "January 2024";

  if (loading && !dataLoaded) {
    return (
      <div className="pt-32 min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-32 min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-pink-600">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to view your profile
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-amber-400">
                    <span className="text-white text-3xl font-bold">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "U"}
                    </span>
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-pink-700 transition-colors cursor-pointer"
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                )}
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent mb-2">
            {user?.name || "User"}
          </h1>
          <p className="text-gray-600 text-lg">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
              {user?.membership || "Standard Member"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-all duration-300">
            <Link href="/header/orders" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">
                    Total Orders
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">
                    {orders.length}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-lg md:text-2xl">📦</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-green-500 hover:scale-105 transition-all duration-300">
            <Link href="/header/addresses" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">
                    Addresses
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">
                    {addresses.length}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg md:text-2xl">🏠</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-blue-500 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  Member Since
                </p>
                <p className="text-sm md:text-lg font-bold text-gray-800">
                  {getMemberSince()}
                </p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg md:text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {["profile", "orders", "addresses"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsEditing(false);
                  setIsChangingPassword(false);
                }}
                className={`flex-1 min-w-32 px-6 py-4 text-sm md:text-base font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-600 hover:text-pink-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Profile Tab - Same as before */}
          {activeTab === "profile" && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Profile Information
                </h2>
                <div className="flex gap-3">
                  {!isEditing && !isChangingPassword && (
                    <>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={handleEditProfile}
                        className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg"
                      >
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isChangingPassword ? (
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-6 max-w-md"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : isEditing ? (
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6 max-w-2xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Full Name
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Phone
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.phone || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date of Birth
                      </label>
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.dateOfBirth || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Recent Orders
                </h2>
                <Link
                  href="/header/orders"
                  className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2"
                >
                  View All
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven&apos;t placed any orders yet.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={order.image}
                            alt={order.productName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {order.productName}
                          </h3>
                          <p className="text-gray-600 text-sm">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600">{order.price}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab - FIXED */}
          {activeTab === "addresses" && (
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Saved Addresses
                </h2>
                <Link
                  href="/header/addresses"
                  className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2"
                >
                  Manage Addresses
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No Addresses Saved
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your delivery addresses for faster checkout.
                  </p>
                  <Link
                    href="/header/addresses"
                    className="inline-block bg-gradient-to-r from-pink-500 to-amber-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg"
                  >
                    Add Address
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.slice(0, 2).map((address) => (
                    <div
                      key={address._id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-pink-300 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg">
                            {getAddressTypeIcon(address.type)}
                          </span>
                          <span className="font-medium text-gray-800">
                            {address.name}
                          </span>
                          {address.isDefault && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(address._id)}
                              className="text-amber-500 hover:text-amber-600 transition-colors"
                              title="Set as default"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => deleteAddress(address._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete address"
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
                      <div className="mb-2">
                        <p className="text-gray-800 font-medium">
                          {address.name}
                        </p>
                        <p className="text-gray-600 text-sm">{address.phone}</p>
                      </div>
                      <div className="text-gray-600">
                        <p className="text-sm whitespace-pre-wrap">
                          {address.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
