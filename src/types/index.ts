export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  priority: 'high' | 'medium' | 'low';
  category_id: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type PriorityLevel = 'high' | 'medium' | 'low';
