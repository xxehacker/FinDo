import React, { useState, useEffect } from "react";
// import { Bank } from "lucide-react";
import MainLayout from "../../../components/layouts/MainLayout";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { useNavigate } from "react-router-dom";
import AXIOS_INSTANCE from "@/utils/axiosInstance";

const BankManagement = () => {
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //! Fetch banks handler
  const fetchBanks = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await AXIOS_INSTANCE.get(API_ENDPOINTS.BANK.GET_ALL);
      console.log("response: ", response.data);
      if (response?.status === 200) {
        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setBanks(data);
        setFilteredBanks(data);
      } else {
        throw new Error(
          `Unexpected response status: ${response?.statusCode || "No status"}`
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch banks"
      );
      setBanks([]);
      setFilteredBanks([]);
    } finally {
      setLoading(false);
    }
  };

  //! Fetch banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  //! Handle search filtering
  useEffect(() => {
    if (Array.isArray(banks)) {
      const filtered = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (bank.branch?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (bank.accountNumber?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks([]);
    }
  }, [searchTerm, banks]);

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="mb-6 bg-white shadow-md rounded-lg p-6">
          <nav className="text-gray-500 mb-4 text-sm">
            <span className="text-gray-600">Store Management</span>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-800">Bank Management</span>
          </nav>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Bank Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage bank accounts and financial details
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 font-medium cursor-pointer"
              onClick={() => navigate("/master/bank/create")}
            >
              Add New Bank Account
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">Search Banks</h3>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search by name, branch, or account number"
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
                <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Bank Name
                </th>
                <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Branch
                </th>
                <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Account Number
                </th>
                <th className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Amount
                </th>
                <th className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Type
                </th>
                <th className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Used As
                </th>
                <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full inline-block"></div>
                  </td>
                </tr>
              ) : filteredBanks.length > 0 ? (
                filteredBanks.map((bank, index) => (
                  <tr
                    key={bank._id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          {/* <Bank className="text-blue-600" size={16} /> */}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {bank.name}
                          </div>
                          {bank.ifsc && (
                            <div className="text-xs text-gray-500 truncate">
                              IFSC: {bank.ifsc}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-sm text-gray-600">
                        {bank.branch || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-sm text-gray-600">
                        {bank.accountNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{bank.amount?.toLocaleString() || "0"}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {bank.accountType || "primary"}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                        {bank.acountUsedAs || "savings"}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-600 hover:text-gray-800 transition duration-150 font-medium bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                          title="View"
                          onClick={() => navigate(`/master/bank/${bank._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-800 transition duration-150 font-medium bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50"
                          title="Edit"
                          onClick={() =>
                            navigate(`/master/bank/${bank._id}/edit`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition duration-150 font-medium bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-red-50"
                          title="Delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this bank account?"
                              )
                            ) {
                              // Implement delete API call here
                              // Example: await execute({ url: `${API_ENDPOINTS.BANK.DELETE}/${bank._id}`, method: "DELETE" });
                            }
                          }}
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
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No banks found
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

export default BankManagement;
