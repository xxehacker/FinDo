import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "@/utils/apiPath";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import { Label } from "@/components/ui/label";

const selectClassName =
  "flex h-12 w-full rounded-[var(--neo-radius-sm)] border-4 border-[var(--neo-black)] bg-input-background px-4 text-sm font-bold shadow-[4px_4px_0_0_var(--neo-black)] disabled:opacity-50";

function CategorySelect({
  value,
  onChange,
  disabled = false,
  required = true,
  id = "category",
  activeOnly = true,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AXIOS_INSTANCE.get(
          API_ENDPOINTS.CATEGORY.GET_ALL
        );
        let list = response.data?.data || [];
        if (activeOnly) {
          list = list.filter((c) => c.status === "active");
          if (value && !list.some((c) => c._id === value)) {
            const current = (response.data?.data || []).find(
              (c) => c._id === value
            );
            if (current) list = [current, ...list];
          }
        }
        setCategories(list);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [value, activeOnly]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        Category {required && <span className="text-destructive">*</span>}
      </Label>
      <select
        id={id}
        name="category"
        value={value}
        onChange={onChange}
        className={selectClassName}
        disabled={disabled || loading}
        required={required}
      >
        <option value="">
          {loading ? "Loading categories..." : "Select a category"}
        </option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      {!loading && categories.length === 0 && (
        <p className="text-sm font-medium text-muted-foreground">
          No active categories.{" "}
          <Link
            to="/master/category/create"
            className="text-foreground font-bold underline underline-offset-2"
          >
            Create one first
          </Link>
        </p>
      )}
    </div>
  );
}

/** Display name from populated category object or legacy string */
function getCategoryName(category) {
  if (!category) return null;
  if (typeof category === "object" && category.name) return category.name;
  if (typeof category === "string") return category;
  return null;
}

export { CategorySelect, getCategoryName };
