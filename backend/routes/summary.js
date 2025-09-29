const express = require('express');
const router = express.Router();
const database = require('../database/db');

// Helper function to get date range for week/month
function getDateRange(period) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (period === 'week') {
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  } else if (period === 'month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      start: startOfMonth.toISOString().split('T')[0],
      end: endOfMonth.toISOString().split('T')[0]
    };
  }
}

// GET /api/summary - Get weekly and monthly stats
router.get('/', async (req, res) => {
  try {
    const db = database.getDB();
    
    // Get total number of habits
    const totalHabitsQuery = 'SELECT COUNT(*) as total FROM habits';
    
    // Get weekly stats
    const weekRange = getDateRange('week');
    const weeklyStatsQuery = `
      SELECT 
        COUNT(DISTINCT h.id) as total_habits,
        COUNT(DISTINCT CASE WHEN c.status = 'done' THEN h.id END) as completed_habits,
        COUNT(CASE WHEN c.status = 'done' THEN 1 END) as total_completions,
        COUNT(CASE WHEN c.status = 'missed' THEN 1 END) as total_misses
      FROM habits h
      LEFT JOIN checkins c ON h.id = c.habit_id 
        AND c.date BETWEEN ? AND ?
    `;
    
    // Get monthly stats
    const monthRange = getDateRange('month');
    const monthlyStatsQuery = `
      SELECT 
        COUNT(DISTINCT h.id) as total_habits,
        COUNT(DISTINCT CASE WHEN c.status = 'done' THEN h.id END) as completed_habits,
        COUNT(CASE WHEN c.status = 'done' THEN 1 END) as total_completions,
        COUNT(CASE WHEN c.status = 'missed' THEN 1 END) as total_misses
      FROM habits h
      LEFT JOIN checkins c ON h.id = c.habit_id 
        AND c.date BETWEEN ? AND ?
    `;
    
    // Execute queries
    const totalHabits = await new Promise((resolve, reject) => {
      db.get(totalHabitsQuery, [], (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });
    
    const weeklyStats = await new Promise((resolve, reject) => {
      db.get(weeklyStatsQuery, [weekRange.start, weekRange.end], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    const monthlyStats = await new Promise((resolve, reject) => {
      db.get(monthlyStatsQuery, [monthRange.start, monthRange.end], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    res.json({
      totalHabits,
      weekly: {
        period: `${weekRange.start} to ${weekRange.end}`,
        totalHabits: weeklyStats.total_habits,
        completedHabits: weeklyStats.completed_habits,
        totalCompletions: weeklyStats.total_completions,
        totalMisses: weeklyStats.total_misses,
        completionRate: (weeklyStats.total_completions + weeklyStats.total_misses) > 0 
          ? Math.round((weeklyStats.total_completions / (weeklyStats.total_completions + weeklyStats.total_misses)) * 100) 
          : 0
      },
      monthly: {
        period: `${monthRange.start} to ${monthRange.end}`,
        totalHabits: monthlyStats.total_habits,
        completedHabits: monthlyStats.completed_habits,
        totalCompletions: monthlyStats.total_completions,
        totalMisses: monthlyStats.total_misses,
        completionRate: (monthlyStats.total_completions + monthlyStats.total_misses) > 0 
          ? Math.round((monthlyStats.total_completions / (monthlyStats.total_completions + monthlyStats.total_misses)) * 100) 
          : 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching summary stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch summary stats' });
  }
});

// GET /api/summary/habit/:habitId - Get stats for a specific habit
router.get('/habit/:habitId', (req, res) => {
  const habitId = req.params.habitId;
  
  if (!habitId || isNaN(habitId)) {
    return res.status(400).json({ error: 'Valid habit ID is required' });
  }

  const db = database.getDB();
  
  // Get weekly stats for specific habit
  const weekRange = getDateRange('week');
  const weeklyQuery = `
    SELECT 
      COUNT(*) as total_days,
      COUNT(CASE WHEN status = 'done' THEN 1 END) as completed_days,
      COUNT(CASE WHEN status = 'missed' THEN 1 END) as missed_days
    FROM checkins 
    WHERE habit_id = ? AND date BETWEEN ? AND ?
  `;
  
  // Get monthly stats for specific habit
  const monthRange = getDateRange('month');
  const monthlyQuery = `
    SELECT 
      COUNT(*) as total_days,
      COUNT(CASE WHEN status = 'done' THEN 1 END) as completed_days,
      COUNT(CASE WHEN status = 'missed' THEN 1 END) as missed_days
    FROM checkins 
    WHERE habit_id = ? AND date BETWEEN ? AND ?
  `;
  
  db.get(weeklyQuery, [habitId, weekRange.start, weekRange.end], (err, weeklyRow) => {
    if (err) {
      console.error('Error fetching weekly habit stats:', err.message);
      return res.status(500).json({ error: 'Failed to fetch weekly stats' });
    }
    
    db.get(monthlyQuery, [habitId, monthRange.start, monthRange.end], (err, monthlyRow) => {
      if (err) {
        console.error('Error fetching monthly habit stats:', err.message);
        return res.status(500).json({ error: 'Failed to fetch monthly stats' });
      }
      
      res.json({
        habitId: parseInt(habitId),
        weekly: {
          period: `${weekRange.start} to ${weekRange.end}`,
          totalDays: weeklyRow.total_days,
          completedDays: weeklyRow.completed_days,
          missedDays: weeklyRow.missed_days,
          completionRate: weeklyRow.total_days > 0 
            ? Math.round((weeklyRow.completed_days / weeklyRow.total_days) * 100) 
            : 0
        },
        monthly: {
          period: `${monthRange.start} to ${monthRange.end}`,
          totalDays: monthlyRow.total_days,
          completedDays: monthlyRow.completed_days,
          missedDays: monthlyRow.missed_days,
          completionRate: monthlyRow.total_days > 0 
            ? Math.round((monthlyRow.completed_days / monthlyRow.total_days) * 100) 
            : 0
        }
      });
    });
  });
});

module.exports = router;