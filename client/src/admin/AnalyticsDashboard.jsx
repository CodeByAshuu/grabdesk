import React, { useEffect, useState } from "react";

// IMPORT THE NEW CHART COMPONENTS
import SalesChart from "../components/charts/SalesChart";
import ProductsChart from "../components/charts/ProductsChart";

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 24589,
    totalOrders: 1248,
    activeUsers: 5678,
    lowStock: 12,
  });

  const [salesData, setSalesData] = useState([
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 5000 },
    { month: "Mar", sales: 4700 },
    { month: "Apr", sales: 5200 },
    { month: "May", sales: 5800 },
  ]);

  const [productData, setProductData] = useState([
    { name: "Wallet", sales: 240 },
    { name: "Leather Bag", sales: 180 },
    { name: "Watch", sales: 300 },
    { name: "Shoes", sales: 200 },
  ]);

  // AUTO UPDATE EVERY 5 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalSales: prev.totalSales + Math.floor(Math.random() * 50),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 4),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 15),
        lowStock: prev.lowStock,
      }));

      setSalesData((prev) => {
        const newVal = {
          month: `M${prev.length + 1}`,
          sales: prev[prev.length - 1].sales + Math.floor(Math.random() * 300),
        };
        return [...prev.slice(-5), newVal];
      });

      setProductData((prev) =>
        prev.map((p) => ({
          ...p,
          sales: p.sales + Math.floor(Math.random() * 20),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-0">

        {/* Total Sales */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Total Sales</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">{stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base">📈</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 truncate">+12.5% from last month</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">{stats.totalOrders.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base">📦</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 truncate">+8.2% from last month</p>
        </div>

        {/* Active Users */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Active Users</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base">👥</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2 truncate">+15.3% from last month</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">Low Stock Items</p>
              <p className="text-xl sm:text-2xl font-bold text-[#5b3d25] truncate">{stats.lowStock}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b3d25]/10 rounded-full flex items-center justify-center shrink-0 ml-2">
              <span className="text-[#5b3d25] text-sm sm:text-base">⚠️</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-red-600 mt-1 sm:mt-2 truncate">Need attention</p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 px-2 sm:px-0">

        {/* SALES CHART */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm sm:text-base">Sales Overview</h3>
          <div className="h-48 sm:h-56 md:h-64">
            <SalesChart data={salesData} />
          </div>
        </div>

        {/* TOP PRODUCTS CHART */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm sm:text-base">Top Products</h3>
          <div className="h-48 sm:h-56 md:h-64">
            <ProductsChart data={productData} />
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;
