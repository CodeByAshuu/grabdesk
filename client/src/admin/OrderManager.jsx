import React, { useState } from "react";

const Icons = {
  Package: () => <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
  Filter: () => <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
};

// --------------------------------------------------
// REAL-TIME FEATURES (MODALS + FILTER + UPDATE)
// --------------------------------------------------
const OrderManagement = ({ orders, setOrders }) => {
  const [filter, setFilter] = useState("All Status");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(null);

  // Filter logic (real-time)
  const filteredOrders =
    filter === "All Status"
      ? orders
      : orders.filter((o) => o.status === filter);

  // Update status function
  const updateStatus = (newStatus) => {
    setOrders(
      orders.map((o) =>
        o.id === statusModal.id ? { ...o, status: newStatus } : o
      )
    );
    setStatusModal(null);
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 gowun-dodum-regular px-3 sm:px-4 md:px-0">

      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#5b3d25] nunito-exbold">
          Order Management
        </h2>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-4 w-full xs:w-auto">

          {/* REAL-TIME FILTER */}
          <select
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-[#5b3d25] rounded-lg bg-transparent text-sm sm:text-base w-full xs:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Canceled</option>
          </select>

          <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 transition-colors flex items-center gap-2 justify-center text-sm sm:text-base whitespace-nowrap w-full xs:w-auto">
            <Icons.Filter /> <span className="truncate">Filter</span>
          </button>
        </div>
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="border border-[#5b3d25]/30 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start mb-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-sm sm:text-base truncate">
                  {order.id}
                </h4>
                <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">
                  {order.customer}
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-1.5 mb-4">
              <p className="text-xs sm:text-sm truncate">Date: {order.date}</p>
              <p className="text-xs sm:text-sm truncate">Total: {order.total}</p>
              <p className="text-xs sm:text-sm truncate">Payment: {order.payment}</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-2">
              <button
                onClick={() => setStatusModal(order)}
                className="flex-1 px-3 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 text-xs sm:text-sm"
              >
                Update Status
              </button>

              <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 px-3 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] text-xs sm:text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* STATUS UPDATE MODAL */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-[#5b3d25] mb-4">
              Update Status
            </h3>

            <select
              className="w-full p-2 border rounded-lg"
              defaultValue={statusModal.status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Canceled</option>
            </select>

            <button
              onClick={() => setStatusModal(null)}
              className="mt-4 px-4 py-2 border rounded-lg w-full text-[#5b3d25]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ORDER DETAIL DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <div className="bg-white w-80 sm:w-96 h-full p-5 shadow-xl overflow-y-auto rounded-l-xl">

            <h3 className="text-xl font-semibold text-[#5b3d25] mb-4">
              Order Details
            </h3>

            <p><strong>ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total:</strong> {selectedOrder.total}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p><strong>Payment:</strong> {selectedOrder.payment}</p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 px-4 py-2 bg-[#5b3d25] text-white rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
