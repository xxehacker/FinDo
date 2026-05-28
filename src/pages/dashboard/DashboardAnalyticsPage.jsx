import { useEffect, useState } from "react";
import { MainLayout } from "@/components";
import DashboardAnalytics from "@/components/dashboard/DashboardAnalytics";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import { API_ENDPOINTS } from "@/utils/apiPath";

const DashboardAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({});
  const [monthlyTrend, setMonthlyTrend] = useState({
    incomeData: [],
    expenseData: [],
  });
  const [transactions, setTransactions] = useState([]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardRes, txnRes] = await Promise.all([
        AXIOS_INSTANCE.get(API_ENDPOINTS.DASHBOARD.GET_DATA),
        AXIOS_INSTANCE.get(API_ENDPOINTS.TRANSACTION.GET_ALL),
      ]);

      const dashboard = dashboardRes.data?.data || {};
      setSummary(dashboard.summary || {});
      setMonthlyTrend(
        dashboard.monthlyTrend || { incomeData: [], expenseData: [] }
      );
      setTransactions(txnRes.data?.data?.transactions || []);
    } catch (err) {
      console.error("Analytics load error:", err);
      setError(err?.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12 neo-card p-8 max-w-md mx-auto">
          <p className="text-destructive font-semibold mb-4">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="neo-btn px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DashboardAnalytics
        summary={summary}
        monthlyTrend={monthlyTrend}
        transactions={transactions}
        formatCurrency={formatCurrency}
      />
    </MainLayout>
  );
};

export default DashboardAnalyticsPage;
