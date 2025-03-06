export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  tags: string[];
  recurring?: 'daily' | 'weekly' | 'monthly' | null;
}

export type Priority = Todo['priority'];