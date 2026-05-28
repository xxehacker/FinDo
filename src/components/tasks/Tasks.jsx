import React, { useState } from "react";
import FormCaptureToolbar from "@/components/capture/FormCaptureToolbar";
import { formatTaskStatus } from "@/lib/taskUtils";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const normalizeStatus = (status) =>
  status === "inProgress" ? "in_progress" : status;

const Tasks = ({
  tasks,
  loading = false,
  saving = false,
  showForm,
  setShowForm,
  editingTask,
  setEditingTask,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  formData,
  setFormData,
  addTask,
  updateTask,
  deleteTask,
  onArchiveTask,
  onRefresh,
  viewMode = "active",
  pageTitle = "Task Management",
  pageSubtitle = "Organize and track your tasks and productivity",
}) => {
  const [submitting, setSubmitting] = useState(false);
  const viewFilteredTasks = tasks.filter((task) => {
    if (viewMode === "archived") return task.archived === true;
    if (viewMode === "completed") {
      return (
        !task.archived &&
        (normalizeStatus(task.status) === "completed" ||
          task.status === "completed")
      );
    }
    return (
      !task.archived &&
      normalizeStatus(task.status) !== "completed" &&
      task.status !== "completed"
    );
  });

  const filteredTasks = viewFilteredTasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const normalized = normalizeStatus(task.status);
    const matchesStatus =
      filterStatus === "all" ||
      task.status === filterStatus ||
      normalized === filterStatus ||
      (filterStatus === "inProgress" && normalized === "in_progress");
    return matchesSearch && matchesStatus;
  });

  const activeTasks = tasks.filter((t) => !t.archived);

  const stats = {
    total: activeTasks.length,
    completed: activeTasks.filter(
      (t) => normalizeStatus(t.status) === "completed"
    ).length,
    inProgress: activeTasks.filter(
      (t) => normalizeStatus(t.status) === "in_progress"
    ).length,
    pending: activeTasks.filter((t) => normalizeStatus(t.status) === "pending")
      .length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dueDate) {
      alert("Please set a due date for the task.");
      return;
    }
    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      progress: parseInt(formData.progress, 10) || 0,
      dueDate: formData.dueDate,
      subtasks: formData.subtasks,
    };
    try {
      setSubmitting(true);
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        await addTask(taskData);
      }
      setShowForm(false);
    } catch {
      /* toast handled in page */
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const addSubtask = () => {
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, { title: "", completed: false }],
    });
  };

  const removeSubtask = (index) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter((_, i) => i !== index),
    });
  };

  const updateSubtask = (index, field, value) => {
    const newSubtasks = [...formData.subtasks];
    newSubtasks[index] = { ...newSubtasks[index], [field]: value };
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageSubtitle}</p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={loading || saving}
              title="Refresh tasks"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          )}
          {viewMode !== "archived" && (
            <Button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={loading || saving}
            >
              + Add Task
            </Button>
          )}
        </div>
      </div>
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(10,10,10,0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
              setEditingTask(null);
            }
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto neo-card flex flex-col"
            style={{
              animation: "taskModalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            {/* ── Coloured header strip ── */}
            <div
              className="flex items-center justify-between px-6 py-4 rounded-t-[20px]"
              style={{
                background: editingTask
                  ? "var(--secondary)"
                  : "var(--primary)",
                borderBottom: "3px solid var(--neo-black)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editingTask ? "✏️" : "➕"}</span>
                <h3
                  className="text-xl font-bold"
                  style={{ color: "var(--neo-black)" }}
                >
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-lg transition-all hover:scale-110 active:scale-95"
                style={{
                  background: "var(--neo-black)",
                  color: editingTask ? "var(--secondary)" : "var(--primary)",
                  border: "2px solid var(--neo-black)",
                }}
              >
                ×
              </button>
            </div>

            {/* ── Form body ── */}
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <FormCaptureToolbar
                captureType="task"
                formData={formData}
                setFormData={setFormData}
              />

              {/* Title */}
              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ color: "var(--card-foreground)" }}
                >
                  Title <span style={{ color: "var(--primary)" }}>*</span>
                </label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-[14px] font-medium transition-all focus:outline-none"
                  style={{
                    background: "var(--input-background)",
                    color: "var(--card-foreground)",
                    border: "2.5px solid var(--neo-black)",
                    boxShadow: "3px 3px 0 0 var(--neo-black)",
                  }}
                  placeholder="Task title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-bold mb-1"
                  style={{ color: "var(--card-foreground)" }}
                >
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-[14px] font-medium transition-all focus:outline-none resize-none"
                  style={{
                    background: "var(--input-background)",
                    color: "var(--card-foreground)",
                    border: "2.5px solid var(--neo-black)",
                    boxShadow: "3px 3px 0 0 var(--neo-black)",
                  }}
                  placeholder="Task description (optional)"
                  rows={3}
                />
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-bold mb-1"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-[14px] font-medium transition-all focus:outline-none"
                    style={{
                      background: "var(--input-background)",
                      color: "var(--card-foreground)",
                      border: "2.5px solid var(--neo-black)",
                      boxShadow: "3px 3px 0 0 var(--neo-black)",
                    }}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-bold mb-1"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-[14px] font-medium transition-all focus:outline-none"
                    style={{
                      background: "var(--input-background)",
                      color: "var(--card-foreground)",
                      border: "2.5px solid var(--neo-black)",
                      boxShadow: "3px 3px 0 0 var(--neo-black)",
                    }}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in_progress">🚀 In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
              </div>

              {/* Progress & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-bold mb-1"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progress: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-[14px] font-medium transition-all focus:outline-none"
                    style={{
                      background: "var(--input-background)",
                      color: "var(--card-foreground)",
                      border: "2.5px solid var(--neo-black)",
                      boxShadow: "3px 3px 0 0 var(--neo-black)",
                    }}
                  />
                  {/* Mini progress bar preview */}
                  <div
                    className="mt-2 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--muted)", border: "1.5px solid var(--neo-black)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(0, formData.progress))}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-bold mb-1"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Due Date <span style={{ color: "var(--primary)" }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-[14px] font-medium transition-all focus:outline-none"
                    style={{
                      background: "var(--input-background)",
                      color: "var(--card-foreground)",
                      border: "2.5px solid var(--neo-black)",
                      boxShadow: "3px 3px 0 0 var(--neo-black)",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <div
                  className="flex items-center justify-between mb-2 pb-2"
                  style={{ borderBottom: "2px solid var(--muted)" }}
                >
                  <label
                    className="text-sm font-bold"
                    style={{ color: "var(--card-foreground)" }}
                  >
                    Subtasks
                  </label>
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="text-sm font-bold px-3 py-1 rounded-[10px] transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "var(--accent)",
                      color: "var(--neo-black)",
                      border: "2px solid var(--neo-black)",
                      boxShadow: "2px 2px 0 0 var(--neo-black)",
                    }}
                  >
                    + Add Subtask
                  </button>
                </div>
                {formData.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={(e) =>
                        updateSubtask(index, "completed", e.target.checked)
                      }
                      className="h-4 w-4 rounded"
                      style={{ accentColor: "var(--primary)" }}
                    />
                    <input
                      value={subtask.title}
                      onChange={(e) =>
                        updateSubtask(index, "title", e.target.value)
                      }
                      className="flex-1 px-3 py-2 rounded-[10px] font-medium focus:outline-none"
                      style={{
                        background: "var(--input-background)",
                        color: "var(--card-foreground)",
                        border: "2px solid var(--neo-black)",
                        boxShadow: "2px 2px 0 0 var(--neo-black)",
                      }}
                      placeholder="Subtask title"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-[8px] transition-all hover:scale-110 active:scale-95"
                      style={{
                        background: "var(--destructive)",
                        border: "2px solid var(--neo-black)",
                        boxShadow: "2px 2px 0 0 var(--neo-black)",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div
                className="flex justify-end gap-3 pt-4"
                style={{ borderTop: "2.5px solid var(--muted)" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  className="px-5 py-2.5 rounded-[14px] font-bold transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "var(--muted)",
                    color: "var(--card-foreground)",
                    border: "2.5px solid var(--neo-black)",
                    boxShadow: "3px 3px 0 0 var(--neo-black)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || saving}
                  className="px-5 py-2.5 rounded-[14px] font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--primary)",
                    color: "var(--neo-black)",
                    border: "2.5px solid var(--neo-black)",
                    boxShadow: "3px 3px 0 0 var(--neo-black)",
                  }}
                >
                  {submitting || saving
                    ? "⏳ Saving…"
                    : editingTask
                      ? "✅ Update Task"
                      : "🚀 Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-blue-500 text-3xl">📋</span>
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold text-card-foreground">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-3xl">✅</span>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-yellow-500 text-3xl">⏳</span>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.inProgress}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-red-500 text-3xl">📌</span>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 neo-card">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-primary" />
          <p className="mt-4 text-muted-foreground font-medium">
            Loading tasks…
          </p>
        </div>
      ) : (
      <div className="space-y-4">
        {filteredTasks
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {viewMode === "completed" &&
                    onArchiveTask &&
                    !task.archived && (
                      <button
                        type="button"
                        onClick={() => onArchiveTask(task.id)}
                        className="text-xs font-bold px-2 py-1 rounded-lg border-2 border-[var(--neo-black)] bg-secondary hover:bg-muted"
                        title="Archive task"
                      >
                        Archive
                      </button>
                    )}
                  {viewMode !== "archived" && (
                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : normalizeStatus(task.status) === "in_progress"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {formatTaskStatus(task.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-card-foreground">
                      {task.progress}%
                    </span>
                  </div>
                </div>
              </div>
              {task.dueDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              {task.subtasks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Subtasks</p>
                  <div className="space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          readOnly
                          className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                        />
                        <span
                          className={`text-sm ${
                            subtask.completed
                              ? "text-muted-foreground line-through"
                              : "text-card-foreground"
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl">📋</span>
            <h3 className="mt-4 text-lg font-medium text-card-foreground">
              No tasks found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters."
                : viewMode === "completed"
                  ? "Complete tasks from Active Tasks, then archive them here."
                  : viewMode === "archived"
                    ? "Archive completed tasks to keep your active list clean."
                    : "Get started by adding your first task."}
            </p>
            {!searchTerm &&
              filterStatus === "all" &&
              viewMode === "active" && (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Add Task
                </button>
              )}
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Tasks;
