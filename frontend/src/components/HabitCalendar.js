import React, { useEffect, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  getWeekDates, 
  formatDate, 
  getDateDisplayName, 
  getStatusColorClass,
  getWeekRange,
  getCheckinKey,
  isPastDate
} from '../utils/dateUtils';
import toast from 'react-hot-toast';

function HabitCalendar() {
  const { habits, checkins, fetchCheckinsForHabit, updateCheckin } = useHabits();
  
  const weekDates = useMemo(() => getWeekDates(), []);
  const weekRange = useMemo(() => getWeekRange(), []);

  // Fetch check-ins for all habits for the current week
  useEffect(() => {
    if (habits.length > 0) {
      const startDate = formatDate(weekDates[0]);
      const endDate = formatDate(weekDates[6]);
      
      habits.forEach(habit => {
        fetchCheckinsForHabit(habit.id, startDate, endDate);
      });
    }
  }, [habits, weekDates, fetchCheckinsForHabit]);

  const handleCheckinClick = async (habit, date) => {
    const dateStr = formatDate(date);
    const key = getCheckinKey(habit.id, dateStr);
    const currentStatus = checkins[key];
    
    // Cycle through statuses: null -> 'done' -> 'missed' -> null
    let newStatus;
    if (currentStatus === 'done') {
      newStatus = 'missed';
    } else if (currentStatus === 'missed') {
      newStatus = null;
    } else {
      newStatus = 'done';
    }

    try {
      if (newStatus) {
        await updateCheckin(habit.id, dateStr, newStatus);
        toast.success(
          newStatus === 'done' 
            ? `✅ Marked "${habit.name}" as done!` 
            : `❌ Marked "${habit.name}" as missed`
        );
      } else {
        // For deleting, we would need a delete API call
        // For now, let's keep it simple and not allow deletion
        await updateCheckin(habit.id, dateStr, 'done');
      }
    } catch (error) {
      toast.error('Failed to update habit status');
    }
  };

  const getCheckinStatus = (habitId, date) => {
    const key = getCheckinKey(habitId, formatDate(date));
    return checkins[key] || null;
  };

  if (habits.length === 0) {
    return (
      <div className="card text-center">
        <div className="py-16">
          <div className="text-8xl mb-8">◯</div>
          <h3 className="heading-sm mb-4">
            Weekly Calendar
          </h3>
          <p className="body-lg text-primary-600">
            Create habits to visualize your weekly progress 
            with an elegant calendar interface.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-12">
        <div className="text-center">
          <div className="label-text text-primary-500 mb-2">
            {weekRange}
          </div>
          <h2 className="heading-lg">
            Weekly Progress
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header with days */}
          <div className="grid grid-cols-8 gap-3 mb-8 pb-4 border-b border-primary-200">
            <div className="label-text text-primary-700 p-3">
              HABIT
            </div>
            {weekDates.map((date) => (
              <div key={formatDate(date)} className="text-center">
                <div className="label-text text-primary-700 mb-1">
                  {getDateDisplayName(date)}
                </div>
                <div className="text-sm text-primary-500">
                  {formatDate(date, 'MMM d')}
                </div>
              </div>
            ))}
          </div>

          {/* Habits and their check-ins */}
          <div className="space-y-6">
            {habits.map((habit) => (
              <div key={habit.id} className="fade-in">
                <div className="grid grid-cols-8 gap-3 items-center">
                  {/* Habit name */}
                  <div className="p-4 bg-primary-50 border border-primary-100">
                    <h3 className="font-serif text-base font-medium text-primary-900 truncate" title={habit.name}>
                      {habit.name}
                    </h3>
                  </div>

                  {/* Check-in buttons for each day */}
                  {weekDates.map((date) => {
                    const status = getCheckinStatus(habit.id, date);
                    const isPast = isPastDate(date);
                    const colorClass = getStatusColorClass(status, isPast);
                    
                    return (
                      <button
                        key={formatDate(date)}
                        onClick={() => handleCheckinClick(habit, date)}
                        className={`
                          w-full h-14 border-2 transition-all duration-300 text-base font-medium
                          hover:scale-105 active:scale-95 hover:shadow-lg
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                          ${colorClass}
                        `}
                        title={`${habit.name} - ${formatDate(date, 'MMM d')}: ${
                          status === 'done' ? 'Done' : 
                          status === 'missed' ? 'Missed' : 
                          'Not tracked'
                        }`}
                      >
                        {status === 'done' && '✓'}
                        {status === 'missed' && '✗'}
                        {!status && '○'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 pt-8 border-t border-primary-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 habit-done flex items-center justify-center text-white text-lg">
              ✓
            </div>
            <div className="label-text text-primary-700 mb-1">COMPLETED</div>
            <p className="text-sm text-primary-500">Habit successfully completed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 habit-missed flex items-center justify-center text-white text-lg">
              ✗
            </div>
            <div className="label-text text-primary-700 mb-1">MISSED</div>
            <p className="text-sm text-primary-500">Habit not completed this day</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 habit-empty flex items-center justify-center text-lg">
              ○
            </div>
            <div className="label-text text-primary-700 mb-1">NOT TRACKED</div>
            <p className="text-sm text-primary-500">No status recorded yet</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="body-base text-primary-600">
            Click any day to cycle through: Not tracked → Completed → Missed
          </p>
        </div>
      </div>
    </div>
  );
}

export default HabitCalendar;