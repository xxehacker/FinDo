import React from "react";
const Tasks = ({
  tasks,
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
  products,
  addTask,
  updateTask,
  deleteTask,
}) => {
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "inProgress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      progress: parseInt(formData.progress) || 0,
      dueDate: formData.dueDate || undefined,
      productId: formData.productId || undefined,
      subtasks: formData.subtasks.map((subtask, index) => ({
        id: `${Date.now()}-${index}`,
        title: subtask.title,
        completed: subtask.completed,
      })),
    };
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
    }
    setShowForm(false);
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
          <h1 className="text-3xl font-bold text-foreground">
            Task Management
          </h1>
          <p className="text-muted-foreground">
            Organize and track your tasks and productivity
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          ➕ Add Task
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  >
                    <option value="pending">Pending</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
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
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Related Product (Optional)
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="">None</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Subtasks</label>
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    + Add Subtask
                  </button>
                </div>
                {formData.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={(e) =>
                        updateSubtask(index, "completed", e.target.checked)
                      }
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <input
                      value={subtask.title}
                      onChange={(e) =>
                        updateSubtask(index, "title", e.target.value)
                      }
                      className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                      placeholder="Subtask title"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 text-muted-foreground hover:text-card-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingTask ? "Update" : "Add"} Task
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
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
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
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
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
                        : task.status === "inProgress"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {task.status}
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
              {task.productId && (
                <p className="text-sm text-muted-foreground mt-2">
                  Related Product:{" "}
                  {products.find((p) => p.id === task.productId)?.name ||
                    "Unknown"}
                </p>
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
                : "Get started by adding your first task."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Add Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
