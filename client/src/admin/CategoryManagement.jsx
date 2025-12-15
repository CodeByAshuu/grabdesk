import React, { useState } from "react";

const Icons = {
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
};

const CategoryManagement = ({ categories, setCategories }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  // ------------------------------
  // ADD CATEGORY (real-time)
  // ------------------------------
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const newData = {
      id: Date.now(),
      name: newCategory,
      productCount: 0,
    };

    setCategories((prev) => [...prev, newData]);
    setNewCategory("");
    setShowAddModal(false);
  };

  // ------------------------------
  // EDIT CATEGORY (real-time)
  // ------------------------------
  const handleEditCategorySave = () => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editCategory.id ? { ...cat, name: editCategory.name } : cat
      )
    );
    setShowEditModal(false);
  };

  // ------------------------------
  // DELETE CATEGORY (real-time)
  // ------------------------------
  const confirmDeleteCategory = () => {
    setCategories((prev) => prev.filter((cat) => cat.id !== deleteCategory.id));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6 gowun-dodum-regular px-3 sm:px-4 md:px-0">

      {/* HEADER */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
        

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-[#F0A322] active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer flex items-center gap-2 text-sm sm:text-base w-full xs:w-auto justify-center"
        >
          <Icons.Plus /> Add Category
        </button>
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border bg-[#E3D5C3] text-[#452215] rounded-xl p-4 hover:shadow-sm transition"
          >
            <div className="flex justify-between items-start mb-3 ">
              <h4 className="font-semibold text-sm sm:text-base truncate">{category.name}</h4>
              <span className="px-2 py-1 bg-[#5b3d25]/10 text-[#5b3d25] rounded text-xs sm:text-sm">
                {category.productCount} products
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditCategory(category);
                  setShowEditModal(true);
                }}
                className="flex-1 px-3 py-2 rounded-lg hover:bg-[#5b3d25]/10 text-xs sm:text-sm active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setDeleteCategory(category);
                  setShowDeleteConfirm(true);
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1 cursor-pointer "
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      

      {/* ------------------------------------------------ */}
      {/* ADD CATEGORY MODAL */}
      {/* ------------------------------------------------ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4"
             onClick={() => setShowAddModal(false)}>
          
          <div
            className="bg-[#E3D5C3] text-[#452215] rounded-xl p-5 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#5b3d25] mb-4">Add Category</h3>

            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border border-[#452215]/30 rounded-lg p-2 mb-4 bg-[#E3D5C3] text-[#452215] "
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg active:translate-y-1 relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1 cursor-pointer">Cancel</button>
              <button onClick={handleAddCategory}
                className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1 cursor-pointer">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* EDIT CATEGORY MODAL */}
      {/* ------------------------------------------------ */}
      {showEditModal && editCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4"
             onClick={() => setShowEditModal(false)}>
          
          <div
            className="bg-[#E3D5C3] text-[#452215] rounded-xl p-5 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#452215] nunito-exbold mb-4">Edit Category</h3>

            <input
              type="text"
              value={editCategory.name}
              onChange={(e) =>
                setEditCategory({ ...editCategory, name: e.target.value })
              }
              className="w-full border [#E3D5C3] text-[#452215] rounded-lg p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded-lg active:translate-y-1   relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1 cursor-pointer">Cancel</button>
              <button onClick={handleEditCategorySave}
                className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1 cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* DELETE CONFIRMATION */}
      {/* ------------------------------------------------ */}
      {showDeleteConfirm && deleteCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4"
             onClick={() => setShowDeleteConfirm(false)}>
          
          <div
            className="bg-[#E3D5C3]  rounded-xl p-5 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#452215] mb-4">Delete Category?</h3>

            <p className="text-sm text-[#452215]/70 mb-4">
              Are you sure you want to delete <strong>{deleteCategory.name}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={confirmDeleteCategory}
                className="px-4 py-2 bg-[#F0A322] text-white rounded-lg active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1 cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
