import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Tasks, MainLayout } from "@/components";
import { API_ENDPOINTS } from "@/utils/apiPath";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import { mapTaskFromApi, mapTaskToApi } from "@/lib/taskUtils";
import { toast } from "react-toastify";

const routeConfig = {
  "/tasks/completed": {
    viewMode: "completed",
    pageTitle: "Completed Tasks",
    pageSubtitle: "Finished work — archive tasks you no longer need active",
  },
  "/tasks/archived": {
    viewMode: "archived",
    pageTitle: "Archived Tasks",
    pageSubtitle: "Completed tasks moved out of your active workflow",
  },
};

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "pending",
  progress: 0,
  dueDate: "",
  subtasks: [],
};

const TasksPage = () => {
  const { pathname } = useLocation();
  const pageConfig = useMemo(
    () =>
      routeConfig[pathname] || {
        viewMode: "active",
        pageTitle: "Active Tasks",
        pageSubtitle: "Organize and track your tasks and productivity",
      },
    [pathname]
  );

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState(emptyForm);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.get(API_ENDPOINTS.TASK.GET_ALL);
      const list = response.data?.data;
      const mapped = Array.isArray(list)
        ? list.map(mapTaskFromApi).filter(Boolean)
        : [];
      setTasks(mapped);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      toast.error(
        err.response?.data?.message || "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (pageConfig.viewMode === "completed") {
      setFilterStatus("completed");
    } else if (pageConfig.viewMode === "active") {
      setFilterStatus("all");
    }
  }, [pageConfig.viewMode]);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        progress: editingTask.progress,
        dueDate: editingTask.dueDate || "",
        subtasks: editingTask.subtasks.map((st) => ({
          title: st.title,
          completed: st.completed,
        })),
      });
      setShowForm(true);
    } else if (!showForm) {
      setFormData(emptyForm);
    }
  }, [editingTask, showForm]);

  const addTask = async (taskData) => {
    try {
      setSaving(true);
      const payload = mapTaskToApi({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        progress: taskData.progress,
        dueDate: taskData.dueDate,
        subtasks: taskData.subtasks,
      });
      const response = await AXIOS_INSTANCE.post(
        API_ENDPOINTS.TASK.CREATE,
        payload
      );
      const created = mapTaskFromApi(response.data?.data);
      if (created) {
        setTasks((prev) => [created, ...prev]);
      }
      toast.success("Task created successfully");
      await fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error(err.response?.data?.message || "Failed to create task");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      setSaving(true);
      const payload = mapTaskToApi({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        progress: taskData.progress,
        dueDate: taskData.dueDate,
        subtasks: taskData.subtasks,
      });
      await AXIOS_INSTANCE.put(API_ENDPOINTS.TASK.UPDATE(id), payload);
      toast.success("Task updated successfully");
      await fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error(err.response?.data?.message || "Failed to update task");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setSaving(true);
      await AXIOS_INSTANCE.delete(API_ENDPOINTS.TASK.DELETE(id));
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error(err.response?.data?.message || "Failed to delete task");
    } finally {
      setSaving(false);
    }
  };

  const archiveTask = async (id) => {
    try {
      setSaving(true);
      await AXIOS_INSTANCE.put(API_ENDPOINTS.TASK.UPDATE(id), {
        archived: true,
        status: "completed",
      });
      toast.success("Task archived");
      await fetchTasks();
    } catch (err) {
      console.error("Error archiving task:", err);
      toast.error(err.response?.data?.message || "Failed to archive task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <Tasks
        tasks={tasks}
        loading={loading}
        saving={saving}
        showForm={showForm}
        setShowForm={setShowForm}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        formData={formData}
        setFormData={setFormData}
        addTask={addTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
        onArchiveTask={archiveTask}
        onRefresh={fetchTasks}
        viewMode={pageConfig.viewMode}
        pageTitle={pageConfig.pageTitle}
        pageSubtitle={pageConfig.pageSubtitle}
      />
    </MainLayout>
  );
};

export default TasksPage;
