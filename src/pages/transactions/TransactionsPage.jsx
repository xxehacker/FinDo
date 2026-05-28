import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MainLayout, Transactions } from "@/components";

const routeConfig = {
  "/transactions/income": {
    initialFilterType: "income",
    lockTypeFilter: true,
    pageTitle: "Income Transactions",
    pageSubtitle: "All money received — salary, refunds, and other income",
  },
  "/transactions/expenses": {
    initialFilterType: "expense",
    lockTypeFilter: true,
    pageTitle: "Expense Transactions",
    pageSubtitle: "Track spending across categories and payment methods",
  },
};

const TransactionsPage = () => {
  const { pathname } = useLocation();

  const config = useMemo(
    () =>
      routeConfig[pathname] || {
        initialFilterType: "all",
        lockTypeFilter: false,
        pageTitle: "Transaction Management",
        pageSubtitle: "Track your income and expenses effortlessly",
      },
    [pathname]
  );

  return (
    <MainLayout>
      <Transactions {...config} />
    </MainLayout>
  );
};

export default TransactionsPage;
