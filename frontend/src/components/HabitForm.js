import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { validateHabitName } from '../utils/dateUtils';
import toast from 'react-hot-toast';

function HabitForm() {
  const { createHabit, loading } = useHabits();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const nameError = validateHabitName(formData.name);
    if (nameError) {
      setErrors({ name: nameError });
      return;
    }

    try {
      await createHabit({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      
      // Reset form
      setFormData({ name: '', description: '' });
      setErrors({});
      
      toast.success('Habit created successfully! 🎉');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create habit';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="card">
      <div className="mb-8">
        <h2 className="heading-md mb-4">
          Create New Habit
        </h2>
        <p className="body-base">
          Define a new habit to track and build into your daily routine.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="label-text mb-3 block">
            Habit Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`input-field ${errors.name ? 'border-danger-500 focus:ring-danger-500' : ''}`}
            placeholder="e.g., Read for 30 minutes daily"
            disabled={loading}
            maxLength={100}
          />
          {errors.name && (
            <p className="text-danger-600 text-sm mt-2">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="label-text mb-3 block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`input-field resize-none ${errors.description ? 'border-danger-500 focus:ring-danger-500' : ''}`}
            placeholder="Add context or motivation for this habit..."
            rows={4}
            disabled={loading}
            maxLength={500}
          />
          {errors.description && (
            <p className="text-danger-600 text-sm mt-2">{errors.description}</p>
          )}
        </div>

        {errors.submit && (
          <div className="bg-danger-50 border border-danger-200 p-4">
            <p className="text-danger-700 text-sm">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.name.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span>Creating Habit...</span>
            </div>
          ) : (
            'Create Habit'
          )}
        </button>
      </form>
    </div>
  );
}

export default HabitForm;