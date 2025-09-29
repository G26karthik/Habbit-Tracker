import React from 'react';
import { Toaster } from 'react-hot-toast';
import { HabitProvider } from './context/HabitContext';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import HabitCalendar from './components/HabitCalendar';
import SummaryStats from './components/SummaryStats';

function App() {
  return (
    <HabitProvider>
      <div className="min-h-screen bg-primary-50">
        {/* Hero Header */}
        <header className="bg-white">
          <div className="container-width section-padding">
            <div className="text-center fade-in">
              <h1 className="heading-xl mb-6">
                HABIT TRACKER
              </h1>
              <p className="body-lg max-w-2xl mx-auto">
                Transform your daily routines into powerful habits. 
                Track your progress with elegant simplicity and build the life you want, 
                one day at a time.
              </p>
            </div>
          </div>
        </header>

        {/* Dark Section - Summary */}
        <section className="bg-primary-900 text-white">
          <div className="container-width section-padding">
            <div className="slide-up">
              <SummaryStats />
            </div>
          </div>
        </section>

        {/* Light Section - Calendar */}
        <section className="bg-white">
          <div className="container-width section-padding">
            <div className="fade-in">
              <div className="text-center mb-12">
                <h2 className="heading-lg mb-4">Weekly Overview</h2>
                <p className="body-base">
                  Visual progress tracking with intuitive color coding
                </p>
              </div>
              <HabitCalendar />
            </div>
          </div>
        </section>

        {/* Management Section */}
        <section className="bg-primary-50">
          <div className="container-width section-padding">
            <div className="text-center mb-12 fade-in">
              <h2 className="heading-lg mb-4">Manage Your Habits</h2>
              <p className="body-base">
                Create new habits and organize your daily routines
              </p>
            </div>
            
            <div className="project-grid slide-up">
              <HabitForm />
              <HabitList />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary-900 text-white">
          <div className="container-width py-12">
            <div className="text-center">
              <div className="mb-8">
                <h3 className="heading-sm mb-4">HABIT TRACKER</h3>
                <p className="body-base text-primary-300">
                  Elegant habit tracking for intentional living
                </p>
              </div>
              
              <div className="border-t border-primary-800 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  <div>
                    <p className="text-primary-400 uppercase tracking-wider mb-2">
                      Built With
                    </p>
                    <p className="text-primary-300">
                      React • Express • SQLite • TailwindCSS
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-400 uppercase tracking-wider mb-2">
                      Full-Stack Assignment
                    </p>
                    <p className="text-primary-300">
                      Demonstrating modern web development practices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#18181b',
              color: '#fafafa',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              duration: 3000,
              style: {
                background: '#166534',
                color: '#f0fdf4',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#991b1b',
                color: '#fef2f2',
              },
            },
          }}
        />
      </div>
    </HabitProvider>
  );
}

export default App;