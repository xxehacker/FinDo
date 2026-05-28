import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ExpenseChart } from "./ExpenseChart";
import { DailyTransactionChart } from "./DailyTransactionChart";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const Dashboard = ({
  totalIncome = 0,
  totalExpenses = 0,
  totalBalance = 0,
  monthIncome = 0,
  monthExpenses = 0,
  incomeCount = 0,
  completedTasks = 0,
  totalTasks = 0,
  incomeChange = 0,
  expenseChange = 0,
  monthlyTrend = { incomeData: [], expenseData: [] },
  userTransactions = [],
  userTasks = [],
  formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`,
  setShowTransactionForm = () => {},
  setShowTaskForm = () => {},
}) => {
  const recentTransactions = userTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const upcomingTasks = userTasks
    .filter((t) => t.dueDate && t.status !== "completed")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const monthlyChartData = useMemo(() => {
    const incomeData = monthlyTrend?.incomeData ?? [];
    const expenseData = monthlyTrend?.expenseData ?? [];
    if (incomeData.length > 0 || expenseData.length > 0) {
      return { incomeData, expenseData };
    }

    const monthlyData = {};
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthKey = date.toLocaleString("en-US", { month: "long" });
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    userTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const monthKey = transactionDate.toLocaleString("en-US", {
        month: "long",
      });

      if (monthlyData[monthKey]) {
        if (transaction.type === "income") {
          monthlyData[monthKey].income += transaction.amount;
        } else if (transaction.type === "expense") {
          monthlyData[monthKey].expense += transaction.amount;
        }
      }
    });

    return {
      incomeData: Object.keys(monthlyData).map((month) => ({
        month,
        amount: monthlyData[month].income,
      })),
      expenseData: Object.keys(monthlyData).map((month) => ({
        month,
        amount: monthlyData[month].expense,
      })),
    };
  }, [monthlyTrend, userTransactions]);

  const dailyChartData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dailyData = {};
    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = 0;
    }

    userTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        const day = transactionDate.getDate();
        const signed =
          transaction.type === "expense"
            ? -transaction.amount
            : transaction.amount;
        dailyData[day] += signed;
      }
    });

    return Object.keys(dailyData).map((day) => ({
      day: day.toString(),
      amount: dailyData[day],
    }));
  }, [userTransactions]);

  const priorityVariant = (priority) => {
    if (priority === "high") return "destructive";
    if (priority === "medium") return "secondary";
    return "accent";
  };

  return (
    <div className="space-y-8">
      <motion.header {...fadeInUp}>
        <Badge variant="secondary" className="mb-4">
          Dashboard
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Welcome back, Mridupawan! 👋
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl">
          Here&apos;s what&apos;s happening with your finances and tasks today.
        </p>
      </motion.header>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
      >
        <StatCard
          label="Total Balance"
          value={formatCurrency(totalBalance)}
          subtext={`This month: ${formatCurrency(monthIncome - monthExpenses)}`}
          icon="💰"
          accent="balance"
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          subtext={`${incomeCount} income · this month ${formatCurrency(monthIncome)}${incomeChange !== 0 ? ` (${incomeChange > 0 ? "+" : ""}${incomeChange}% vs last month)` : ""}`}
          icon="📈"
          accent="income"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          subtext={`This month: ${formatCurrency(monthExpenses)}${expenseChange !== 0 ? ` (${expenseChange > 0 ? "+" : ""}${expenseChange}% vs last month)` : ""}`}
          icon="📉"
          accent="expense"
        />
        <StatCard
          label="Task Progress"
          value={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`}
          subtext={`${completedTasks} of ${totalTasks} completed`}
          icon="✅"
          accent="tasks"
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart
          title="Monthly Income"
          data={monthlyChartData.incomeData}
          colorCode="#7cffcb"
          formatCurrency={formatCurrency}
        />
        <ExpenseChart
          title="Monthly Expenses"
          data={monthlyChartData.expenseData}
          colorCode="#ff6b4a"
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="grid grid-cols-1">
        <DailyTransactionChart
          title="Daily Transactions"
          data={dailyChartData}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="neo-card p-6 sm:p-8">
        <h3 className="text-xl font-bold text-foreground mb-5">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="default"
            className="h-28 flex-col gap-2 text-base"
            onClick={() => setShowTransactionForm(true)}
          >
            <span className="text-2xl">💵</span>
            Add Income
          </Button>
          <Button
            variant="secondary"
            className="h-28 flex-col gap-2 text-base"
            onClick={() => setShowTransactionForm(true)}
          >
            <span className="text-2xl">💸</span>
            Add Expense
          </Button>
          <Button
            variant="accent"
            className="h-28 flex-col gap-2 text-base"
            onClick={() => setShowTaskForm(true)}
          >
            <span className="text-2xl">📝</span>
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="neo-card p-6 sm:p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-[14px] border-4 border-[var(--neo-black)] bg-muted/40 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-3 w-3 shrink-0 rounded-full border-2 border-[var(--neo-black)] ${
                      transaction.type === "income"
                        ? "bg-accent"
                        : "bg-destructive"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">
                      {transaction.description}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-accent-foreground"
                        : "text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <EmptyState
                icon="📊"
                title="No transactions yet"
                description="Start tracking your money flow."
                actionLabel="Add transaction"
                onAction={() => setShowTransactionForm(true)}
              />
            )}
          </div>
        </div>

        <div className="neo-card p-6 sm:p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-[14px] border-4 border-[var(--neo-black)] bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="font-bold text-foreground">{task.title}</h4>
                  <Badge variant={priorityVariant(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 h-3 rounded-full border-2 border-[var(--neo-black)] bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">
                      {task.progress}%
                    </span>
                  </div>
                  {task.dueDate && (
                    <span className="text-sm font-semibold text-muted-foreground shrink-0">
                      Due {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <EmptyState
                icon="✅"
                title="No upcoming tasks"
                description="You're all caught up for now."
                actionLabel="Create task"
                onAction={() => setShowTaskForm(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
