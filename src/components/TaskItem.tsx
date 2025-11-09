import type { Task, Category } from '../types';

interface TaskItemProps {
  task: Task;
  category?: Category;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export function TaskItem({ task, category, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const priorityColors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = task.due_date && !task.completed && new Date(task.due_date) < new Date();

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggleComplete(task.id, e.target.checked)}
        />
      </div>

      <div className="task-content">
        <div className="task-header">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-badges">
            <span
              className="priority-badge"
              style={{ backgroundColor: priorityColors[task.priority] }}
            >
              {task.priority}
            </span>
            {category && (
              <span
                className="category-badge"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-footer">
          {task.due_date && (
            <span className={`task-due-date ${isOverdue ? 'overdue-text' : ''}`}>
              Due: {formatDate(task.due_date)}
            </span>
          )}
          <div className="task-actions">
            <button onClick={() => onEdit(task)} className="btn-icon" title="Edit task">
              ✏️
            </button>
            <button onClick={handleDelete} className="btn-icon" title="Delete task">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
