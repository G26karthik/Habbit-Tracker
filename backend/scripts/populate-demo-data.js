const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Database path
const DB_PATH = path.join(__dirname, '../database/habits.db');

// Sample habits data
const sampleHabits = [
  {
    name: "Morning Meditation",
    description: "Start each day with 10 minutes of mindfulness meditation to center myself and set positive intentions."
  },
  {
    name: "Read 30 Minutes Daily",
    description: "Dedicate time to reading books that inspire growth, whether fiction, non-fiction, or professional development."
  },
  {
    name: "Drink 8 Glasses of Water",
    description: "Stay properly hydrated throughout the day for better energy, focus, and overall health."
  },
  {
    name: "Exercise for 45 Minutes",
    description: "Maintain physical fitness through varied workouts including cardio, strength training, or yoga."
  },
  {
    name: "Write in Journal",
    description: "Reflect on daily experiences, thoughts, and goals through consistent journaling practice."
  },
  {
    name: "Learn Spanish Vocabulary",
    description: "Study 20 new Spanish words daily using flashcards and language learning apps."
  },
  {
    name: "No Social Media Before Noon",
    description: "Avoid mindless scrolling in the morning to maintain focus and productivity during peak hours."
  },
  {
    name: "Practice Gratitude",
    description: "Write down three things I'm grateful for each day to cultivate a positive mindset."
  }
];

// Generate realistic check-in data for the past 3 weeks
function generateCheckIns(habitId, habitName) {
  const checkIns = [];
  const today = new Date();
  
  // Generate data for 21 days (3 weeks)
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Create different completion patterns for different habits
    let completionRate;
    switch (habitName) {
      case "Morning Meditation":
        completionRate = 0.85; // Very consistent
        break;
      case "Read 30 Minutes Daily":
        completionRate = 0.75; // Good consistency
        break;
      case "Drink 8 Glasses of Water":
        completionRate = 0.90; // Excellent consistency
        break;
      case "Exercise for 45 Minutes":
        completionRate = 0.65; // Moderate consistency
        break;
      case "Write in Journal":
        completionRate = 0.70; // Good consistency
        break;
      case "Learn Spanish Vocabulary":
        completionRate = 0.60; // Moderate consistency
        break;
      case "No Social Media Before Noon":
        completionRate = 0.55; // Challenging habit
        break;
      case "Practice Gratitude":
        completionRate = 0.80; // High consistency
        break;
      default:
        completionRate = 0.70;
    }
    
    // Add some randomness and weekend variations
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendModifier = isWeekend ? 0.9 : 1.0; // Slightly lower completion on weekends
    
    const random = Math.random();
    const adjustedRate = completionRate * weekendModifier;
    
    if (random < adjustedRate) {
      checkIns.push({
        habit_id: habitId,
        date: dateStr,
        status: 'done'
      });
    } else if (random < adjustedRate + 0.15) {
      // Some days are marked as missed instead of just not tracked
      checkIns.push({
        habit_id: habitId,
        date: dateStr,
        status: 'missed'
      });
    }
    // Otherwise, leave untracked (no entry)
  }
  
  return checkIns;
}

function populateDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('📦 Connected to database for demo data population');
    });

    db.serialize(() => {
      // Clear existing data
      db.run('DELETE FROM checkins', (err) => {
        if (err) console.error('Error clearing checkins:', err);
      });
      
      db.run('DELETE FROM habits', (err) => {
        if (err) console.error('Error clearing habits:', err);
      });

      console.log('🧹 Cleared existing data');

      // Insert sample habits
      const insertHabit = db.prepare('INSERT INTO habits (name, description) VALUES (?, ?)');
      
      sampleHabits.forEach((habit, index) => {
        insertHabit.run(habit.name, habit.description, function(err) {
          if (err) {
            console.error('Error inserting habit:', err);
          } else {
            console.log(`✅ Added habit: ${habit.name}`);
            
            // Generate check-ins for this habit
            const checkIns = generateCheckIns(this.lastID, habit.name);
            
            // Insert check-ins
            if (checkIns.length > 0) {
              const insertCheckIn = db.prepare('INSERT INTO checkins (habit_id, date, status) VALUES (?, ?, ?)');
              
              checkIns.forEach(checkIn => {
                insertCheckIn.run(checkIn.habit_id, checkIn.date, checkIn.status, (err) => {
                  if (err) {
                    console.error('Error inserting check-in:', err);
                  }
                });
              });
              
              insertCheckIn.finalize();
              console.log(`📅 Added ${checkIns.length} check-ins for ${habit.name}`);
            }
          }
        });
      });
      
      insertHabit.finalize();

      // Close database after all operations
      setTimeout(() => {
        db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('🎉 Demo data population completed successfully!');
            console.log('');
            console.log('📊 Summary:');
            console.log(`   • ${sampleHabits.length} habits created`);
            console.log('   • 21 days of realistic check-in data');
            console.log('   • Varied completion patterns for demonstration');
            console.log('   • Ready for demo video recording!');
            console.log('');
            console.log('💡 Demo features to showcase:');
            console.log('   • Different habit completion rates');
            console.log('   • Weekly calendar with color coding');
            console.log('   • Summary statistics');
            console.log('   • Interactive check-in functionality');
            resolve();
          }
        });
      }, 2000); // Wait for all async operations to complete
    });
  });
}

// Run the population script
if (require.main === module) {
  populateDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error populating demo data:', error);
      process.exit(1);
    });
}

module.exports = { populateDatabase };