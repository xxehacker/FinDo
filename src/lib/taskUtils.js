/** Map API task document → UI shape */
export function mapTaskFromApi(task) {
  if (!task) return null;
  const status =
    task.status === "in_progress" ? "in_progress" : task.status || "pending";

  return {
    id: task._id,
    title: task.title,
    description: task.description || "",
    priority: task.difficulty || "medium",
    status,
    progress: task.progress ?? 0,
    dueDate: task.endDate
      ? new Date(task.endDate).toISOString().split("T")[0]
      : "",
    archived: Boolean(task.archived),
    subtasks: (task.subtasks || []).map((st, index) => ({
      id: st._id || `${task._id}-st-${index}`,
      title: st.name || st.title || "",
      completed: Boolean(st.isCompleted ?? st.completed),
    })),
    createdAt: task.createdAt,
  };
}

/** Map UI form → API payload */
export function mapTaskToApi(formData) {
  const status =
    formData.status === "inProgress" ? "in_progress" : formData.status;

  const due =
    formData.dueDate ||
    new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  return {
    title: formData.title?.trim(),
    description: formData.description?.trim() || "",
    difficulty: formData.priority || "medium",
    status: status || "pending",
    progress: parseInt(formData.progress, 10) || 0,
    startDate: new Date().toISOString(),
    endDate: due,
    archived: Boolean(formData.archived),
    subtasks: (formData.subtasks || [])
      .filter((st) => st.title?.trim())
      .map((st) => ({
        name: st.title.trim(),
        description: "",
        isCompleted: Boolean(st.completed),
      })),
  };
}

export function formatTaskStatus(status) {
  if (status === "in_progress" || status === "inProgress") return "In Progress";
  if (status === "completed") return "Completed";
  if (status === "pending") return "Pending";
  return status;
}
