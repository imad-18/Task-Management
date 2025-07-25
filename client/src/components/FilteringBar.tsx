import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import { taskApi } from '../services/api';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'completed';
}

const FilteringBar = () => {
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

    return (
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
        </div>
    );
};

export default FilteringBar;