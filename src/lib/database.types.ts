export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          due_date: string | null
          priority: 'high' | 'medium' | 'low'
          category_id: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          due_date?: string | null
          priority?: 'high' | 'medium' | 'low'
          category_id?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          due_date?: string | null
          priority?: 'high' | 'medium' | 'low'
          category_id?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
