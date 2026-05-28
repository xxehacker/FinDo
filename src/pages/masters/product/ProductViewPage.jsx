import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { getCategoryName } from "@/components/masters/CategorySelect";

const DetailField = ({ label, value }) => (
  <div className="space-y-2">
    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="rounded-[var(--neo-radius-sm)] border-4 border-[var(--neo-black)] bg-muted/40 px-4 py-3 text-sm font-semibold">
      {value ?? "—"}
    </p>
  </div>
);

const ProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await AXIOS_INSTANCE.get(
          API_ENDPOINTS.PRODUCT.GET_BY_ID(id)
        );
        if (response.data?.data) {
          setProduct(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 border-4 border-[var(--neo-black)] border-t-primary rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="space-y-4 max-w-lg">
          <Alert variant="destructive">
            {error || "Product not found"}
          </Alert>
          <Button variant="outline" onClick={() => navigate("/master/product")}>
            Back to list
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        <PageHeader
          title={product.name}
          description="Product details"
          breadcrumbs={
            <>
              <span>Master Data</span>
              <span className="text-foreground">›</span>
              <span>Products</span>
              <span className="text-foreground">›</span>
              <span className="text-foreground">View</span>
            </>
          }
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => navigate(`/master/product/edit/${id}`)}
              >
                Edit
              </Button>
              <Button variant="outline" onClick={() => navigate("/master/product")}>
                Back
              </Button>
            </>
          }
        />

        <div className="neo-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant={product.status === "active" ? "success" : "muted"}>
              {product.status}
            </Badge>
            {getCategoryName(product.category) && (
              <Badge variant="secondary">
                {getCategoryName(product.category)}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailField label="Product Name" value={product.name} />
            <DetailField
              label="Estimated Price"
              value={formatPrice(product.estimatedPrice)}
            />
            <DetailField
              label="Category"
              value={getCategoryName(product.category) || "—"}
            />
            <DetailField
              label="Created"
              value={
                product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : "—"
              }
            />
          </div>

          <DetailField label="Description" value={product.description || "—"} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductViewPage;
