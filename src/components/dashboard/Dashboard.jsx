import React from "react";
import { ExpenseChart } from "./ExpenseChart";
import { DailyTransactionChart } from "./DailyTransactionChart";
import { expenseData, incomeData, demoDailyData } from "@/data/MockData";

const Dashboard = ({
  totalIncome = 0,
  totalExpenses = 0,
  totalBalance = 0,
  completedTasks = 0,
  totalTasks = 0,
  userTransactions = [],
  userTasks = [],
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Welcome back, Mridupawan!👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's what's happening with your finances and tasks today.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Balance
              </p>
              <p className="text-3xl font-bold text-card-foreground mt-1">
                ${totalBalance.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {totalBalance > 0
                  ? `+${(
                      ((totalIncome - totalExpenses) / totalBalance) *
                      100
                    ).toFixed(1)}% this month`
                  : "0% this month"}
              </p>
            </div>
            <div className="h-14 w-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-2xl">
                💰
              </span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Income
              </p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${totalIncome.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {recentTransactions.filter((t) => t.type === "income").length}{" "}
                transactions
              </p>
            </div>
            <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-2xl">
                📈
              </span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                ${totalExpenses.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {recentTransactions.filter((t) => t.type === "expense").length}{" "}
                transactions
              </p>
            </div>
            <div className="h-14 w-14 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-2xl">
                📉
              </span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Task Progress
              </p>
              <p className="text-3xl font-bold text-card-foreground mt-1">
                {totalTasks > 0
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {completedTasks} of {totalTasks} completed
              </p>
            </div>
            <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-2xl">
                ✅
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart
          title="Monthly Income"
          data={incomeData}
          colorCode="#4CAF50"
        />
        <ExpenseChart
          title="Monthly Expenses"
          data={expenseData}
          colorCode="#ef4444"
        />
      </div>
      <div className="grid grid-cols-1">
        <DailyTransactionChart title="Daily Transactions" data={demoDailyData} />
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-card-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="h-24 flex flex-col items-center justify-center space-y-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="text-2xl">💵</span>
            <span className="text-sm font-medium">Add Income</span>
          </button>
          <button
            onClick={() => setShowTransactionForm(true)}
            className="h-24 flex flex-col items-center justify-center space-y-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
          >
            <span className="text-2xl">💸</span>
            <span className="text-sm font-medium">Add Expense</span>
          </button>
          <button
            onClick={() => setShowTaskForm(true)}
            className="h-24 flex flex-col items-center justify-center space-y-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
          >
            <span className="text-2xl">📝</span>
            <span className="text-sm font-medium">New Task</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-card-foreground">
              Recent Transactions
            </h3>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-card-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl">📊</span>
                <p className="text-muted-foreground mt-2">
                  No transactions yet
                </p>
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="mt-3 text-primary hover:underline font-medium"
                >
                  Add your first transaction
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-card-foreground">
              Upcoming Tasks
            </h3>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-card-foreground">
                    {task.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {task.progress}%
                    </span>
                  </div>
                  {task.dueDate && (
                    <span className="text-sm text-muted-foreground">
                      Due: {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl">✅</span>
                <p className="text-muted-foreground mt-2">No upcoming tasks</p>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="mt-3 text-primary hover:underline font-medium"
                >
                  Create your first task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
