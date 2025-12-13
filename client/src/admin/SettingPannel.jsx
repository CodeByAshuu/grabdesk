import React, { useState } from "react";

const SettingsPanel = () => {
  // REAL-TIME USER DETAILS STATES
  const [username, setUsername] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#5b3d25");
  const [taxRate, setTaxRate] = useState("8.5");
  const [shippingCost, setShippingCost] = useState("$5.99");

  const handleSaveDetails = () => {
    alert("Details updated successfully!");
    setPassword(""); // Clear password field after saving
  };

  const handleSaveAllSettings = () => {
    alert("All settings saved successfully!");
  };

  const handleReset = () => {
    setUsername("Admin User");
    setEmail("admin@example.com");
    setPassword("");
    setPrimaryColor("#5b3d25");
    setTaxRate("8.5");
    setShippingCost("$5.99");
    alert("Settings reset to default!");
  };

  // Payment gateways state
  const [paymentGateways, setPaymentGateways] = useState([
    { id: 1, name: "Stripe", desc: "Credit/Debit Cards", enabled: true },
    { id: 2, name: "PayPal", desc: "PayPal Express Checkout", enabled: false },
    { id: 3, name: "Razorpay", desc: "UPI & Net Banking", enabled: true }
  ]);

  // Feature toggles state
  const [features, setFeatures] = useState([
    { id: 1, name: "Recommendation Engine", enabled: true },
    { id: 2, name: "Product Reviews", enabled: true },
    { id: 3, name: "Wishlist", enabled: false },
    { id: 4, name: "Email Notifications", enabled: true },
    { id: 5, name: "SMS Alerts", enabled: false },
  ]);

  const togglePaymentGateway = (id) => {
    setPaymentGateways(prev =>
      prev.map(gateway =>
        gateway.id === id ? { ...gateway, enabled: !gateway.enabled } : gateway
      )
    );
  };

  const toggleFeature = (id) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
      )
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 gowun-dodum-regular overflow-x-hidden">
      {/* Heading with better spacing */}
      <div className="px-2 sm:px-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5b3d25] nunito-exbold mb-1">
          Settings & Customization
        </h2>
        <p className="text-xs sm:text-sm text-[#5b3d25]/70">
          Manage your account, branding, and platform settings
        </p>
      </div>

      {/* GRID with improved responsive spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        
        {/* ------------------------------------- */}
        {/* 1. REAL-TIME PERSONAL DETAILS SECTION */}
        {/* ------------------------------------- */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-[#5b3d25]">
              My Account Details
            </h3>
            <span className="text-xs px-2 py-1 bg-[#5b3d25]/10 text-[#5b3d25] rounded-full">
              Personal
            </span>
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#5b3d25]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#5b3d25]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3d25]/30 focus:border-[#5b3d25] transition-all duration-200"
                placeholder="Enter username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#5b3d25]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#5b3d25]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3d25]/30 focus:border-[#5b3d25] transition-all duration-200"
                placeholder="Enter email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#5b3d25]">
                Change Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#5b3d25]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3d25]/30 focus:border-[#5b3d25] transition-all duration-200"
              />
              <p className="text-xs text-[#5b3d25]/50 mt-1">
                Leave blank to keep current password
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveDetails}
              className="px-5 py-2.5 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] text-sm font-medium transition-all duration-200 w-full active:scale-[0.98] shadow-sm hover:shadow"
            >
              Save Account Details
            </button>
          </div>
        </div>

        {/* ----------------------- */}
        {/* Branding Settings */}
        {/* ----------------------- */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-[#5b3d25]">
              Branding & Appearance
            </h3>
            <span className="text-xs px-2 py-1 bg-[#5b3d25]/10 text-[#5b3d25] rounded-full">
              Design
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3 text-[#5b3d25]">
                Logo Upload
              </label>
              <div className="border-2 border-dashed border-[#5b3d25]/30 rounded-lg p-6 sm:p-8 text-center hover:border-[#5b3d25]/50 transition-colors duration-200 cursor-pointer group">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 mb-3 rounded-full bg-[#5b3d25]/10 flex items-center justify-center group-hover:bg-[#5b3d25]/20 transition-colors duration-200">
                    <svg className="w-5 h-5 text-[#5b3d25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#5b3d25]/70 group-hover:text-[#5b3d25] transition-colors duration-200">
                    Drop logo here or click to upload
                  </p>
                  <p className="text-xs text-[#5b3d25]/50 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-[#5b3d25]">
                Primary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 sm:w-14 sm:h-14 cursor-pointer rounded-lg border border-[#5b3d25]/20"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#5b3d25]/30 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#5b3d25]/30 focus:border-[#5b3d25]"
                  />
                  <p className="text-xs text-[#5b3d25]/50 mt-1">
                    Hex color code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------- */}
        {/* Payment Gateways */}
        {/* ----------------------- */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-[#5b3d25]">
              Payment Gateways
            </h3>
            <span className="text-xs px-2 py-1 bg-[#5b3d25]/10 text-[#5b3d25] rounded-full">
              Payments
            </span>
          </div>

          <div className="space-y-4">
            {paymentGateways.map((pg) => (
              <div key={pg.id} className="flex items-center justify-between p-3 hover:bg-[#5b3d25]/5 rounded-lg transition-colors duration-200">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-sm truncate">{pg.name}</p>
                  <p className="text-xs text-[#5b3d25]/70 truncate">{pg.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={pg.enabled}
                    onChange={() => togglePaymentGateway(pg.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5b3d25]" />
                </label>
              </div>
            ))}
            
            {/* Add more gateways button */}
            <button className="w-full mt-2 px-4 py-2 border border-dashed border-[#5b3d25]/30 rounded-lg text-sm text-[#5b3d25]/70 hover:text-[#5b3d25] hover:border-[#5b3d25]/50 transition-colors duration-200">
              + Add Payment Gateway
            </button>
          </div>
        </div>

        {/* ----------------------- */}
        {/* Tax and Shipping */}
        {/* ----------------------- */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-sm transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-[#5b3d25]">
              Tax & Shipping
            </h3>
            <span className="text-xs px-2 py-1 bg-[#5b3d25]/10 text-[#5b3d25] rounded-full">
              Financial
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#5b3d25]">
                Tax Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#5b3d25]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3d25]/30 focus:border-[#5b3d25] transition-all duration-200"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[#5b3d25]/50">
                  %
                </span>
              </div>
              <p className="text-xs text-[#5b3d25]/50 mt-1">
                Applied to all taxable items
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#5b3d25]">
                Shipping Cost
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#5b3d25]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3d25]/30 focus:border-[#5b3d25] transition-all duration-200"
                />
              </div>
              <p className="text-xs text-[#5b3d25]/50 mt-1">
                Default shipping charge per order
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------- */}
        {/* Feature Toggles */}
        {/* ----------------------- */}
        <div className="bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 hover:shadow-sm transition-shadow duration-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-[#5b3d25]">
              Platform Features
            </h3>
            <span className="text-xs px-2 py-1 bg-[#5b3d25]/10 text-[#5b3d25] rounded-full">
              Features
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 hover:bg-[#5b3d25]/5 rounded-lg transition-colors duration-200">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{feature.name}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer ml-3">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={feature.enabled}
                    onChange={() => toggleFeature(feature.id)}
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5b3d25]" />
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#5b3d25]/10">
            <p className="text-xs text-[#5b3d25]/50">
              Toggle features on/off for your platform. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Save Settings Buttons - Improved for mobile */}
      <div className="sticky bottom-0 bg-[#f3eadc]/95 backdrop-blur-sm py-3 sm:py-4 mt-4 sm:mt-6 border-t border-[#5b3d25]/10">
        <div className="flex flex-col xs:flex-row gap-3 justify-end">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 text-sm font-medium transition-all duration-200 active:scale-[0.98] order-2 xs:order-1 w-full xs:w-auto"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSaveAllSettings}
            className="px-6 py-2.5 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] text-sm font-medium transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow order-1 xs:order-2 w-full xs:w-auto"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;