import type { Category, PriorityLevel } from '../types';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  selectedPriority: PriorityLevel | 'all';
  showCompleted: boolean;
  onCategoryChange: (categoryId: string) => void;
  onPriorityChange: (priority: PriorityLevel | 'all') => void;
  onShowCompletedChange: (show: boolean) => void;
}

export function FilterBar({
  categories,
  selectedCategory,
  selectedPriority,
  showCompleted,
  onCategoryChange,
  onPriorityChange,
  onShowCompletedChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="filterCategory">Category:</label>
        <select
          id="filterCategory"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filterPriority">Priority:</label>
        <select
          id="filterPriority"
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value as PriorityLevel | 'all')}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => onShowCompletedChange(e.target.checked)}
          />
          Show Completed
        </label>
      </div>
    </div>
  );
}
