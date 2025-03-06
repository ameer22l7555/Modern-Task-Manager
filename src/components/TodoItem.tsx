import React from 'react';
import { Calendar, Clock, Tag, Trash2, Edit2, RotateCcw } from 'lucide-react';
import { Todo, Priority } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  isDarkMode: boolean;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-purple-300',
  medium: 'bg-purple-500',
  high: 'bg-purple-700'
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit, isDarkMode }: TodoItemProps) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-4 mb-3 border border-purple-500/20 hover:border-purple-500/40 transition-all ${
      todo.completed ? 'opacity-60' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="w-5 h-5 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
          />
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              todo.completed 
                ? 'line-through text-gray-400' 
                : isDarkMode 
                  ? 'text-white' 
                  : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-gray-400 text-sm mt-1">{todo.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {todo.dueDate && (
                <span className="inline-flex items-center text-xs text-purple-300">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
              {todo.recurring && (
                <span className="inline-flex items-center text-xs text-purple-300">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {todo.recurring}
                </span>
              )}
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              <span className={`inline-flex items-center text-xs px-2 py-1 rounded ${priorityColors[todo.priority]} text-white`}>
                <Clock className="w-3 h-3 mr-1" />
                {todo.priority}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 hover:bg-purple-900 rounded transition-colors"
          >
            <Edit2 className="w-5 h-5 text-purple-400" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1 hover:bg-purple-900 rounded transition-colors"
          >
            <Trash2 className="w-5 h-5 text-purple-400" />
          </button>
        </div>
      </div>
    </div>
  );
}