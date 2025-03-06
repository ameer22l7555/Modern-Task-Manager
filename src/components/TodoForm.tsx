import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Todo, Priority } from '../types/todo';
import FormField from './FormField';
import TagInput from './TagInput';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'completed'>) => void;
  initialData?: Todo;
}

export default function TodoForm({ onSubmit, initialData }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : ''
  );
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [recurring, setRecurring] = useState<Todo['recurring']>(initialData?.recurring || null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
      setPriority(initialData.priority);
      setTags(initialData.tags);
      setRecurring(initialData.recurring || null);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      tags,
      recurring
    });

    if (!initialData) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setTags([]);
      setRecurring(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 mb-6 border border-purple-500/20">
      <div className="space-y-4">
        <FormField label="Task Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </FormField>
        
        <FormField label="Description (Optional)">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about your task"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Due Date">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </FormField>

          <FormField label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </FormField>
        </div>

        <FormField label="Repeat Task">
          <select
            value={recurring || ''}
            onChange={(e) => setRecurring(e.target.value as Todo['recurring'] || null)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">No Repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </FormField>

        <FormField label="Tags">
          <TagInput tags={tags} onChange={setTags} />
        </FormField>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          {initialData ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}