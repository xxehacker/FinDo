import React from "react";
import { Master, MainLayout } from "@/components";

const dummyCategories = [];
const dummyBankAccounts = [];
const dummyProducts = [];

const dummyAddCategory = () => {};
const dummyUpdateCategory = () => {};
const dummyDeleteCategory = () => {};
const dummyAddBankAccount = () => {};
const dummyUpdateBankAccount = () => {};
const dummyDeleteBankAccount = () => {};
const dummyAddProduct = () => {};
const dummyUpdateProduct = () => {};
const dummyDeleteProduct = () => {};

const MasterPage = () => {
  const user = { role: "admin" };

  if (user?.role !== "admin") {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-foreground">
            Access Denied
          </h3>
          <p className="text-muted-foreground mt-2">
            Only admin users can access master data management.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <Master
      categories={dummyCategories}
      addCategory={dummyAddCategory}
      updateCategory={dummyUpdateCategory}
      deleteCategory={dummyDeleteCategory}
      bankAccounts={dummyBankAccounts}
      addBankAccount={dummyAddBankAccount}
      updateBankAccount={dummyUpdateBankAccount}
      deleteBankAccount={dummyDeleteBankAccount}
      products={dummyProducts}
      addProduct={dummyAddProduct}
      updateProduct={dummyUpdateProduct}
      deleteProduct={dummyDeleteProduct}
    />
  );
};

export default MasterPage;
