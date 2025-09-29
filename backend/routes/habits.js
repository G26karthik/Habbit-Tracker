const express = require('express');
const router = express.Router();
const database = require('../database/db');

// GET /api/habits - Fetch all habits
router.get('/', (req, res) => {
  const db = database.getDB();
  const query = 'SELECT * FROM habits ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching habits:', err.message);
      return res.status(500).json({ error: 'Failed to fetch habits' });
    }
    res.json(rows);
  });
});

// POST /api/habits - Create a new habit
router.post('/', (req, res) => {
  const { name, description } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Habit name is required' });
  }

  const db = database.getDB();
  const query = 'INSERT INTO habits (name, description) VALUES (?, ?)';
  
  db.run(query, [name.trim(), description || ''], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Habit with this name already exists' });
      }
      console.error('Error creating habit:', err.message);
      return res.status(500).json({ error: 'Failed to create habit' });
    }
    
    res.status(201).json({
      id: this.lastID,
      name: name.trim(),
      description: description || '',
      created_at: new Date().toISOString()
    });
  });
});

// DELETE /api/habits/:id - Delete a habit
router.delete('/:id', (req, res) => {
  const habitId = req.params.id;
  
  if (!habitId || isNaN(habitId)) {
    return res.status(400).json({ error: 'Valid habit ID is required' });
  }

  const db = database.getDB();
  const query = 'DELETE FROM habits WHERE id = ?';
  
  db.run(query, [habitId], function(err) {
    if (err) {
      console.error('Error deleting habit:', err.message);
      return res.status(500).json({ error: 'Failed to delete habit' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json({ message: 'Habit deleted successfully' });
  });
});

// GET /api/habits/:id - Get a specific habit
router.get('/:id', (req, res) => {
  const habitId = req.params.id;
  
  if (!habitId || isNaN(habitId)) {
    return res.status(400).json({ error: 'Valid habit ID is required' });
  }

  const db = database.getDB();
  const query = 'SELECT * FROM habits WHERE id = ?';
  
  db.get(query, [habitId], (err, row) => {
    if (err) {
      console.error('Error fetching habit:', err.message);
      return res.status(500).json({ error: 'Failed to fetch habit' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json(row);
  });
});

module.exports = router;