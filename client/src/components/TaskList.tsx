import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, BarChart3 } from 'lucide-react';
import TaskItem, { Task } from './TaskItem';
import TaskForm from './TaskForm';
import { getTasks, createTask, deleteTask, updateTaskStatus } from '../services/api';

type FilterType = 'all' | 'pending' | 'completed';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Erreur lors du chargement des tâches');
    }
    setLoading(false);
  };

  const handleCreateTask = async (taskData: { title: string; description: string }) => {
    try {
      const response = await createTask(taskData);
      setTasks([...tasks, response.data]);
      setShowAddForm(false);
      setError(null);
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Erreur lors de la création de la tâche');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Erreur lors de la suppression de la tâche');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: 'pending' | 'completed') => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await updateTaskStatus(id, newStatus);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      ));
      setError(null);
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestionnaire de Tâches
          </h1>
          <p className="text-gray-600">
            Organisez et suivez vos tâches d'équipe efficacement
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm mt-1"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Toutes ({stats.total})</option>
                  <option value="pending">En attente ({stats.pending})</option>
                  <option value="completed">Terminées ({stats.completed})</option>
                </select>
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  showAddForm 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Plus className={`w-4 h-4 ${showAddForm ? 'rotate-45' : ''} transition-transform`} />
                {showAddForm ? 'Annuler' : 'Nouvelle tâche'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <TaskForm 
          isVisible={showAddForm}
          onSubmit={handleCreateTask}
          onCancel={() => setShowAddForm(false)}
        />

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des tâches...</p>
          </div>
        )}

        {/* Tasks List */}
        {!loading && (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  {tasks.length === 0 ? (
                    <BarChart3 className="w-16 h-16 mx-auto" />
                  ) : (
                    <Search className="w-16 h-16 mx-auto" />
                  )}
                </div>
                <p className="text-gray-500 text-lg">
                  {tasks.length === 0 
                    ? "Aucune tâche trouvée. Créez votre première tâche !" 
                    : "Aucune tâche ne correspond à vos critères de recherche."
                  }
                </p>
                {tasks.length === 0 && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Créer une tâche
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusToggle={handleToggleStatus}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        )}

        {/* Statistics */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Statistiques</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">En attente</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Terminées</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;