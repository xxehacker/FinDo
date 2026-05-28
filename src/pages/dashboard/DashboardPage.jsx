import { useState, useEffect } from "react";
import { MainLayout } from "@/components";
import Dashboard from "@/components/dashboard/Dashboard";
import AXIOS_INSTANCE from "@/utils/axiosInstance.js";
import { API_ENDPOINTS } from "@/utils/apiPath.js";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.get(
        API_ENDPOINTS.DASHBOARD.GET_DATA,
      );

      if (response.status === 200 && response.data?.data) {
        setDashboardData(response.data.data);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.response?.data?.message || "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Format number as Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  const { summary, tasks, recentTransactions, upcomingTasks, monthlyTrend } =
    dashboardData || {};

  const demoProps = {
    totalIncome: summary?.totalIncome ?? 0,
    totalExpenses: summary?.totalExpenses ?? 0,
    totalBalance: summary?.totalBalance ?? 0,
    monthIncome: summary?.monthIncome ?? 0,
    monthExpenses: summary?.monthExpenses ?? 0,
    incomeCount: summary?.incomeCount ?? 0,
    completedTasks: tasks?.completed || 0,
    totalTasks: tasks?.total || 0,
    incomeChange: summary?.incomeChange || 0,
    expenseChange: summary?.expenseChange || 0,
    monthlyTrend: monthlyTrend || { incomeData: [], expenseData: [] },
    userTransactions: (recentTransactions || []).map((txn) => ({
      id: txn.id,
      description: txn.description,
      category: txn.category,
      amount: txn.amount,
      type: txn.type,
      date: txn.date,
    })),
    userTasks: (upcomingTasks || []).map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      progress: task.progress,
      dueDate: formatDate(task.dueDate),
      status: task.status,
    })),
    formatCurrency,
    getPriorityColor,
    getStatusColor,
    formatStatus,
    setShowTransactionForm: (show) =>
      console.log(`Show transaction form: ${show}`),
    setShowTaskForm: (show) => console.log(`Show task form: ${show}`),
  };

  return (
    <MainLayout>
      <Dashboard {...demoProps} />
    </MainLayout>
  );
};

export default DashboardPage;
