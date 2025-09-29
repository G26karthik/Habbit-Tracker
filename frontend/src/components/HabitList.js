import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import toast from 'react-hot-toast';

function HabitList() {
  const { habits, deleteHabit, loading } = useHabits();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (habitId, habitName) => {
    if (!window.confirm(`Are you sure you want to delete "${habitName}"? This will also delete all check-in data for this habit.`)) {
      return;
    }

    try {
      setDeletingId(habitId);
      await deleteHabit(habitId);
      toast.success('Habit deleted successfully');
    } catch (error) {
      toast.error('Failed to delete habit');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && habits.length === 0) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-8 bg-primary-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-primary-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="card text-center">
        <div className="py-12">
          <div className="text-8xl mb-6">◯</div>
          <h3 className="heading-sm mb-4">
            No Habits Yet
          </h3>
          <p className="body-base">
            Create your first habit to begin tracking your progress 
            and building better routines.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-8">
        <h2 className="heading-md mb-4">
          Your Habits
        </h2>
        <p className="body-base">
          {habits.length} habit{habits.length !== 1 ? 's' : ''} currently tracked
        </p>
      </div>
      
      <div className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="fade-in bg-primary-50 border border-primary-100 p-6 hover:border-primary-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg font-medium text-primary-900 mb-2">
                  {habit.name}
                </h3>
                {habit.description && (
                  <p className="body-base text-primary-600 mb-3">
                    {habit.description}
                  </p>
                )}
                <p className="label-text text-primary-500">
                  Created {new Date(habit.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <button
                onClick={() => handleDelete(habit.id, habit.name)}
                disabled={deletingId === habit.id}
                className="ml-6 p-3 text-primary-400 hover:text-danger-600 hover:bg-danger-50 transition-all duration-300 disabled:opacity-50"
                title="Delete habit"
              >
                {deletingId === habit.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-danger-600"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HabitList;