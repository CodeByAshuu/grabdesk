import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Profile = () => {
  // User data state
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://via.placeholder.com/350",
    joinDate: "January 2023"
  });

  const [address, setAddress] = useState({
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  });

  const [orders, setOrders] = useState([
    { id: 1, date: "2024-01-15", total: "$125.50", status: "Delivered" },
    { id: 2, date: "2024-01-10", total: "$89.99", status: "Processing" },
    { id: 3, date: "2023-12-28", total: "$210.00", status: "Delivered" },
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
  const [editForm, setEditForm] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for smooth transitions
  const messagesContainerRef = useRef(null);
  const tabContentRef = useRef(null);

  // Fetch user data on component mount (simulated)
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    fetchUserData();
  }, []);

  // Real-time updates for edit form
  useEffect(() => {
    if (isEditing) {
      setEditForm(userData);
    }
  }, [isEditing, userData]);

  const handleEdit = () => {
    setEditForm(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Real-time update with immediate feedback
    setUserData(editForm);
    setIsEditing(false);
    // In a real app, you would make an API call here
    console.log("Updated user data:", editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
    )
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
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
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors flex items-center gap-2"
                  >
                    <Icons.Save /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center gap-2"
                  >
                    <Icons.X /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center gap-2"
                  >
                    <Icons.Edit2 /> Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#5b3d25]/70">Full Name</p>
                    <p className="text-lg">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5b3d25]/70">Email Address</p>
                    <p className="text-lg">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5b3d25]/70">Phone Number</p>
                    <p className="text-lg">{userData.phone}</p>
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
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Saved Addresses</h3>
              <button className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors">
                Add New Address
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 border border-[#5b3d25] rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Icons.MapPin />
                  <h4 className="font-semibold">Primary Address</h4>
                </div>
                <p className="mb-1">{address.street}</p>
                <p className="mb-1">{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <div className="flex gap-3 mt-4">
                  <button className="text-sm text-[#5b3d25] hover:underline">Edit</button>
                  <button className="text-sm text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5b3d25]">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-[#5b3d25]/30">
                      <td className="py-3 px-4">#{order.id}</td>
                      <td className="py-3 px-4">{order.date}</td>
                      <td className="py-3 px-4">{order.total}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link 
                          to={`/orders/${order.id}`}
                          className="text-[#5b3d25] hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
        // Modified to render ALL messages but restrict height via CSS
        const hasMoreMessages = messages.length > 4;
        
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Messages</h3>
            <div 
              ref={messagesContainerRef}
              className="space-y-4"
              style={{
                // Approximate height of 4 messages (4 * ~88px + gaps)
                maxHeight: hasMoreMessages ? '400px' : 'none',
                overflowY: 'auto',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
              }}
            >
              <div className="space-y-4 pr-2">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-[#5b3d25]/5 transition-colors ${
                      !message.read ? 'border-[#5b3d25] bg-[#5b3d25]/5' : 'border-[#5b3d25]/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${!message.read ? 'bg-[#5b3d25]' : 'bg-transparent'}`}></span>
                          <h4 className="font-semibold">{message.subject}</h4>
                        </div>
                        <p className="text-sm text-[#5b3d25]/70 mt-1">From: {message.sender}</p>
                      </div>
                      <span className="text-sm text-[#5b3d25]/70">{message.date}</span>
                    </div>
                  </div>
                ))}
                {messages.length > 4 && (
                  <div className="text-center py-2 text-sm text-[#5b3d25]/70 opacity-50">
                     Scroll for more ↓
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <button className="px-6 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors">
                Mark All as Read
              </button>
            </div>
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
      // Changed from min-h-screen to h-screen and added overflow-hidden to remove page scroll
      className="h-screen w-full text-[#5b3d25] overflow-hidden overflow-x-hidden flex flex-col"
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
      `}</style>
      

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 h-full flex flex-col">
        {/* Header */}
        <div className="mb-8 sm:mb-12 shrink-0">
          <h1 className="boldonse-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl wrap-break-word max-w-full mb-4">
            PROFILE
          </h1>
          {/* Horizontal Divider - Only visible on medium screens and up */}
          <div className="hidden md:block w-full my-4 mt-8">
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

        {/* Modified Layout: 
            Used flex-1 and min-h-0 to ensure this section takes remaining space 
            without pushing the parent height (which causes page scroll).
        */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 min-h-0">
          {/* Profile Sidebar */}
          <div className="lg:w-1/3 flex flex-col items-center overflow-y-auto lg:overflow-visible lg:shrink-0">
            <div className="relative mb-6">
              <div className="w-40 h-40 sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-4 border-[#5b3d25]">
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
              <button className="absolute bottom-4 right-4 bg-[#5b3d25] text-white p-2 rounded-full hover:bg-[#4a3120] transition-colors">
                <Icons.Edit2 />
              </button>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{userData.name}</h2>
              <p className="text-[#5b3d25]/70">{userData.email}</p>
              <div className="mt-4">
                <span className="inline-block px-4 py-1 bg-[#5b3d25]/10 rounded-full text-sm">
                  Member since {userData.joinDate}
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
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-7 border-b border-[#5b3d25]/30 pb-4 shrink-0">
              {[
                { id: "account", label: "Account Details", icon: Icons.UserCircle },
                { id: "address", label: "Address", icon: Icons.MapPin },
                { id: "orders", label: "Orders", icon: Icons.Package },
                { id: "messages", label: "Messages", icon: Icons.MessageSquare },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-[#5b3d25] text-white"
                      : "hover:bg-[#5b3d25]/10"
                  }`}
                >
                  <tab.icon />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Container - Added Invisible Internal Scroll Logic */}
            <div 
              ref={tabContentRef}
              className="grow min-h-0 overflow-y-auto"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth',
              }}
            >
              <div className="pr-2 pb-12">
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