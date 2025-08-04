import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";

const Master = ({
  categories = [],
  addCategory = () => {},
  updateCategory = () => {},
  deleteCategory = () => {},
  bankAccounts = [],
  addBankAccount = () => {},
  updateBankAccount = () => {},
  deleteBankAccount = () => {},
  products = [],
  addProduct = () => {},
  updateProduct = () => {},
  deleteProduct = () => {},
}) => {
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "expense",
    color: "#000000",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [accountForm, setAccountForm] = useState({
    name: "",
    type: "bank",
    balance: "",
  });
  const [editingAccount, setEditingAccount] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    estimatedPrice: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
      setEditingCategory(null);
    } else {
      addCategory(categoryForm);
    }
    setCategoryForm({ name: "", type: "expense", color: "#000000" });
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    const accountData = {
      ...accountForm,
      balance: parseFloat(accountForm.balance) || 0,
    };
    if (editingAccount) {
      updateBankAccount(editingAccount.id, accountData);
      setEditingAccount(null);
    } else {
      addBankAccount(accountData);
    }
    setAccountForm({ name: "", type: "bank", balance: "" });
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...productForm,
      estimatedPrice: parseFloat(productForm.estimatedPrice) || 0,
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }
    setProductForm({
      name: "",
      description: "",
      category: "",
      estimatedPrice: "",
    });
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      type: category.type,
      color: category.color,
    });
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setAccountForm({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      estimatedPrice: product.estimatedPrice.toString(),
    });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id);
    }
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      deleteBankAccount(id);
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-foreground">
          Master Data Management
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Categories
            </h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <input
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={categoryForm.type}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, type: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, color: e.target.value })
                  }
                  className="w-full h-10 bg-input-background border border-border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-3">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({
                        name: "",
                        type: "expense",
                        color: "#000000",
                      });
                    }}
                    className="px-4 py-2 text-muted-foreground hover:text-card-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingCategory ? "Update" : "Add"} Category
                </button>
              </div>
            </form>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-card-foreground">
                      {category.name} ({category.type})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Bank Accounts Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Bank Accounts
            </h2>
            <form onSubmit={handleAccountSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Name
                </label>
                <input
                  value={accountForm.name}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Account name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={accountForm.type}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, type: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="bank">Bank</option>
                  <option value="wallet">Wallet</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={accountForm.balance}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, balance: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                {editingAccount && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAccount(null);
                      setAccountForm({ name: "", type: "bank", balance: "" });
                    }}
                    className="px-4 py-2 text-muted-foreground hover:text-card-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingAccount ? "Update" : "Add"} Account
                </button>
              </div>
            </form>
            <div className="space-y-2">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div>
                    <span className="text-sm text-card-foreground">
                      {account.name} ({account.type})
                    </span>
                    <p className="text-sm text-muted-foreground">
                      ${account.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditAccount(account)}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Products Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Products
            </h2>
            <form onSubmit={handleProductSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <input
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Product category"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Estimated Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.estimatedPrice}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      estimatedPrice: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        description: "",
                        category: "",
                        estimatedPrice: "",
                      });
                    }}
                    className="px-4 py-2 text-muted-foreground hover:text-card-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div>
                    <span className="text-sm text-card-foreground">
                      {product.name}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {product.category} - $
                      {product.estimatedPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Master;
