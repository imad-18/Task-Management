import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: { title: string; description: string }) => void;
  onCancel: () => void;
  isVisible: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, isVisible }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const handleSubmit = () => {
    // Validation
    const newErrors: { title?: string; description?: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({ title: '', description: '' });
      setErrors({});
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '' });
    setErrors({});
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          Ajouter une nouvelle tâche
        </h3>
        <button
          onClick={handleCancel}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Entrez le titre de la tâche..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez la tâche en détail..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Créer la tâche
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 sm:flex-none px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;