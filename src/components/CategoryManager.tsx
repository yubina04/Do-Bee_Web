import { useState } from 'react';
import type { Category } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string, color: string) => void;
  onClose: () => void;
}

export function CategoryManager({ categories, onAddCategory, onClose }: CategoryManagerProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [error, setError] = useState('');

  const predefinedColors = [
    '#3B82F6',
    '#10B981',
    '#8B5CF6',
    '#EF4444',
    '#F59E0B',
    '#EC4899',
    '#06B6D4',
    '#6366F1',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    if (categories.some((cat) => cat.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Category name already exists');
      return;
    }

    onAddCategory(name.trim(), color);
    setName('');
    setColor('#3B82F6');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Manage Categories</h3>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="category-form">
            <h4>Add New Category</h4>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="categoryName">Category Name</label>
              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Exercise, Projects"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <div className="color-picker">
                {predefinedColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className={`color-option ${color === presetColor ? 'selected' : ''}`}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => setColor(presetColor)}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Add Category
            </button>
          </form>

          <div className="category-list">
            <h4>Existing Categories</h4>
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <span
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="category-name">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
