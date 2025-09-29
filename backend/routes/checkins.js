const express = require('express');
const router = express.Router();
const database = require('../database/db');

// GET /api/checkins/:habitId - Get check-ins for a specific habit
router.get('/:habitId', (req, res) => {
  const habitId = req.params.habitId;
  const { startDate, endDate } = req.query;
  
  if (!habitId || isNaN(habitId)) {
    return res.status(400).json({ error: 'Valid habit ID is required' });
  }

  const db = database.getDB();
  let query = 'SELECT * FROM checkins WHERE habit_id = ?';
  let params = [habitId];
  
  if (startDate && endDate) {
    query += ' AND date BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }
  
  query += ' ORDER BY date DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching check-ins:', err.message);
      return res.status(500).json({ error: 'Failed to fetch check-ins' });
    }
    res.json(rows);
  });
});

// POST /api/checkins/:habitId - Create or update a check-in
router.post('/:habitId', (req, res) => {
  const habitId = req.params.habitId;
  const { date, status } = req.body;
  
  if (!habitId || isNaN(habitId)) {
    return res.status(400).json({ error: 'Valid habit ID is required' });
  }
  
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  
  if (!status || !['done', 'missed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either "done" or "missed"' });
  }

  const db = database.getDB();
  
  // First check if habit exists
  db.get('SELECT id FROM habits WHERE id = ?', [habitId], (err, habitRow) => {
    if (err) {
      console.error('Error checking habit:', err.message);
      return res.status(500).json({ error: 'Failed to verify habit' });
    }
    
    if (!habitRow) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    // Use INSERT OR REPLACE to handle both create and update
    const query = `
      INSERT OR REPLACE INTO checkins (habit_id, date, status) 
      VALUES (?, ?, ?)
    `;
    
    db.run(query, [habitId, date, status], function(err) {
      if (err) {
        console.error('Error creating/updating check-in:', err.message);
        return res.status(500).json({ error: 'Failed to create/update check-in' });
      }
      
      res.status(201).json({
        id: this.lastID,
        habit_id: parseInt(habitId),
        date,
        status,
        created_at: new Date().toISOString()
      });
    });
  });
});

// DELETE /api/checkins/:habitId/:date - Delete a specific check-in
router.delete('/:habitId/:date', (req, res) => {
  const habitId = req.params.habitId;
  const date = req.params.date;
  
  if (!habitId || isNaN(habitId)) {
    return res.status(400).json({ error: 'Valid habit ID is required' });
  }
  
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const db = database.getDB();
  const query = 'DELETE FROM checkins WHERE habit_id = ? AND date = ?';
  
  db.run(query, [habitId, date], function(err) {
    if (err) {
      console.error('Error deleting check-in:', err.message);
      return res.status(500).json({ error: 'Failed to delete check-in' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Check-in not found' });
    }
    
    res.json({ message: 'Check-in deleted successfully' });
  });
});

// GET /api/checkins - Get all check-ins (for debugging/admin)
router.get('/', (req, res) => {
  const db = database.getDB();
  const query = `
    SELECT c.*, h.name as habit_name 
    FROM checkins c 
    JOIN habits h ON c.habit_id = h.id 
    ORDER BY c.date DESC, h.name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching all check-ins:', err.message);
      return res.status(500).json({ error: 'Failed to fetch check-ins' });
    }
    res.json(rows);
  });
});

module.exports = router;