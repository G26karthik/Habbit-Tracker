import { format, startOfWeek, addDays, isToday, isBefore, startOfDay } from 'date-fns';

/**
 * Get the current week's dates (Sunday to Saturday)
 * @param {Date} date - Base date (defaults to today)
 * @returns {Date[]} Array of 7 dates representing the week
 */
export function getWeekDates(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Start on Sunday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @param {string} formatString - Format pattern
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatString = 'yyyy-MM-dd') {
  return format(date, formatString);
}

/**
 * Get display name for a date (Today, Tomorrow, day name, etc.)
 * @param {Date} date - Date to get display name for
 * @returns {string} Display name
 */
export function getDateDisplayName(date) {
  if (isToday(date)) {
    return 'Today';
  }
  
  return format(date, 'EEE'); // Mon, Tue, etc.
}

/**
 * Check if a date is in the past (not including today)
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export function isPastDate(date) {
  const today = startOfDay(new Date());
  return isBefore(startOfDay(date), today);
}

/**
 * Get the status color class for a habit check-in
 * @param {string|null} status - 'done', 'missed', or null
 * @param {boolean} isPast - Whether the date is in the past
 * @returns {string} CSS class name
 */
export function getStatusColorClass(status, isPast = false) {
  if (status === 'done') {
    return 'habit-done';
  } else if (status === 'missed') {
    return 'habit-missed';
  } else {
    return 'habit-empty';
  }
}

/**
 * Get completion percentage
 * @param {number} completed - Number of completed items
 * @param {number} total - Total number of items
 * @returns {number} Percentage (0-100)
 */
export function getCompletionPercentage(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get week date range as string
 * @param {Date} date - Base date
 * @returns {string} Date range string
 */
export function getWeekRange(date = new Date()) {
  const weekDates = getWeekDates(date);
  const start = format(weekDates[0], 'MMM d');
  const end = format(weekDates[6], 'MMM d, yyyy');
  return `${start} - ${end}`;
}

/**
 * Generate a unique key for habit-date combination
 * @param {number} habitId - Habit ID
 * @param {Date|string} date - Date
 * @returns {string} Unique key
 */
export function getCheckinKey(habitId, date) {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  return `${habitId}-${dateStr}`;
}

/**
 * Validate habit name
 * @param {string} name - Habit name to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateHabitName(name) {
  if (!name || name.trim() === '') {
    return 'Habit name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Habit name must be at least 2 characters long';
  }
  
  if (name.trim().length > 100) {
    return 'Habit name must be less than 100 characters';
  }
  
  return null;
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}