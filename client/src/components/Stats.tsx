import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import { taskApi } from '../services/api';

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


  return (
      <div className="max-w-4xl mx-auto">

        {/* Stats */}
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
  );
};

export default TaskManager;