import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import { taskApi } from '../services/api';
import { FilteringBar, Header, Stats, TaskList } from './index';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

const TaskManager = () => {
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

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    try {
      const createdTask = await taskApi.createTask({
        title: newTask.title,
        description: newTask.description
      });
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '', status: 'pending' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header />

        {/* <FilteringBar/> */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes</option>
                <option value="pending">En attente</option>
                <option value="completed">Terminées</option>
              </select>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle tâche
            </button>
          </div>

        </div>
        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 mt-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ajouter une nouvelle tâche
            </h3>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateTask}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Créer
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Tasks List */}
        {/* <TaskList /> */}
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



        {/* Stats */}
        {/* <Stats /> */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Terminées</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;