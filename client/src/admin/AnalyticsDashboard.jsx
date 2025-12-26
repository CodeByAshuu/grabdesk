import React, { useEffect, useState } from "react";

// IMPORT THE NEW CHART COMPONENTS
import SalesChart from "../components/charts/SalesChart";
import ProductsChart from "../components/charts/ProductsChart";

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
  Attention: () => (
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  )
};

import { io } from "socket.io-client";
import api from "../api/axios"; // Adjust path if needed

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
    topProduct: 0,
    topProductName: 'N/A',
  });

  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'daily'

  const fetchData = async (mode = viewMode) => {
    try {
      const salesEndpoint = mode === 'daily'
        ? '/admin/analytics/daily-sales'
        : '/admin/analytics/sales-history';

      const [statsRes, historyRes, productsRes] = await Promise.all([
        api.get('/admin/analytics/stats'),
        api.get(salesEndpoint),
        api.get('/admin/analytics/top-products')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (historyRes.data.success) setSalesData(historyRes.data.history.length ? historyRes.data.history : [{ month: 'No Data', sales: 0 }]);
      if (productsRes.data.success) setProductData(productsRes.data.products);

    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // CONNECT TO SOCKET
    const newSocket = io("http://localhost:5000"); // Ensure this matches your backend URL

    // LISTEN FOR EVENTS
    newSocket.on("newLog", () => {
      // Simple strategy: refetch all stats when ANY activity happens
      // This ensures data consistency without complex client-side math
      fetchData();
    });

    // Also listen for specific events if they exist (or just rely on newLog if it covers everything)
    newSocket.on("orderPlaced", fetchData);
    newSocket.on("userRegistered", fetchData);

    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array = run once on mount

  // Refetch when view mode changes
  useEffect(() => {
    fetchData(viewMode);
  }, [viewMode]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-0 gowun-dodum-regular">

        {/* Total Sales */}
        <div className="bg-[#FFE9D5] border  rounded-lg sm:rounded-xl p-4 sm:p-6 relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215] cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Total Sales</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">₹{stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base"><Icons.BarChart /></span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 truncate">Updated Just Now</p>
        </div>

        {/* Total Products (Inventory) */}
        <div className="bg-[#FFE9D5] border rounded-lg sm:rounded-xl p-4 sm:p-6 relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215] cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Total Products</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">{stats.totalProducts?.toLocaleString() || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base"><Icons.Package /></span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 truncate">Inventory Count</p>
        </div>

        {/* Active Users */}
        <div className=" bg-[#FFE9D5] border rounded-lg sm:rounded-xl p-4 sm:p-6 relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215] cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Active Users</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base"><Icons.Users /></span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 truncate">Registered Members</p>
        </div>

        {/* Most Sold Product */}
        <div className="bg-[#FFE9D5] rounded-lg sm:rounded-xl p-4 sm:p-6 relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215] cursor-pointer border">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Most Sold Product</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">{stats.topProduct}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base"><Icons.Tag /></span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 truncate">
            {stats.topProductName}
          </p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 px-2 sm:px-0">

        {/* SALES CHART */}
        <div className="bg-[#FFE9D5] gowun-dodum-regular border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215] rounded-lg p-4 sm:p-6 ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm sm:text-base">Sales Overview</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1 text-xs sm:text-sm rounded border transition-all ${viewMode === 'monthly'
                    ? 'bg-[#5b3d25] text-white border-[#5b3d25]'
                    : 'bg-white text-[#5b3d25] border-[#5b3d25] hover:bg-[#5b3d25]/10'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 text-xs sm:text-sm rounded border transition-all ${viewMode === 'daily'
                    ? 'bg-[#5b3d25] text-white border-[#5b3d25]'
                    : 'bg-white text-[#5b3d25] border-[#5b3d25] hover:bg-[#5b3d25]/10'
                  }`}
              >
                Daily
              </button>
            </div>
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* TOP PRODUCTS CHART */}
        <div className="bg-[#FFE9D5] gowun-dodum-regular border  rounded-lg p-4 sm:p-6 relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]">
          <h3 className="font-semibold mb-4 text-sm sm:text-base">Top Products</h3>
          <ProductsChart data={productData.length ? productData : []} />
        </div>

      </div>

    </div>
  );
};


export default AnalyticsDashboard;
