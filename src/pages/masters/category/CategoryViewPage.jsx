import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/utils/axiosInstance";

const CategoryViewPage = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
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
          setCategoryData(response.data?.data);
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

  if (error || !categoryData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white shadow-md rounded-lg p-6 w-full">
          <p className="text-red-600">Error loading category details.</p>
          <button
            onClick={handleBackToList}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium w-auto mt-4"
          >
            Back to List
          </button>
        </div>
      </MainLayout>
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
            <span className="text-gray-800">View Category</span>
          </nav>

          <div className="flex justify-between items-center mb-6 w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                View Category
              </h1>
              <p className="text-gray-600 mt-1">Category details</p>
            </div>
            <button
              onClick={handleBackToList}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition duration-200 font-medium w-auto"
            >
              Back to List
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <div className="mb-6 w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Basic Information
            </h2>
            <p className="text-gray-600 text-sm">Details of the category</p>
          </div>

          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {categoryData.name}
                </p>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {categoryData.status.charAt(0).toUpperCase() +
                    categoryData.status.slice(1)}
                </p>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50 min-h-[100px]">
                {categoryData.description || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryViewPage;
