import React, { useState, useEffect } from "react";
import api from "../api/axios";

const Icons = {
  Package: () => <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Filter: () => <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
};

// --------------------------------------------------
// REAL-TIME FEATURES (MODALS + FILTER + UPDATE)
// --------------------------------------------------
const OrderManagement = ({ orders, setOrders }) => {
  const [filter, setFilter] = useState("All Status");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All Status"); // NEW
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from backend on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/orders');
        if (response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Keep existing orders on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders]);

  /* 
   --------------------------------------------------------
   SAFE, SMART & NON-DESTRUCTIVE FILTERING LOGIC 
   --------------------------------------------------------
   - Prevents errors if orders = undefined/null
   - Uses .toLowerCase() for consistent comparison
   - Easily extendable for future filters
  --------------------------------------------------------
  */
  const filteredOrders = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];

    if (filter === "All Status") return orders;

    return orders.filter(
      (order) =>
        String(order.status).toLowerCase() === filter.toLowerCase()
    );
  }, [orders, filter]);

  /*
   --------------------------------------------------------
   SAFE STATUS UPDATE FUNCTION WITH BACKEND API
   --------------------------------------------------------
   - Calls backend API to persist changes
   - Optimistic UI update for instant feedback
   - Rolls back on error
  --------------------------------------------------------
  */
  const updateStatus = async (newStatus) => {
    if (!statusModal || !statusModal.id) return;

    // Optimistic update
    const previousOrders = orders;
    setOrders((prev) =>
      prev?.map((o) =>
        o.id === statusModal.id
          ? { ...o, status: newStatus }
          : o
      ) || []
    );

    try {
      // Call backend API
      const response = await api.patch(`/admin/orders/${statusModal.id}/status`, {
        status: newStatus
      });

      if (response.data.success && response.data.order) {
        // Update with backend response to ensure consistency
        setOrders((prev) =>
          prev?.map((o) =>
            o.id === statusModal.id
              ? response.data.order
              : o
          ) || []
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Rollback on error
      setOrders(previousOrders);
      alert('Failed to update order status. Please try again.');
    }

    setStatusModal(null);
  };



  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 gowun-dodum-regular px-3 sm:px-4 md:px-0">

      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">


        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-4 w-full xs:w-auto">

          {/* REAL-TIME FILTER */}
          <select
            className="px-3 sm:px-4 py-1.5 sm:py-2 border bg-[#FFE9D5] text-[#5b3d25] rounded-lg  text-sm sm:text-base w-full xs:w-auto"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option className="gowun-dodum-regular">All Status</option>
            <option className="gowun-dodum-regular">Pending</option>
            <option className="gowun-dodum-regular">Shipped</option>
            <option className="gowun-dodum-regular">Delivered</option>
            <option className="gowun-dodum-regular">Canceled</option>
          </select>


          <button
            className="px-3 active:translate-y-1 sm:px-4 py-1.5 sm:py-2 border rounded-lg flex items-center gap-2 justify-center text-sm sm:text-base whitespace-nowrap w-full xs:w-auto bg-[#F0A322] nunito-bold relative border-[#452215] shadow-[4px_4px_0_#8F5E41] text-[#452215] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
            onClick={() => setFilter(selectedFilter)}
          >
            <Icons.Filter /> <span className="truncate">Filter</span>
          </button>

        </div>
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-[#FFE9D5] border rounded-lg sm:rounded-xl p-3 sm:p-4  transition relative  border-[#452215] shadow-[4px_4px_0_#8F5E41]  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215] cursor-pointer"
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
                className={`px-3 py-1 rounded-full text-xs sm:text-sm ${order.status === "Delivered"
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
                className="flex-1 px-3 py-2 active:translate-y-1 text-xs sm:text-sm justify-center   border nunito-bold rounded-lg flex items-center relative border-[#452215] shadow-[4px_4px_0_#8F5E41]  text-[#452215]  gap-2 transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
              >
                Update Status
              </button>

              <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 px-3 py-2 text-xs active:translate-y-1 sm:text-sm justify-center bg-[#F0A322]  border nunito-bold rounded-lg flex items-center relative border-[#452215] shadow-[4px_4px_0_#8F5E41]  text-[#452215]  gap-2 transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
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
          <div className="bg-[#FFE9D5] p-6 rounded-xl w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold text-[#442314] mb-4 nunito-exbold">
              Update Status
            </h3>

            <select
              className="w-full p-2 border rounded-lg text-[#442314] border-[#442314] bg-[#FFE9D5]"
              defaultValue={statusModal.status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option className="text-[#442314] gowun-dodum-regular">Pending</option>
              <option className="text-[#442314] gowun-dodum-regular">Shipped</option>
              <option className="text-[#442314] gowun-dodum-regular">Delivered</option>
              <option className="text-[#442314] gowun-dodum-regular">Canceled</option>
            </select>

            <button
              onClick={() => setStatusModal(null)}
              className="mt-4 px-4 py-2 border active:translate-y-1 rounded-lg w-full bg-[#F0A322] text-[#5b3d25] relative border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ORDER DETAIL DRAWER */}
      {selectedOrder && (
        <div
          className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedOrder(null)} // CLOSE WHEN CLICKING OUTSIDE
        >
          {/* MODAL BOX */}
          <div
            className="w-full max-w-md bg-[#FFE9D5] rounded-2xl shadow-2xl p-6 border border-[#5b3d25]/20 animate-scaleIn"
            onClick={(e) => e.stopPropagation()} // PREVENT INSIDE CLICK FROM CLOSING
          >
            {/* CLOSE BUTTON */}


            <h3 className="text-xl font-semibold text-[#442314] nunito-exbold mb-4">
              Order Details
            </h3>

            <p className="text-[#442314]"><strong>ID:</strong> {selectedOrder.id}</p>
            <p className="text-[#442314]"><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p className="text-[#442314]"><strong>Status:</strong> {selectedOrder.status}</p>
            <p className="text-[#442314]"><strong>Total:</strong> {selectedOrder.total}</p>
            <p className="text-[#442314]"><strong>Date:</strong> {selectedOrder.date}</p>
            <p className="text-[#442314]"><strong>Payment:</strong> {selectedOrder.payment}</p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 px-4 py-2 active:translate-y-1 text-[#452215] rounded-lg w-full bg-[#F0A322]  relative border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* ANIMATIONS */}
          <style>{`
      @keyframes scaleIn {
        0% { transform: scale(0.85); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-scaleIn {
        animation: scaleIn 0.25s ease-out;
      }
    `}</style>
        </div>
      )}

    </div>
  );
};

export default OrderManagement;
