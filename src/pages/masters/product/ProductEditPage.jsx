import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
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

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    estimatedPrice: "",
    status: "active",
    attachment: "",
    attachmentPreview: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    AXIOS_INSTANCE.get(API_ENDPOINTS.CATEGORY.GET_ALL).then((res) => {
      setCategories(res.data?.data || []);
    });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await AXIOS_INSTANCE.get(
          API_ENDPOINTS.PRODUCT.GET_BY_ID(id)
        );
        const data = response.data?.data;
        if (data) {
          const categoryId =
            typeof data.category === "object"
              ? data.category?._id
              : data.category;

          setFormData({
            name: data.name || "",
            description: data.description || "",
            category: categoryId || "",
            estimatedPrice: data.estimatedPrice?.toString() ?? "",
            status: data.status || "active",
            attachment: data.attachment || "",
            attachmentPreview: "",
          });
        }
      } catch (err) {
        setError(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!formData.name.trim()) {
        throw new Error("Product name is required");
      }
      if (!formData.category) {
        throw new Error("Please select a category");
      }

      const response = await AXIOS_INSTANCE.put(
        API_ENDPOINTS.PRODUCT.UPDATE(id),
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          estimatedPrice: Number(formData.estimatedPrice) || 0,
          status: formData.status,
          attachment: formData.attachment || "",
        }
      );

      if (response.status === 200) {
        toast.success("Product updated successfully");
        navigate("/master/product");
      }
    } catch (err) {
      setError(err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 border-4 border-[var(--neo-black)] border-t-primary rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <FormPageLayout
        title="Edit Product"
        description="Update product and category link"
        breadcrumbs={
          <>
            <span>Master Data</span>
            <span className="text-foreground">›</span>
            <span>Products</span>
            <span className="text-foreground">›</span>
            <span className="text-foreground">Edit</span>
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
            disabled={saving}
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
                required
                disabled={saving}
              />
            </div>
            <CategorySelect
              value={formData.category}
              onChange={handleInputChange}
              disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
              rows={4}
              className="flex w-full rounded-[var(--neo-radius-sm)] border-4 border-[var(--neo-black)] bg-input-background px-4 py-3 text-sm font-medium shadow-[4px_4px_0_0_var(--neo-black)] resize-none focus-visible:outline-none focus-visible:shadow-[6px_6px_0_0_var(--neo-black)]"
              disabled={saving}
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-4 border-t-4 border-[var(--neo-black)]">
            <Button
              type="submit"
              disabled={saving || !formData.name.trim() || !formData.category}
            >
              {saving ? "Saving..." : "Save Changes"}
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

export default ProductEditPage;
