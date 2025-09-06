import React, { useState, useEffect } from "react";
import { Folder } from "lucide-react";
import MainLayout from "../../../components/layouts/MainLayout";
import useAxios from "@/hooks/useAxios";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { useNavigate } from "react-router-dom";

const CategoryMasterViewPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { execute, loading } = useAxios(API_ENDPOINTS.CATEGORY.GET_ALL, null, {
    manual: true,
    method: "GET",
  });

  //! Fetch categories handler
  const fetchCategories = async () => {
    try {
      setError(null);
      const response = await execute();
      if (response?.statusCode === 200) {
        setCategories(response.data || []);
        setFilteredCategories(response.data || []);
      } else {
        throw new Error(
          `Unexpected response status: ${response?.statusCode || "No status"}`
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch categories"
      );
    }
  };

  //! Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  //! Handle search filtering
  useEffect(() => {
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="mb-6 bg-white shadow-md rounded-lg p-6">
          <nav className="text-gray-500 mb-4 text-sm">
            <span className="text-gray-600">Store Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-800">Category Management</span>
          </nav>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Category Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage medicine categories and sub-categories
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium cursor-pointer"
              onClick={() => navigate("/master/category/create")}
            >
              Add New Category
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">
              Search Categories
            </h3>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search by name or description"
                className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-200 transition duration-200"
                onClick={() => setSearchTerm("")}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  ID
                </th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Category
                </th>
                <th className="w-2/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Description
                </th>
                <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full inline-block"></div>
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                          <Folder className="text-yellow-600" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-sm text-gray-600">
                        {category.description || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-600 hover:text-gray-800 transition duration-150 font-medium bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                          title="View"
                        >
                          View
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-800 transition duration-150 font-medium bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition duration-150 font-medium bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-red-50"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryMasterViewPage;
