import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";
import MainLayout from "../../../components/layouts/MainLayout";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { useNavigate } from "react-router-dom";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
} from "@/components/ui/data-table";
import { getCategoryName } from "@/components/masters/CategorySelect";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await AXIOS_INSTANCE.get(API_ENDPOINTS.PRODUCT.GET_ALL);
      const list = response.data?.data || [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter((p) => {
      const categoryName = getCategoryName(p.category)?.toLowerCase() || "";
      return (
        p.name?.toLowerCase().includes(term) ||
        (p.description?.toLowerCase() || "").includes(term) ||
        categoryName.includes(term)
      );
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const res = await AXIOS_INSTANCE.delete(
        API_ENDPOINTS.PRODUCT.DELETE(id)
      );
      if (res.status === 200) {
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  };

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Product Management"
          description="Track items you buy, plan for, or link to tasks"
          breadcrumbs={
            <>
              <span>Master Data</span>
              <span className="text-foreground">›</span>
              <span className="text-foreground">Products</span>
            </>
          }
          actions={
            <Button onClick={() => navigate("/master/product/create")}>
              + Add Product
            </Button>
          }
        />

        <div className="neo-card p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search name, category, or description"
              className="sm:max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          </div>
        </div>

        {error && <Alert variant="destructive">{error}</Alert>}

        <DataTable>
          <table className="w-full table-fixed min-w-[720px]">
            <DataTableHeader>
              <tr>
                <DataTableHead className="w-12">#</DataTableHead>
                <DataTableHead className="w-1/4">Product</DataTableHead>
                <DataTableHead>Category</DataTableHead>
                <DataTableHead className="w-28">Est. Price</DataTableHead>
                <DataTableHead className="w-24">Status</DataTableHead>
                <DataTableHead className="w-48">Actions</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="inline-block h-8 w-8 border-4 border-[var(--neo-black)] border-t-primary rounded-full animate-spin" />
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <DataTableRow key={product._id}>
                    <DataTableCell className="font-bold">
                      {index + 1}
                    </DataTableCell>
                    <DataTableCell>
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-[10px] border-4 border-[var(--neo-black)] bg-primary/30 flex items-center justify-center shadow-[2px_2px_0_0_var(--neo-black)]">
                          <Package size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {product.description || "—"}
                          </div>
                        </div>
                      </div>
                    </DataTableCell>
                    <DataTableCell>
                      {getCategoryName(product.category) ? (
                        <Badge variant="secondary">
                          {getCategoryName(product.category)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </DataTableCell>
                    <DataTableCell className="font-bold">
                      {formatPrice(product.estimatedPrice)}
                    </DataTableCell>
                    <DataTableCell>
                      <Badge
                        variant={
                          product.status === "active" ? "success" : "muted"
                        }
                      >
                        {product.status}
                      </Badge>
                    </DataTableCell>
                    <DataTableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/master/product/view/${product._id}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            navigate(`/master/product/edit/${product._id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </DataTableCell>
                  </DataTableRow>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center font-semibold text-muted-foreground"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </DataTableBody>
          </table>
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default ProductManagement;
