/** Get income/expense type from a category id in the loaded list */
export function getTypeForCategory(categories, categoryId) {
  if (!categoryId || !categories?.length) return null;
  const cat = categories.find((c) => c._id === categoryId);
  return cat?.type || null;
}

export function formatCategoryOptionLabel(category) {
  const typeLabel =
    category.type === "income" ? "Income" : "Expense";
  return `${category.name} (${typeLabel})`;
}
