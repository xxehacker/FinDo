import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExpenseChart } from "./ExpenseChart";
import { DailyTransactionChart } from "./DailyTransactionChart";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { ArrowLeft, TrendingUp, PieChart } from "lucide-react";

const DashboardAnalytics = ({
  summary = {},
  monthlyTrend = { incomeData: [], expenseData: [] },
  transactions = [],
  formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`,
}) => {
  const {
    totalIncome = 0,
    totalExpenses = 0,
    totalBalance = 0,
    monthIncome = 0,
    monthExpenses = 0,
    incomeChange = 0,
    expenseChange = 0,
  } = summary;

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions.forEach((txn) => {
      const name = txn.category?.name || txn.category || "Uncategorized";
      const key = typeof name === "string" ? name : "Uncategorized";
      if (!map[key]) map[key] = { income: 0, expense: 0, count: 0 };
      map[key].count += 1;
      if (txn.type === "income") map[key].income += txn.amount || 0;
      else map[key].expense += txn.amount || 0;
    });
    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        ...data,
        net: data.income - data.expense,
      }))
      .sort((a, b) => b.income + b.expense - (a.income + a.expense));
  }, [transactions]);

  const topIncomeMonths = useMemo(() => {
    return [...(monthlyTrend.incomeData || [])]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [monthlyTrend]);

  const dailyChartData = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daily = {};
    for (let d = 1; d <= daysInMonth; d++) daily[d] = 0;

    transactions.forEach((txn) => {
      const date = new Date(txn.date);
      if (date.getMonth() === month && date.getFullYear() === year) {
        const day = date.getDate();
        daily[day] +=
          txn.type === "expense" ? -(txn.amount || 0) : txn.amount || 0;
      }
    });

    return Object.keys(daily).map((day) => ({
      day: String(day),
      amount: daily[day],
    }));
  }, [transactions]);

  return (
    <div className="space-y-8">
      <motion.header {...fadeInUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-3">
            Analytics
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Financial Analytics
          </h1>
          <p className="text-muted-foreground font-medium mt-2 max-w-2xl">
            Trends, category breakdown, and monthly performance across your
            accounts.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
            Back to overview
          </Link>
        </Button>
      </motion.header>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard
          label="All-time income"
          value={formatCurrency(totalIncome)}
          subtext={`This month ${formatCurrency(monthIncome)}`}
          icon="📈"
          accent="income"
        />
        <StatCard
          label="All-time expenses"
          value={formatCurrency(totalExpenses)}
          subtext={`This month ${formatCurrency(monthExpenses)}`}
          icon="📉"
          accent="expense"
        />
        <StatCard
          label="Net balance"
          value={formatCurrency(totalBalance)}
          subtext={`Savings rate ${savingsRate}%`}
          icon="💰"
          accent="balance"
        />
        <StatCard
          label="Month vs last month"
          value={`${incomeChange >= 0 ? "+" : ""}${incomeChange}% income`}
          subtext={`Expenses ${expenseChange >= 0 ? "+" : ""}${expenseChange}%`}
          icon="📊"
          accent="tasks"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart
          title="Monthly Income"
          data={monthlyTrend.incomeData || []}
          colorCode="#7cffcb"
          formatCurrency={formatCurrency}
        />
        <ExpenseChart
          title="Monthly Expenses"
          data={monthlyTrend.expenseData || []}
          colorCode="#ff6b4a"
          formatCurrency={formatCurrency}
        />
      </div>

      <DailyTransactionChart
        title="Net cash flow (this month)"
        data={dailyChartData}
        formatCurrency={formatCurrency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neo-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="size-5" />
            <h2 className="text-xl font-bold">By category</h2>
          </div>
          {categoryBreakdown.length === 0 ? (
            <p className="text-muted-foreground font-medium">
              No transaction data yet. Add transactions or import salary
              history.
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {categoryBreakdown.map((row) => (
                <div
                  key={row.name}
                  className="p-4 rounded-[14px] border-4 border-[var(--neo-black)] bg-muted/30"
                >
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <span className="font-bold">{row.name}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {row.count} txn
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
                    <span className="text-green-700">
                      +{formatCurrency(row.income)}
                    </span>
                    <span className="text-red-600">
                      -{formatCurrency(row.expense)}
                    </span>
                    <span
                      className={
                        row.net >= 0 ? "text-green-700" : "text-red-600"
                      }
                    >
                      {row.net >= 0 ? "+" : ""}
                      {formatCurrency(row.net)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="neo-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-5" />
            <h2 className="text-xl font-bold">Top income months</h2>
          </div>
          {topIncomeMonths.length === 0 ? (
            <p className="text-muted-foreground font-medium">
              Not enough history to rank months yet.
            </p>
          ) : (
            <ol className="space-y-4">
              {topIncomeMonths.map((row, index) => (
                <li
                  key={row.month}
                  className="flex items-center justify-between p-4 rounded-[14px] border-4 border-[var(--neo-black)] bg-accent/30"
                >
                  <span className="font-bold">
                    #{index + 1} {row.month}
                  </span>
                  <span className="text-lg font-bold text-green-700">
                    {formatCurrency(row.amount)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
