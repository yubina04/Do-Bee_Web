import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { CategoryManager } from './components/CategoryManager';
import { FilterBar } from './components/FilterBar';
import type { Task, Category, PriorityLevel } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    loadCategories();
    loadTasks();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading categories:', error);
      return;
    }

    if (data) {
      setCategories(data);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tasks:', error);
    } else if (data) {
      setTasks(data);
    }

    setLoading(false);
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
      return;
    }

    if (data) {
      setTasks([data, ...tasks]);
      setShowTaskForm(false);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;

    const { data, error } = await supabase
      .from('tasks')
      .update({ ...taskData, updated_at: new Date().toISOString() })
      .eq('id', editingTask.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
      return;
    }

    if (data) {
      setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
      setEditingTask(null);
      setShowTaskForm(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
      return;
    }

    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    if (data) {
      setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
    }
  };

  const handleAddCategory = async (name: string, color: string) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, color }])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
      return;
    }

    if (data) {
      setCategories([...categories, data]);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.completed) return false;
    if (selectedCategory !== 'all' && task.category_id !== selectedCategory) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>To-Do List</h1>
        <div className="header-actions">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="btn-secondary"
          >
            Manage Categories
          </button>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-primary"
          >
            + New Task
          </button>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pending:</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
      </div>

      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        selectedPriority={selectedPriority}
        showCompleted={showCompleted}
        onCategoryChange={setSelectedCategory}
        onPriorityChange={setSelectedPriority}
        onShowCompletedChange={setShowCompleted}
      />

      <main className="app-main">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </main>

      {showTaskForm && (
        <div className="modal-overlay" onClick={handleCancelForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <TaskForm
              task={editingTask}
              categories={categories}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  );
}

export default App;
