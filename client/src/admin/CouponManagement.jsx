import React, { useState } from "react";

const CouponManagement = ({ coupons, setCoupons }) => {
  const [form, setForm] = useState({
    code: "",
    type: "",
    value: "",
    validUntil: "",
  });

  const [editCoupon, setEditCoupon] = useState(null);
  const [deleteCoupon, setDeleteCoupon] = useState(null);

  // Handle input change for create/edit form
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --------------------------------------
  // CREATE COUPON (REAL-TIME)
  // --------------------------------------
  const handleCreate = () => {
    if (!form.code || !form.type || !form.value || !form.validUntil) return;

    const newCoupon = {
      id: Date.now(),
      code: form.code.toUpperCase(),
      discount: form.type === "Percentage" ? `${form.value}%` : `₹${form.value}`,
      validUntil: form.validUntil,
      used: 0,
      status: "Active",
    };

    setCoupons([...coupons, newCoupon]);

    // Reset form
    setForm({ code: "", type: "", value: "", validUntil: "" });
  };

  // --------------------------------------
  // EDIT COUPON (REAL-TIME)
  // --------------------------------------
  const handleEditSave = () => {
    setCoupons(
      coupons.map((c) =>
        c.id === editCoupon.id
          ? {
              ...c,
              code: editCoupon.code.toUpperCase(),
              discount:
                editCoupon.type === "Percentage"
                  ? `${editCoupon.value}%`
                  : `₹${editCoupon.value}`,
              validUntil: editCoupon.validUntil,
            }
          : c
      )
    );

    setEditCoupon(null);
  };

  // --------------------------------------
  // DELETE COUPON (REAL-TIME)
  // --------------------------------------
  const confirmDelete = () => {
    setCoupons(coupons.filter((c) => c.id !== deleteCoupon.id));
    setDeleteCoupon(null);
  };

  // --------------------------------------
  // TOGGLE ACTIVE / INACTIVE
  // --------------------------------------
  const toggleStatus = (id) => {
    setCoupons(
      coupons.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c
      )
    );
  };

  return (
    <div className="space-y-6 px-3 sm:px-4 md:px-0 gowun-dodum-regular">

      {/* HEADER */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#5b3d25] nunito-exbold">
          Coupon Management
        </h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition flex items-center gap-2 text-sm sm:text-base w-full xs:w-auto justify-center"
        >
          + Create Coupon
        </button>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white border border-[#5b3d25]/20 rounded-xl p-5">

        <h3 className="font-semibold mb-4 text-sm sm:text-base">
          Create New Coupon
        </h3>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">

          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={form.code}
            onChange={handleChange}
            className="px-4 py-2 border border-[#5b3d25] rounded-lg"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="px-4 py-2 border border-[#5b3d25] rounded-lg"
          >
            <option value="">Discount Type</option>
            <option value="Percentage">Percentage</option>
            <option value="Fixed Amount">Fixed Amount</option>
          </select>

          <input
            type="number"
            name="value"
            placeholder="Discount Value"
            value={form.value}
            onChange={handleChange}
            className="px-4 py-2 border border-[#5b3d25] rounded-lg"
          />

          <input
            type="date"
            name="validUntil"
            value={form.validUntil}
            onChange={handleChange}
            className="px-4 py-2 border border-[#5b3d25] rounded-lg"
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 md:mx-0">
        <div className="min-w-[640px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#5b3d25]">
                <th className="py-2 px-4 text-left text-sm">Coupon Code</th>
                <th className="py-2 px-4 text-left text-sm">Discount</th>
                <th className="py-2 px-4 text-left text-sm">Valid Until</th>
                <th className="py-2 px-4 text-left text-sm">Used</th>
                <th className="py-2 px-4 text-left text-sm">Status</th>
                <th className="py-2 px-4 text-left text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-[#5b3d25]/20 hover:bg-[#5b3d25]/5 transition"
                >
                  <td className="py-3 px-4 font-mono text-sm">{coupon.code}</td>
                  <td className="py-3 px-4 text-sm">{coupon.discount}</td>
                  <td className="py-3 px-4 text-sm">{coupon.validUntil}</td>
                  <td className="py-3 px-4 text-sm">{coupon.used} times</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        coupon.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex gap-2">

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          setEditCoupon({
                            ...coupon,
                            value: coupon.discount.replace(/\D/g, ""),
                            type: coupon.discount.includes("%")
                              ? "Percentage"
                              : "Fixed Amount",
                          })
                        }
                        className="text-[#5b3d25] hover:text-[#4a3120]"
                      >
                        ✏️
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => setDeleteCoupon(coupon)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑
                      </button>

                      {/* TOGGLE STATUS */}
                      <button
                        onClick={() => toggleStatus(coupon.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        🔄
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* EDIT MODAL */}
      {/* ------------------------------------------------ */}
      {editCoupon && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setEditCoupon(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-xl p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#5b3d25] mb-4">
              Edit Coupon
            </h3>

            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              value={editCoupon.code}
              onChange={(e) =>
                setEditCoupon({ ...editCoupon, code: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded mb-3"
              value={editCoupon.type}
              onChange={(e) =>
                setEditCoupon({ ...editCoupon, type: e.target.value })
              }
            >
              <option>Percentage</option>
              <option>Fixed Amount</option>
            </select>

            <input
              type="number"
              className="w-full border p-2 rounded mb-3"
              value={editCoupon.value}
              onChange={(e) =>
                setEditCoupon({ ...editCoupon, value: e.target.value })
              }
            />

            <input
              type="date"
              className="w-full border p-2 rounded mb-3"
              value={editCoupon.validUntil}
              onChange={(e) =>
                setEditCoupon({ ...editCoupon, validUntil: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditCoupon(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-[#5b3d25] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* DELETE CONFIRMATION */}
      {/* ------------------------------------------------ */}
      {deleteCoupon && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setDeleteCoupon(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-xl p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Delete Coupon?
            </h3>

            <p className="text-sm mb-4">
              Are you sure you want to delete coupon{" "}
              <strong>{deleteCoupon.code}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteCoupon(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
