import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Download, Upload, Trash2 } from 'lucide-react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import { Todo } from './types/todo';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todoData: Omit<Todo, 'id' | 'completed'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      completed: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setSearchQuery(''); // Clear search when editing
  };

  const updateTodo = (todoData: Omit<Todo, 'id' | 'completed'>) => {
    if (!editingTodo) return;
    
    setTodos(todos.map(todo =>
      todo.id === editingTodo.id
        ? { ...todo, ...todoData }
        : todo
    ));
    setEditingTodo(null);
  };

  const clearCompletedTasks = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    const query = searchQuery.toLowerCase();
    return (
      todo.title.toLowerCase().includes(query) ||
      (todo.description?.toLowerCase().includes(query) || '') ||
      todo.tags.some(tag => tag.toLowerCase().includes(query)) ||
      todo.priority.toLowerCase().includes(query)
    );
  });

  const completedPercentage = todos.length
    ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100)
    : 0;

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'todos.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTodos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTodos = JSON.parse(e.target?.result as string);
        setTodos(importedTodos);
      } catch (error) {
        console.error('Error importing todos:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Task Manager
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={clearCompletedTasks}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-red-400 hover:bg-gray-700' : 'bg-white text-red-600 hover:bg-gray-100'
              }`}
              title="Clear completed tasks"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-purple-400' : 'bg-white text-purple-600'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={exportTodos}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-purple-400' : 'bg-white text-purple-600'
              }`}
              title="Export todos"
            >
              <Download className="w-5 h-5" />
            </button>
            <label className={`p-2 rounded-lg cursor-pointer ${
              isDarkMode ? 'bg-gray-800 text-purple-400' : 'bg-white text-purple-600'
            }`}>
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept=".json"
                onChange={importTodos}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search tasks by title, description, tags, or priority..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-800 text-white placeholder-gray-400'
                : 'bg-white text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <Search className={`absolute left-3 top-2.5 w-5 h-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Progress
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {completedPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${completedPercentage}%` }}
            ></div>
          </div>
        </div>

        {!searchQuery && (editingTodo ? (
          <TodoForm onSubmit={updateTodo} initialData={editingTodo} />
        ) : (
          <TodoForm onSubmit={addTodo} />
        ))}

        <div className="space-y-4">
          {filteredTodos.length === 0 && searchQuery && (
            <p className="text-center text-gray-400 py-4">
              No tasks found matching "{searchQuery}"
            </p>
          )}
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;