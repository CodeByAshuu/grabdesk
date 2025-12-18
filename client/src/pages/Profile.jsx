import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { getInitials } from "../utils/stringUtils";
import { useState, useEffect, useRef } from "react";
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

  const [addresses, setAddresses] = useState([]);
  const [primaryAddress, setPrimaryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);

  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Address editing states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [editAddressForm, setEditAddressForm] = useState({});
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

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setIsLoading(true);

      // Fetch User Data (including addresses and messages)
      const userRes = await api.get('/users/me');
      const user = userRes.data;

      // Fetch Orders
      const ordersRes = await api.get('/orders/my');

      // Format Date
      const date = new Date(user.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });

      // Set User Data
      setUserData({
        name: user.name,
        email: user.email,
        phone: user.phone || "Not set",
        avatar: user.profilePhotoUrl || "https://via.placeholder.com/350",
        joinDate: `${formattedDate}`
      });

      // Set Addresses
      setAddresses(user.addresses || []);
      const primary = user.addresses?.find(a => a.isPrimary) || user.addresses?.[0] || {
        street: "", city: "", state: "", zipCode: "", country: ""
      };
      setPrimaryAddress(primary);

      // Set Messages
      const formattedMessages = (user.messages || []).map(msg => ({
        id: msg._id,
        sender: "System", // Or derive from message type if available
        subject: msg.title,
        description: msg.description,
        date: new Date(msg.createdAt).toLocaleDateString(),
        read: msg.read
      }));
      setMessages(formattedMessages);

      // Set Orders
      const formattedOrders = ordersRes.data.map(order => ({
        id: order._id,
        date: new Date(order.createdAt).toISOString().split('T')[0],
        total: order.total.toFixed(2),
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
      }));
      setOrders(formattedOrders);

      // Initialize edit form
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone || ""
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
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

  // Address form initialization
  useEffect(() => {
    if (isEditingAddress && editAddressIndex !== null) {
      setEditAddressForm(addresses[editAddressIndex] || {});
    }
  }, [isEditingAddress, editAddressIndex, addresses]);

  // Hash navigation
  useEffect(() => {
    const hash = window.location.hash;

    if (hash === '#message') {
      setActiveTab("messages");

      setTimeout(() => {
        if (tabContentRef.current) {
          tabContentRef.current.scrollTop = 0;
        }

        setTimeout(() => {
          const messagesSection = document.getElementById('message');
          if (messagesSection) {
            messagesSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // TODO: Implement User Profile Update API if needed
    // For now, optimistic update or just log
    setUserData(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone === "Not set" ? "" : userData.phone
    });
  };

  // Address Handlers
  const handleEditAddress = (index) => {
    setEditAddressIndex(index);
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    try {
      const res = await api.put(`/users/address/${editAddressIndex}`, editAddressForm);
      setAddresses(res.data);

      // Update primary for display if needed
      const primary = res.data.find(a => a.isPrimary) || res.data[0] || {
        street: "", city: "", state: "", zipCode: "", country: ""
      };
      setPrimaryAddress(primary);

      setIsEditingAddress(false);
      setEditAddressIndex(null);
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address");
    }
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    setEditAddressIndex(null);
  };

  const handleDeleteAddress = async (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const res = await api.delete(`/users/address/${index}`);
        setAddresses(res.data);

        const primary = res.data.find(a => a.isPrimary) || res.data[0] || {
          street: "", city: "", state: "", zipCode: "", country: ""
        };
        setPrimaryAddress(primary);
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Failed to delete address");
      }
    }
  };

  const handleAddAddress = () => {
    setShowAddAddress(true);
  };

  const handleSaveNewAddress = async () => {
    try {
      const res = await api.post('/users/address', newAddressForm);
      setAddresses(res.data);

      const primary = res.data.find(a => a.isPrimary) || res.data[0] || {
        street: "", city: "", state: "", zipCode: "", country: ""
      };
      setPrimaryAddress(primary);

      setShowAddAddress(false);
      setNewAddressForm({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        isPrimary: false
      });
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address");
    }
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

  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    if (tabContentRef.current) {
      tabContentRef.current.scrollTop = 0;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await api.put('/users/messages/mark-read');
      // Update local state
      const formattedMessages = (res.data || []).map(msg => ({
        id: msg._id,
        sender: "System",
        subject: msg.title,
        description: msg.description,
        date: new Date(msg.createdAt).toLocaleDateString(),
        read: msg.read
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Mark read error:", error);
    }
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
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    >
                      <Icons.LogOut /> Logout
                    </button>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    >
                      <Icons.Edit2 /> Edit Profile
                    </button>
                  </div>
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
              /* Display Address List */
              <div className="grid grid-cols-1 gap-6">
                {addresses.length > 0 ? (
                  addresses.map((addr, index) => (
                    <div key={index} className={`p-4 sm:p-6 border ${addr.isPrimary ? 'border-[#5b3d25] bg-[#5b3d25]/5' : 'border-[#5b3d25]/30'} rounded-lg`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icons.MapPin />
                        <h4 className="font-semibold">{addr.isPrimary ? 'Primary Address' : `Address ${index + 1}`}</h4>
                      </div>
                      <p className="mb-1 wrap-break-word">{addr.street}</p>
                      <p className="mb-1 wrap-break-word">{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="wrap-break-word">{addr.country}</p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="px-4 py-2 text-sm border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center justify-center gap-2"
                        >
                          <Icons.Edit2 /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(index)}
                          className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Icons.Trash2 /> Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 border border-dashed border-[#5b3d25]/50 rounded-lg text-center">
                    <Icons.MapPin className="w-12 h-12 mx-auto mb-4 text-[#5b3d25]/50" />
                    <p className="text-[#5b3d25]/70 mb-4">No address stored. Please add an address to deliver your orders.</p>
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
            {orders.length > 0 ? (
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
                            <td className="px-4 py-3 whitespace-nowrap text-sm">#{order.id.substring(orders.id.length - 6).toUpperCase()}</td>
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
            ) : (
              <div className="p-6 border border-dashed border-[#5b3d25]/50 rounded-lg text-center">
                <Icons.Package className="w-12 h-12 mx-auto mb-4 text-[#5b3d25]/50" />
                <p className="text-[#5b3d25]/70 mb-4">No orders yet. Order something.</p>
                <Link
                  to="/product"
                  className="px-6 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors inline-flex items-center justify-center gap-2 mx-auto"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        );

      case "messages":

        // const hasMoreMessages = messages.length > 4;

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
            {messages.length > 0 ? (
              <div
                ref={messagesContainerRef}
                className="space-y-4"
                style={{
                  // maxHeight: hasMoreMessages ? '400px' : 'none',
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
                        // Mark message as read when clicked (Optimistic)
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
                          <p className="text-sm text-[#5b3d25]/70 mt-1 wrap-break-word">{message.description}</p>
                          <p className="text-xs text-[#5b3d25]/50 mt-1 wrap-break-word">From: {message.sender}</p>
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
            ) : (
              <div className="p-6 border border-dashed border-[#5b3d25]/50 rounded-lg text-center">
                <Icons.MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#5b3d25]/50" />
                <p className="text-[#5b3d25]/70">No messages at the moment.</p>
              </div>
            )}

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
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden border-4 border-[#5b3d25] flex items-center justify-center bg-white text-[#5b3d25]">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl lg:text-8xl font-bold text-[#5b3d25]">
                    {getInitials(userData.name)}
                  </span>
                )}
              </div>
              <button className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-[#5b3d25] text-white p-1.5 sm:p-2 rounded-full hover:bg-[#4a3120] transition-colors">
                <Icons.Edit2 />
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 wrap-break-word px-2">{userData.name}</h2>
              <p className="text-[#5b3d25]/70 wrap-break-word px-2">{userData.email}</p>
              <div className="mt-3 sm:mt-4 space-y-4">
                {/* <span className="inline-block px-3 sm:px-4 py-1 bg-[#5b3d25]/10 rounded-full text-xs sm:text-sm">
                  {userData.joinDate}
                </span> */}
                {/* double joindate hogya , unnecessary shit */}

                {/* Logout Button REMOVED from Sidepanel kyuki ganda lg rha tha */}
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