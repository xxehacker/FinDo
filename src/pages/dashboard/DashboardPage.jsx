import { Dashboard, MainLayout } from "@/components";

const DashboardPage = () => {
  const demoProps = {
    totalIncome: 5000,
    totalExpenses: 3200,
    totalBalance: 1800,
    completedTasks: 3,
    totalTasks: 5,
    userTransactions: [
      {
        id: 1,
        description: "Salary",
        category: "Income",
        amount: 3000,
        type: "income",
        date: "2025-08-01",
      },
      {
        id: 2,
        description: "Groceries",
        category: "Food",
        amount: 150,
        type: "expense",
        date: "2025-07-30",
      },
      {
        id: 3,
        description: "Freelance Work",
        category: "Income",
        amount: 1200,
        type: "income",
        date: "2025-07-28",
      },
      {
        id: 4,
        description: "Rent",
        category: "Housing",
        amount: 1000,
        type: "expense",
        date: "2025-07-25",
      },
      {
        id: 5,
        description: "Utilities",
        category: "Bills",
        amount: 200,
        type: "expense",
        date: "2025-07-20",
      },
    ],
    userTasks: [
      {
        id: 1,
        title: "Prepare Monthly Budget",
        priority: "high",
        progress: 80,
        dueDate: "2025-08-05",
        status: "in-progress",
      },
      {
        id: 2,
        title: "Complete Project Proposal",
        priority: "medium",
        progress: 50,
        dueDate: "2025-08-10",
        status: "in-progress",
      },
      {
        id: 3,
        title: "Pay Credit Card Bill",
        priority: "high",
        progress: 0,
        dueDate: "2025-08-03",
        status: "pending",
      },
      {
        id: 4,
        title: "Team Meeting",
        priority: "low",
        progress: 100,
        dueDate: "2025-07-30",
        status: "completed",
      },
      {
        id: 5,
        title: "Update Website",
        priority: "medium",
        progress: 20,
        dueDate: "2025-08-15",
        status: "in-progress",
      },
    ],
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
