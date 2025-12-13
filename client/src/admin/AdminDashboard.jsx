import React, { useState, useRef, useLayoutEffect } from "react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import CategoryManagement from "./CategoryManagement";
import CouponManagement from "./CouponManagement";
import NotificationCenter from "./NotificationSystem";
import OrderManagement from "./OrderManager";
import ProductManagement from "./ProductManager";
import SettingsPanel from "./SettingPannel";
import UserManagement from "./UserManager";
import Navbar from "../components/Navbar";
import SidebarProfile from "../components/Sidebarprofile";

const Icons = {
  Package: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  ShoppingCart: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.197a6 6 0 00-6-6" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Percent: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Activity: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
    </svg>
  ),
};

const ActivityLogs = () => {
  return (
    <div className="space-y-6 gowun-dodum-regular">
      <h2 className="text-2xl font-semibold text-[#5b3d25] nunito-exbold">Activity Logs</h2>
      <div className="bg-white border border-[#5b3d25]/20 rounded-xl p-6">
        <p className="text-[#5b3d25]/50">Activity logs placeholder - Real implementation would show user activities</p>
      </div>
    </div>
  );
};

const AdminManager = () => {
  const [activeSection, setActiveSection] = useState("products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Measurement refs & state for auto-height
  const navbarRef = useRef(null);
  const headerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(null);

  // Sample data for all sections
  const [products, setProducts] = useState([
    { id: 1, name: "Premium Leather Wallet", category: "Accessories", price: "₹89.99", stock: 24, status: "Active" },
    { id: 2, name: "Handcrafted Wooden Watch", category: "Watches", price: "₹149.99", stock: 12, status: "Active" },
    { id: 3, name: "Organic Cotton T-Shirt", category: "Clothing", price: "₹34.99", stock: 5, status: "Low Stock" },
    { id: 4, name: "Artisan Ceramic Mug", category: "Home", price: "₹24.99", stock: 0, status: "Out of Stock" },
  ]);

  const [orders, setOrders] = useState([
    { id: "ORD-1001", customer: "John Smith", date: "2024-01-15", total: "₹189.50", status: "Pending", payment: "Paid" },
    { id: "ORD-1002", customer: "Emma Wilson", date: "2024-01-14", total: "₹245.99", status: "Shipped", payment: "Paid" },
    { id: "ORD-1003", customer: "Michael Brown", date: "2024-01-13", total: "₹89.99", status: "Delivered", payment: "Paid" },
    { id: "ORD-1004", customer: "Sarah Johnson", date: "2024-01-12", total: "₹150.00", status: "Canceled", payment: "Refunded" },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", role: "Customer", status: "Active", lastLogin: "Today" },
    { id: 2, name: "Admin User", email: "admin@store.com", role: "Admin", status: "Active", lastLogin: "Today" },
    { id: 3, name: "Emma Wilson", email: "emma@example.com", role: "Customer", status: "Blocked", lastLogin: "2 days ago" },
    { id: 4, name: "Moderator", email: "mod@store.com", role: "Moderator", status: "Active", lastLogin: "Yesterday" },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: "Accessories", productCount: 42, status: "Active" },
    { id: 2, name: "Clothing", productCount: 89, status: "Active" },
    { id: 3, name: "Home Decor", productCount: 31, status: "Active" },
    { id: 4, name: "Watches", productCount: 18, status: "Active" },
  ]);

  const [coupons, setCoupons] = useState([
    { id: 1, code: "WELCOME20", discount: "20%", validUntil: "2024-02-15", used: 124, status: "Active" },
    { id: 2, code: "SAVE10", discount: "₹10", validUntil: "2024-01-31", used: 89, status: "Active" },
    { id: 3, code: "SUMMER25", discount: "25%", validUntil: "2024-01-10", used: 256, status: "Expired" },
  ]);

  const [userData, setUserData] = useState({
    name: "Admin User",
    email: "admin@store.com",
    avatar: "",
    joinDate: "2024-01-01"
  });

  // Section navigation buttons
  const sections = [
    { id: "analytics", label: "Analytics", icon: Icons.BarChart },
    { id: "products", label: "Products", icon: Icons.Package },
    { id: "orders", label: "Orders", icon: Icons.ShoppingCart },
    { id: "users", label: "Users", icon: Icons.Users },
    { id: "categories", label: "Categories", icon: Icons.Tag },
    { id: "coupons", label: "Coupons", icon: Icons.Percent },
    { id: "notifications", label: "Notifications", icon: Icons.Bell },
    { id: "activity", label: "Activity Logs", icon: Icons.Activity },
    { id: "settings", label: "Settings", icon: Icons.Settings },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "products":
        return <ProductManagement products={products} setProducts={setProducts} />;
      case "orders":
        return <OrderManagement orders={orders} setOrders={setOrders} />;
      case "users":
        return <UserManagement users={users} setUsers={setUsers} />;
      case "categories":
        return <CategoryManagement categories={categories} setCategories={setCategories} />;
      case "coupons":
        return <CouponManagement coupons={coupons} setCoupons={setCoupons} />;
      case "notifications":
        return <NotificationCenter />;
      case "activity":
        return <ActivityLogs />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  // Measure Navbar + Header heights and compute remaining height
  useLayoutEffect(() => {
    const compute = () => {
      const navH = navbarRef.current ? navbarRef.current.offsetHeight : 0;
      const headerH = headerRef.current ? headerRef.current.offsetHeight : 0;
      const totalTop = navH + headerH;
      const remaining = window.innerHeight - totalTop;
      // minimal fallback to avoid tiny/negative heights
      setContentHeight(Math.max(remaining, 300));
    };

    // initial compute
    compute();

    // recompute on resize & when fonts/layout settle
    window.addEventListener("resize", compute);
    // also compute after a short timeout to catch dynamic content changes
    const t = setTimeout(compute, 120);
    return () => {
      window.removeEventListener("resize", compute);
      clearTimeout(t);
    };
  }, []);

  return (
    <div 
      className=" pb-2 w-full overflow-hidden text-[#5b3d25]"
        style={{
          backgroundColor: "#442314",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 14px",
        }}
    >

      
      {/* Page Header - measured via headerRef */}
      <div ref={headerRef} className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 shrink-0">
        <h1 className="text-[#E3D5C3] boldonse-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl wrap-break-word max-w-full mb-3 sm:mb-4 md:mb-8 px-2 sm:px-0">
          DASHBOARD
        </h1>
        
        {/* MOBILE PROFILE BOX - Visible only on mobile */}
        <div className="lg:hidden mb-4 flex flex-col items-center">
          <div className=" text-[#E3D5C3] p-4 w-full max-w-sm">
            <div className="flex items-center gap-4">
              <div className="w-[120px] h-[120px] rounded-full bg-[#5b3d25]/10 flex items-center justify-center overflow-hidden border-2 border-[#5b3d25]/20">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#5b3d25] font-bold text-3xl">
                    {userData.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-[#5b3d25] truncate">{userData.name}</h3>
                <p className="text-sm text-[#5b3d25]/70 truncate">{userData.email}</p>
                <p className="text-xs text-[#5b3d25]/50 mt-1">Joined: {userData.joinDate}</p>
                <div className="mt-2 px-2 py-1 bg-[#5b3d25]/10 text-[#5b3d25] rounded text-xs inline-block">
                  Admin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED HEIGHT WRAPPER FOR SIDEBAR + MAIN CONTENT */}
      <div
        className="text-[#E3D5C3] flex-1 min-h-screen p-1 lg:-mt-6"
        style={{
          height: contentHeight ? `${contentHeight}px` : undefined,
        }}
      >
      
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-full">
          {/* MOBILE HORIZONTAL TABS - Improved for small screens */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-1 mb-2 overflow-x-auto pb-3 scrollbar-hide nunito-exbold">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 shrink-0 ${
                    activeSection === section.id
                      ? "bg-[#5b3d25] text-white"
                      : "bg-[#5b3d25]/10 hover:bg-[#5b3d25]/20"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-xs whitespace-nowrap">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SIDEBAR & MAIN CONTENT ROW - MUST HAVE h-full */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 h-full ">
            
            {/* LEFT SIDEBAR - Desktop only - NO CHANGES */}
            <div className="hidden lg:block lg:w-[200px] xl:w-[220px] shrink-0 ">
              <div className="bg-[#FFE9D5] relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 mx-auto text-[#452215] cursor-pointer backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 h-full overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Admin Profile Section */}
                <div className="mb-6 flex flex-col items-center">
                  <SidebarProfile userData={userData} setUserData={setUserData} Icons={Icons} width={160} height={160}/>
                </div>

                {/* Navigation Items - Enhanced for wider sidebar */}
                <h3 className="text-lg font-bold mb-3 text-[#5b3d25] text-center lg:text-left">Management</h3>
                <div className="space-y-1.5 flex-1 nunito-exbold">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        activeSection === section.id
                          ? "bg-[#5b3d25] text-white"
                          : "hover:bg-[#5b3d25]/10 text-[#5b3d25]"
                      }`}
                      title={section.label}
                    >
                      <section.icon />
                      <span className="truncate">{section.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sidebar Footer */}
                <div className="pt-4 mt-4 border-t border-[#5b3d25]/10 text-xs text-[#5b3d25]/50">
                  <p className="text-center">Dashboard v1.0</p>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT BOX - FIXED HEIGHT WITH HIDDEN SCROLLBAR */}
            <div className="flex-1 min-h-0">
              <div className="h-full  flex flex-col">
                
                {/* Content Header - Improved spacing for mobile */}
                <div className="p-1.5 sm:p-2 border-b border-[#5b3d25]/10 shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-4xl font-semibold text-[#E3D5C3] nunito-exbold">
                        {sections.find(s => s.id === activeSection)?.label || "Dashboard"}
                      </h2>
                      <p className="text-xs mt-1 gowun-dodum-regular">
                        Manage your {sections.find(s => s.id === activeSection)?.label.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SCROLLABLE CONTENT AREA - FIXED HEIGHT, HIDDEN SCROLLBAR */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="p-3 sm:p-4 md:p-6">
                      {renderSectionContent()}
                    </div>
                  </div>
                </div>

                {/* Content Footer - Better spacing for mobile */}
                <div className="p-2 sm:p-3 md:p-4 border-t border-[#5b3d25]/10 shrink-0">
                  <div className="flex flex-col xs:flex-row items-center justify-between gap-2 text-xs text-[#5b3d25]/60">
                    <span className="text-center xs:text-left">Last updated: Today</span>
                    <span className="text-center xs:text-right">© 2025 Dashboard</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManager;

