import React, { useState, useEffect } from 'react';
import { Tasks, MainLayout } from "@/components";

const TasksPage = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Complete Project Proposal',
      description: 'Draft and finalize the project proposal for client',
      priority: 'high',
      status: 'inProgress',
      progress: 60,
      dueDate: '2025-08-10',
      productId: '1',
      subtasks: [
        { id: '1-0', title: 'Research client needs', completed: true },
        { id: '1-1', title: 'Draft initial proposal', completed: false }
      ],
      createdAt: '2025-08-01'
    },
    {
      id: '2',
      title: 'Update Website',
      description: 'Revamp homepage design',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      dueDate: '2025-08-15',
      productId: '2',
      subtasks: [],
      createdAt: '2025-08-02'
    }
  ]);

  const [products] = useState([
    { id: '1', name: 'Project Management Tool' },
    { id: '2', name: 'Website Redesign' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    progress: 0,
    dueDate: '',
    productId: '',
    subtasks: []
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        progress: editingTask.progress,
        dueDate: editingTask.dueDate || '',
        productId: editingTask.productId || '',
        subtasks: editingTask.subtasks.map(st => ({ title: st.title, completed: st.completed }))
      });
      setShowForm(true);
    } else if (!showForm) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        progress: 0,
        dueDate: '',
        productId: '',
        subtasks: []
      });
    }
  }, [editingTask, showForm]);

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, taskData) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...taskData, id, createdAt: t.createdAt } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <MainLayout>
    <Tasks
      tasks={tasks}
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
      products={products}
      addTask={addTask}
      updateTask={updateTask}
      deleteTask={deleteTask}
    />
    </MainLayout>
  );
};

export default TasksPage;