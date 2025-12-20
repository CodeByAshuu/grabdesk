import React, { useState, useEffect } from "react";
import api from "../api/axios";

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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/categories');
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [setCategories]);

  // ------------------------------
  // ADD CATEGORY (real-time with backend)
  // ------------------------------
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const tempId = Date.now();
    const categoryName = newCategory.trim(); // Preserve name for error recovery
    const newData = { id: tempId, name: categoryName, productCount: 0 };

    // Optimistic update
    setCategories((prev) => [...prev, newData]);
    setNewCategory("");
    setShowAddModal(false);

    try {
      const response = await api.post('/admin/categories', { name: categoryName });
      if (response.data.success && response.data.category) {
        // Replace temp with real backend data
        setCategories((prev) =>
          prev.map((cat) => (cat.id === tempId ? response.data.category : cat))
        );
      }
    } catch (error) {
      console.error('Error adding category:', error);
      // Rollback on error
      setCategories((prev) => prev.filter((cat) => cat.id !== tempId));
      alert(error.response?.data?.message || 'Failed to add category. Please try again.');
      setShowAddModal(true);
      setNewCategory(categoryName);
    }
  };

  // ------------------------------
  // EDIT CATEGORY (real-time with backend)
  // ------------------------------
  const handleEditCategorySave = async () => {
    const previousCategories = categories;

    // Optimistic update
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editCategory.id ? { ...cat, name: editCategory.name } : cat
      )
    );
    setShowEditModal(false);

    try {
      const response = await api.patch(`/admin/categories/${editCategory.id}`, {
        name: editCategory.name
      });

      if (response.data.success && response.data.category) {
        // Update with backend response
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editCategory.id ? response.data.category : cat
          )
        );
      }
    } catch (error) {
      console.error('Error updating category:', error);
      // Rollback on error
      setCategories(previousCategories);
      alert(error.response?.data?.message || 'Failed to update category. Please try again.');
      setShowEditModal(true);
    }
  };

  // ------------------------------
  // DELETE CATEGORY (real-time with backend)
  // ------------------------------
  const confirmDeleteCategory = async () => {
    const previousCategories = categories;

    // Optimistic update
    setCategories((prev) => prev.filter((cat) => cat.id !== deleteCategory.id));
    setShowDeleteConfirm(false);

    try {
      await api.delete(`/admin/categories/${deleteCategory.id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      // Rollback on error
      setCategories(previousCategories);
      alert('Failed to delete category. Please try again.');
      setShowDeleteConfirm(true);
    }
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
