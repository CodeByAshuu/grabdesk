import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import Navbar from "../components/Navbar";
import api from "../api/axios"; // Import mapped axios instance

const Profile = () => {
  const navigate = useNavigate();
  // User data state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    joinDate: ""
  });

  const [address, setAddress] = useState({
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  });

  const [orders, setOrders] = useState([
    { id: 1, date: "2024-01-15", total: "125.50", status: "Delivered" },
    { id: 2, date: "2024-01-10", total: "89.99", status: "Processing" },
    { id: 3, date: "2023-12-28", total: "210.00", status: "Delivered" },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: "Support", subject: "Order Confirmation", date: "2024-01-15", read: true },
    { id: 2, sender: "Admin", subject: "New Features", date: "2024-01-12", read: false },
    { id: 3, sender: "System", subject: "Password Updated", date: "2024-01-10", read: true },
    { id: 4, sender: "Billing", subject: "Invoice #12345", date: "2024-01-08", read: true },
    { id: 5, sender: "Support", subject: "Ticket #67890", date: "2024-01-05", read: false },
    { id: 6, sender: "Newsletter", subject: "Weekly Updates", date: "2024-01-01", read: true },
  ]);

  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // NEW: Address editing states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressForm, setEditAddressForm] = useState(address);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isPrimary: false
  });

  // Refs for smooth transitions
  const messagesContainerRef = useRef(null);
  const tabContentRef = useRef(null);
  const addressFormRef = useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        setIsLoading(true);
        const response = await api.get('/auth/me');
        const user = response.data;

        // Format Date: "Member since Month Year"
        const date = new Date(user.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });

        // Set user data
        setUserData({
          name: user.name,
          email: user.email,
          phone: user.phone || "Not set",
          avatar: user.profilePhotoUrl || "https://via.placeholder.com/350",
          joinDate: `Member since ${formattedDate}`
        });

        // Initialize edit form with fetched data
        setEditForm({
          name: user.name,
          email: user.email,
          phone: user.phone || ""
        });

      } catch (error) {
        console.error("Error fetching profile:", error);
        // Clear auth data and redirect if unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Real-time updates for edit form
  useEffect(() => {
    if (isEditing) {
      setEditForm({
        name: userData.name,
        email: userData.email,
        phone: userData.phone === "Not set" ? "" : userData.phone
      });
    }
  }, [isEditing, userData]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // NEW: Initialize address form when editing
  useEffect(() => {
    if (isEditingAddress) {
      setEditAddressForm(address);
    }
  }, [isEditingAddress, address]);

  // ADD THIS: Effect to handle hash fragment navigation
  useEffect(() => {
    // Check if the URL has a hash fragment
    const hash = window.location.hash;

    if (hash === '#message') {
      // Switch to messages tab
      setActiveTab("messages");

      // Wait for the DOM to be fully rendered
      setTimeout(() => {
        // Scroll the tab content to top
        if (tabContentRef.current) {
          tabContentRef.current.scrollTop = 0;
        }

        // Also scroll to messages section within the tab
        setTimeout(() => {
          const messagesSection = document.getElementById('message');
          if (messagesSection) {
            messagesSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Optional: Add a visual highlight effect
            messagesSection.style.transition = 'background-color 0.5s';
            messagesSection.style.backgroundColor = 'rgba(91, 61, 37, 0.1)';

            setTimeout(() => {
              if (messagesSection) {
                messagesSection.style.backgroundColor = 'transparent';
              }
            }, 1000);
          }
        }, 100);
      }, 100);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Optimistic update
    setUserData(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
    // TODO: Add API call to update profile in backend
    console.log("Updated user data:", editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to current user data
    setEditForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone === "Not set" ? "" : userData.phone
    });
  };

  // NEW: Address editing handlers
  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    setAddress(editAddressForm);
    setIsEditingAddress(false);
    console.log("Updated address:", editAddressForm);
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
  };

  const handleDeleteAddress = () => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddress({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      });
      console.log("Address deleted");
    }
  };

  const handleAddAddress = () => {
    setShowAddAddress(true);
  };

  const handleSaveNewAddress = () => {
    if (newAddressForm.isPrimary) {
      setAddress(newAddressForm);
    }
    // In a real app, you would add to addresses array
    setShowAddAddress(false);
    setNewAddressForm({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isPrimary: false
    });
    console.log("New address added:", newAddressForm);
  };

  const handleCancelNewAddress = () => {
    setShowAddAddress(false);
    setNewAddressForm({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isPrimary: false
    });
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Smooth tab switching
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);

    if (tabContentRef.current) {
      tabContentRef.current.scrollTop = 0;
    }
  };

  // NEW: Mark all messages as read
  const handleMarkAllAsRead = () => {
    const updatedMessages = messages.map(message => ({
      ...message,
      read: true
    }));
    setMessages(updatedMessages);
  };

  const Icons = {
    UserCircle: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0114.828 21H18a2 2 0 002-2v-1.828a7 7 0 00-1.196-3.976M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    MapPin: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    Package: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    MessageSquare: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    Edit2: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    Save: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    X: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    Trash2: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    Plus: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    LogOut: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6 gowun-dodum-regular">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 ">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.Save /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.X /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-semibold ">Personal Information</h3>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Icons.Edit2 /> Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#5b3d25]/70">Full Name</p>
                    <p className="text-lg wrap-break-word">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5b3d25]/70">Email Address</p>
                    <p className="text-lg wrap-break-word">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5b3d25]/70">Phone Number</p>
                    <p className="text-lg wrap-break-word">{userData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5b3d25]/70">Member Since</p>
                    <p className="text-lg">{userData.joinDate}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "address":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold">Saved Addresses</h3>
              <button
                onClick={handleAddAddress}
                className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Icons.Plus /> Add New Address
              </button>
            </div>

            {/* Add New Address Form */}
            {showAddAddress && (
              <div ref={addressFormRef} className="p-4 sm:p-6 border border-[#5b3d25] rounded-lg space-y-4 animate-fadeIn">
                <h4 className="font-semibold text-lg">Add New Address</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={newAddressForm.street}
                      onChange={handleNewAddressInputChange}
                      className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddressForm.city}
                        onChange={handleNewAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={newAddressForm.state}
                        onChange={handleNewAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={newAddressForm.zipCode}
                        onChange={handleNewAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                        placeholder="ZIP Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={newAddressForm.country}
                        onChange={handleNewAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      name="isPrimary"
                      checked={newAddressForm.isPrimary}
                      onChange={handleNewAddressInputChange}
                      className="rounded border-[#5b3d25] text-[#5b3d25] focus:ring-[#5b3d25]"
                    />
                    <label htmlFor="isPrimary" className="text-sm">Set as primary address</label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveNewAddress}
                    className="px-6 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.Save /> Save Address
                  </button>
                  <button
                    onClick={handleCancelNewAddress}
                    className="px-6 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.X /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Address Editing Form */}
            {isEditingAddress ? (
              <div className="p-4 sm:p-6 border border-[#5b3d25] rounded-lg space-y-4">
                <h4 className="font-semibold text-lg">Edit Address</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={editAddressForm.street}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editAddressForm.city}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={editAddressForm.state}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={editAddressForm.zipCode}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={editAddressForm.country}
                        onChange={handleAddressInputChange}
                        className="w-full px-4 py-2 border border-[#5b3d25] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5b3d25] transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveAddress}
                    className="px-6 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.Save /> Save Changes
                  </button>
                  <button
                    onClick={handleCancelAddress}
                    className="px-6 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.X /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Display Address Card */
              <div className="grid grid-cols-1 gap-6">
                {address.street ? (
                  <div className="p-4 sm:p-6 border border-[#5b3d25] rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Icons.MapPin />
                      <h4 className="font-semibold">Primary Address</h4>
                    </div>
                    <p className="mb-1 wrap-break-word">{address.street}</p>
                    <p className="mb-1 wrap-break-word">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="wrap-break-word">{address.country}</p>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={handleEditAddress}
                        className="px-4 py-2 text-sm border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icons.Edit2 /> Edit
                      </button>
                      <button
                        onClick={handleDeleteAddress}
                        className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icons.Trash2 /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-[#5b3d25]/50 rounded-lg text-center">
                    <Icons.MapPin className="w-12 h-12 mx-auto mb-4 text-[#5b3d25]/50" />
                    <p className="text-[#5b3d25]/70 mb-4">No addresses saved yet</p>
                    <button
                      onClick={handleAddAddress}
                      className="px-6 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                      <Icons.Plus /> Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6 gowun-dodum-regular">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden border border-[#5b3d25]/30 rounded-lg">
                  <table className="min-w-full divide-y divide-[#5b3d25]/30">
                    <thead>
                      <tr className="bg-[#5b3d25]/5">
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#5b3d25] uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#5b3d25] uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#5b3d25] uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#5b3d25] uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#5b3d25] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5b3d25]/30">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-[#5b3d25]/5 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm">#{order.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{order.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{order.total}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Link
                              to={`/orders/${order.id}`}
                              className="text-[#5b3d25] hover:underline font-medium"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/orders"
                className="inline-block px-6 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors"
              >
                View All Orders
              </Link>
            </div>
          </div>
        );

      case "messages":

        const hasMoreMessages = messages.length > 4;

        return (
          <div className="space-y-6" >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-xl font-semibold">Messages</h3>
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors w-full sm:w-auto"
              >
                Mark All as Read
              </button>
            </div>
            <div
              ref={messagesContainerRef}
              className="space-y-4"
              style={{
                maxHeight: hasMoreMessages ? '400px' : 'none',
                overflowY: 'auto',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >

              <div className="space-y-4 pr-2" id="message">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-[#5b3d25]/5 transition-colors ${!message.read ? 'border-[#5b3d25] bg-[#5b3d25]/5' : 'border-[#5b3d25]/30'
                      }`}
                    onClick={() => {
                      // Mark message as read when clicked
                      const updatedMessages = messages.map(m =>
                        m.id === message.id ? { ...m, read: true } : m
                      );
                      setMessages(updatedMessages);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${!message.read ? 'bg-[#5b3d25]' : 'bg-transparent'}`}></span>
                          <h4 className="font-semibold text-base wrap-break-word">{message.subject}</h4>
                        </div>
                        <p className="text-sm text-[#5b3d25]/70 mt-1 wrap-break-word">From: {message.sender}</p>
                      </div>
                      <span className="text-sm text-[#5b3d25]/70 whitespace-nowrap sm:text-right">{message.date}</span>
                    </div>
                  </div>
                ))}
                {messages.length > 4 && (
                  <div className="text-center py-2 text-sm text-[#5b3d25]/70 opacity-50 gowun-dodum-regular">
                    Scroll for more ↓
                  </div>
                )}
              </div>
            </div>
            {messages.some(m => !m.read) && (
              <div className="text-center sm:hidden">
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-6 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors w-full gowun-dodum-regular"
                >
                  Mark All as Read
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <section
        className="min-h-screen w-full flex items-center justify-center text-[#5b3d25] overflow-hidden"
        style={{
          backgroundColor: "#f3eadc",
          backgroundImage: "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 24px",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b3d25] mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="h-screen w-full text-[#5b3d25] overflow-hidden overflow-x-hidden flex flex-col gowun-dodum-regular"
      style={{
        backgroundColor: "#f3eadc",
        backgroundImage: "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
        backgroundSize: "14px 24px",
      }}
    >
      <Navbar />

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        section::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12 shrink-0">
          <h1 className="boldonse-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl wrap-break-word max-w-full mb-3 sm:mb-4">
            PROFILE
          </h1>
          {/* Horizontal Divider - Only visible on medium screens and up */}
          <div className="hidden md:block w-full my-4 mt-6 lg:mt-8">
            <div
              className="w-full border-t-2 border-[#5B3D25]"
              style={{
                borderTopStyle: "dashed",
                borderTopWidth: "3px",
                borderImage: "repeating-linear-gradient(to right, #5B3D25 0 12px, transparent 12px 22px) 1",
              }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 flex-1 min-h-0 gowun-dodum-regular">
          {/* Profile Sidebar - Improved mobile layout */}
          <div className="lg:w-1/3 flex flex-col items-center overflow-y-auto lg:overflow-visible lg:shrink-0">
            <div className="relative mb-4 sm:mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden border-4 border-[#5b3d25]">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='350' viewBox='0 0 350 350'%3E%3Crect width='350' height='350' fill='%235b3d25'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3EJD%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <button className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-[#5b3d25] text-white p-1.5 sm:p-2 rounded-full hover:bg-[#4a3120] transition-colors">
                <Icons.Edit2 />
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 wrap-break-word px-2">{userData.name}</h2>
              <p className="text-[#5b3d25]/70 wrap-break-word px-2">{userData.email}</p>
              <div className="mt-3 sm:mt-4 space-y-4">
                <div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25] hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <Icons.LogOut /> Logout
                  </button>
                </div>
                <span className="inline-block px-3 sm:px-4 py-1 bg-[#5b3d25]/10 rounded-full text-xs sm:text-sm">
                  {userData.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Vertical Divider - Hidden on mobile */}
          <div className="hidden lg:block relative shrink-0 -mt-6">
            <div
              className="h-full border-l-2 border-[#5B3D25] absolute left-0 top-0 bottom-0"
              style={{
                borderLeftStyle: "dashed",
                borderLeftWidth: "3px",
                borderImage: "repeating-linear-gradient(to bottom, #5B3D25 0 12px, transparent 12px 22px) 1",
              }}
            ></div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3 h-full flex flex-col min-h-0 min-w-0">
            {/* Tabs - Improved mobile tabs */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-7 border-b border-[#5b3d25]/30 pb-3 sm:pb-4 shrink-0 overflow-x-auto">
              {[
                { id: "account", label: "Account", icon: Icons.UserCircle, fullLabel: "Account Details" },
                { id: "address", label: "Address", icon: Icons.MapPin, fullLabel: "Address" },
                { id: "orders", label: "Orders", icon: Icons.Package, fullLabel: "Orders" },
                { id: "messages", label: "Messages", icon: Icons.MessageSquare, fullLabel: "Messages" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 shrink-0 ${activeTab === tab.id
                    ? "bg-[#5b3d25] text-white"
                    : "hover:bg-[#5b3d25]/10"
                    }`}
                >
                  <tab.icon />
                  <span className="text-xs sm:text-sm lg:text-base">
                    <span className="sm:hidden">{tab.label}</span>
                    <span className="hidden sm:inline">{tab.fullLabel}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content Container */}
            <div
              ref={tabContentRef}
              className="grow min-h-0 overflow-y-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth',
              }}
            >
              <div className="pr-1 sm:pr-2 pb-8 sm:pb-12">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;