import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/utils/axiosInstance";

const CategoryEditPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const response = await AXIOS_INSTANCE.get(
          API_ENDPOINTS.CATEGORY.GET_BY_ID(id)
        );
        if (response.data && response.data.data) {
          setFormData({
            categoryName: response.data?.data?.name || "",
            description: response.data?.data?.description || "",
            status: response.data?.data?.status || "active",
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err);
        toast.error("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const categoryData = {
        name: formData.categoryName.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      if (!categoryData.name) {
        throw new Error("Category name is required");
      }

      const response = await AXIOS_INSTANCE.put(
        API_ENDPOINTS.CATEGORY.UPDATE(id),
        categoryData
      );

      if (response.status === 200) {
        toast.success("Category updated successfully");
        navigate("/master/category");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message || err);
      toast.error(
        `Failed to update category: ${
          err.response?.data?.message || err.message
        }`
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    navigate("/master/category");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 w-full">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="mb-6 bg-white shadow-md rounded-lg p-6 w-full">
          <nav className="text-gray-500 mb-4 text-sm w-full">
            <span className="text-gray-600">Store Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Category Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-800">Edit Category</span>
          </nav>

          <div className="flex justify-between items-center mb-6 w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Category
              </h1>
              <p className="text-gray-600 mt-1">Update category details</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBackToList}
                disabled={loading}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition duration-200 font-medium disabled:opacity-50 w-auto"
              >
                Back to List
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.categoryName.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-auto"
              >
                {loading ? "Updating..." : "Update Category"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <div className="mb-6 w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Basic Information
            </h2>
            <p className="text-gray-600 text-sm">Category update form</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md w-full">
              <p className="text-red-600 text-sm">
                Error: {error.response?.data?.message || error.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryEditPage;
