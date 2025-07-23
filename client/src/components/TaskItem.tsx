import React from 'react';
import { CheckCircle, Clock, Trash2, RotateCcw } from 'lucide-react';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

interface TaskItemProps {
  task: Task;
  onStatusToggle: (id: number, currentStatus: 'pending' | 'completed') => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusToggle, onDelete }) => {
  const getStatusIcon = () => {
    return task.status === 'completed' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Clock className="w-5 h-5 text-orange-500" />
    );
  };

  const getStatusBadge = () => {
    return task.status === 'completed' ? (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
        Terminée
      </span>
    ) : (
      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
        En attente
      </span>
    );
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      onDelete(task.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-200 border-l-4 ${
        task.status === 'completed' 
          ? 'border-green-400 bg-gray-50' 
          : 'border-blue-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with icon, title, and status */}
          <div className="flex items-center gap-3 mb-3">
            {getStatusIcon()}
            <h3 className={`text-lg font-semibold ${
              task.status === 'completed' 
                ? 'text-gray-500 line-through' 
                : 'text-gray-800'
            }`}>
              {task.title}
            </h3>
            {getStatusBadge()}
          </div>

          {/* Description */}
          <p className={`text-gray-600 leading-relaxed ${
            task.status === 'completed' ? 'line-through opacity-75' : ''
          }`}>
            {task.description}
          </p>

          {/* Task ID (for debugging/reference) */}
          <div className="mt-3">
            <span className="text-xs text-gray-400">ID: {task.id}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onStatusToggle(task.id, task.status)}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              task.status === 'completed'
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            title={task.status === 'completed' ? 'Rouvrir la tâche' : 'Marquer comme terminée'}
          >
            {task.status === 'completed' ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Rouvrir
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Terminer
              </>
            )}
          </button>

          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer la tâche"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;