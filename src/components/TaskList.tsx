import { TaskItem } from './TaskItem';
import type { Task, Category } from '../types';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export function TaskList({ tasks, categories, onEdit, onDelete, onToggleComplete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  const getCategoryById = (categoryId: string | null) => {
    if (!categoryId) return undefined;
    return categories.find((cat) => cat.id === categoryId);
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          category={getCategoryById(task.category_id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
