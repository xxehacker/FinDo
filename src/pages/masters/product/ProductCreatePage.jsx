import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "@/utils/apiPath";
import { toast } from "react-toastify";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import { FormPageLayout } from "@/components/ui/form-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelect } from "@/components/masters/CategorySelect";
import FormCaptureToolbar from "@/components/capture/FormCaptureToolbar";

const selectClassName =
  "flex h-12 w-full rounded-[var(--neo-radius-sm)] border-4 border-[var(--neo-black)] bg-input-background px-4 text-sm font-bold shadow-[4px_4px_0_0_var(--neo-black)]";

const ProductCreatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    estimatedPrice: "",
    status: "active",
    attachment: "",
    attachmentPreview: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AXIOS_INSTANCE.get(API_ENDPOINTS.CATEGORY.GET_ALL).then((res) => {
      setCategories(res.data?.data || []);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!formData.name.trim()) {
        throw new Error("Product name is required");
      }
      if (!formData.category) {
        throw new Error("Please select a category");
      }

      const response = await AXIOS_INSTANCE.post(API_ENDPOINTS.PRODUCT.CREATE, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        estimatedPrice: Number(formData.estimatedPrice) || 0,
        status: formData.status,
        attachment: formData.attachment || "",
      });

      if (response.status === 201) {
        toast.success("Product created successfully");
        navigate("/master/product");
      }
    } catch (err) {
      setError(err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <FormPageLayout
        title="Create Product"
        description="Add a product linked to a master category"
        breadcrumbs={
          <>
            <span>Master Data</span>
            <span className="text-foreground">›</span>
            <span>Products</span>
            <span className="text-foreground">›</span>
            <span className="text-foreground">Create</span>
          </>
        }
        onBack={() => navigate("/master/product")}
        error={error?.response?.data?.message || error?.message}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormCaptureToolbar
            captureType="product"
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            disabled={loading}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. SSD Drive"
                required
                disabled={loading}
              />
            </div>
            <CategorySelect
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
            />
            <div className="space-y-2">
              <Label htmlFor="estimatedPrice">Estimated Price (₹)</Label>
              <Input
                id="estimatedPrice"
                name="estimatedPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedPrice}
                onChange={handleInputChange}
                placeholder="0"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={selectClassName}
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional details"
              rows={4}
              className="flex w-full rounded-[var(--neo-radius-sm)] border-4 border-[var(--neo-black)] bg-input-background px-4 py-3 text-sm font-medium shadow-[4px_4px_0_0_var(--neo-black)] resize-none focus-visible:outline-none focus-visible:shadow-[6px_6px_0_0_var(--neo-black)]"
              disabled={loading}
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-4 border-t-4 border-[var(--neo-black)]">
            <Button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.category}
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/master/product")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormPageLayout>
    </MainLayout>
  );
};

export default ProductCreatePage;
