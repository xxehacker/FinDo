import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/utils/axiosInstance";

const BankCreatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    ifsc: "",
    branch: "",
    accountNumber: "",
    amount: "",
    accountType: "primary",
    acountUsedAs: "savings",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("name: ", name, "value: ", value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bankData = {
        name: formData.name.trim(),
        ifsc: formData.ifsc.trim(),
        branch: formData.branch.trim(),
        accountNumber: formData.accountNumber.trim(),
        amount: Number(formData.amount) || 0,
        accountType: formData.accountType,
        // acountUsedAs: formData.acountUsedAs,
      };

      if (!bankData.name || !bankData.accountNumber) {
        throw new Error("Bank name and account number are required");
      }

      const response = await AXIOS_INSTANCE.post(
        API_ENDPOINTS.BANK.CREATE,
        bankData
      );

      if (response.data) {
        toast.success("Bank account created successfully");
        navigate("/master/bank");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message || err);
      toast.error(
        `Failed to create bank account: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    navigate("/master/bank");
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
            <span className="text-gray-600">Financial Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Bank Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-800">Create Bank</span>
          </nav>

          <div className="flex justify-between items-center mb-6 w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Create Bank
              </h1>
              <p className="text-gray-600 mt-1">Add a new bank account</p>
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
                disabled={
                  loading ||
                  !formData.name.trim() ||
                  !formData.accountNumber.trim()
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-auto"
              >
                {loading ? "Creating..." : "Create Bank"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <div className="mb-6 w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Basic Information
            </h2>
            <p className="text-gray-600 text-sm">
              Bank account registration form
            </p>
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
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter bank name"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC
                </label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleInputChange}
                  placeholder="Enter IFSC code"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  placeholder="Enter branch name"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={loading}
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={loading}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default BankCreatePage;
