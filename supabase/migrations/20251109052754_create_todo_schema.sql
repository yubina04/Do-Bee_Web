/*
  # Create To-Do List Application Schema

  ## Overview
  This migration sets up the complete database schema for a to-do list application with task categorization and prioritization features.

  ## New Tables
  
  ### 1. `categories` table
  Stores task categories (e.g., Work, Personal, Study)
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text, unique, not null) - Category name
  - `color` (text, not null) - Color code for visual display
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. `tasks` table
  Stores all tasks with their details
  - `id` (uuid, primary key) - Unique identifier for each task
  - `title` (text, not null) - Task title
  - `description` (text) - Optional task description
  - `due_date` (date) - When the task is due
  - `priority` (text, not null) - Priority level: 'high', 'medium', or 'low'
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `completed` (boolean, default false) - Task completion status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - RLS enabled on both tables
  - Public access policies for demo purposes (allows all users to manage all tasks)
  - In production, these should be restricted to authenticated users with proper ownership checks

  ## Indexes
  - Index on `tasks.category_id` for efficient category filtering
  - Index on `tasks.due_date` for date-based queries
  - Index on `tasks.priority` for priority filtering

  ## Default Data
  - Pre-populated with common categories: Work, Personal, Study, Health, Shopping
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  due_date date,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for categories table
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to categories"
  ON categories FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to categories"
  ON categories FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to categories"
  ON categories FOR DELETE
  TO public
  USING (true);

-- Create policies for tasks table
CREATE POLICY "Allow public read access to tasks"
  ON tasks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to tasks"
  ON tasks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to tasks"
  ON tasks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to tasks"
  ON tasks FOR DELETE
  TO public
  USING (true);

-- Insert default categories
INSERT INTO categories (name, color) VALUES
  ('Work', '#3B82F6'),
  ('Personal', '#10B981'),
  ('Study', '#8B5CF6'),
  ('Health', '#EF4444'),
  ('Shopping', '#F59E0B')
ON CONFLICT (name) DO NOTHING;