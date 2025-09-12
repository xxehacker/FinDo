import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/utils/axiosInstance";

const BankViewPage = () => {
  const { id } = useParams();
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankData = async () => {
      setLoading(true);
      try {
        const response = await AXIOS_INSTANCE.get(
          API_ENDPOINTS.BANK.GET_BY_ID(id)
        );
        if (response.status === 200 && response.data?.data) {
          setBankData(response.data?.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err);
        toast.error("Failed to load bank data");
        setBankData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBankData();
  }, [id]);

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

  if (error || !bankData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white shadow-md rounded-lg p-6 w-full">
          <p className="text-red-600">Error loading bank details.</p>
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
            <span className="text-gray-600">Financial Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Bank Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-800">View Bank</span>
          </nav>

          <div className="flex justify-between items-center mb-6 w-full">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                View Bank
              </h1>
              <p className="text-gray-600 mt-1">Bank account details</p>
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
            <p className="text-gray-600 text-sm">Details of the bank account</p>
          </div>

          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {bankData.name}
                </p>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {bankData.ifsc || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {bankData.branch || "N/A"}
                </p>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {bankData.accountNumber}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {bankData.amount || "0"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <p className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-gray-50">
                  {bankData.accountType.charAt(0).toUpperCase() +
                    bankData.accountType.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BankViewPage;
