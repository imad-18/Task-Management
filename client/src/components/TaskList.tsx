import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import { taskApi } from '../services/api';
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; description: string; status: Task['status'] }>({
    title: '',
    description: '',
    status: 'pending'
  });

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasks = await taskApi.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: Task['status']) => {
    const newStatus: Task['status'] = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await taskApi.updateTaskStatus(id, newStatus);
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: Task['status']) => {
    return status === 'completed' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Clock className="w-5 h-5 text-orange-500" />
    );
  };

  const getStatusBadge = (status: Task['status']) => {
    return status === 'completed' ? (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
        Terminée
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
        En attente
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des tâches...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">
            {tasks.length === 0
              ? "Aucune tâche trouvée. Créez votre première tâche !"
              : "Aucune tâche ne correspond à vos critères de recherche."
            }
          </p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${task.status === 'completed' ? 'opacity-75' : ''
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(task.status)}
                  <h3 className={`text-lg font-semibold ${task.status === 'completed'
                      ? 'text-gray-500 line-through'
                      : 'text-gray-800'
                    }`}>
                    {task.title}
                  </h3>
                  {getStatusBadge(task.status)}
                </div>
                <p className={`text-gray-600 ${task.status === 'completed' ? 'line-through' : ''
                  }`}>
                  {task.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleToggleStatus(task.id, task.status)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${task.status === 'completed'
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                >
                  {task.status === 'completed' ? 'Rouvrir' : 'Terminer'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;