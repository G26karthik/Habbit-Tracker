import React, { useEffect } from 'react';
import { useHabits } from '../context/HabitContext';

function SummaryStats() {
  const { summary, fetchSummary, habits } = useHabits();

  useEffect(() => {
    // Refresh summary when habits change
    if (habits.length > 0) {
      fetchSummary();
    }
  }, [habits.length, fetchSummary]);

  if (!summary) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-8 bg-primary-800 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-primary-800 rounded"></div>
              <div className="h-6 bg-primary-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const StatCard = ({ title, period, stats, isWeekly = false }) => (
    <div className="bg-primary-800 p-8 border border-primary-700">
      <div className="mb-8">
        <h3 className="heading-sm text-white mb-2">{title}</h3>
        <p className="text-primary-300 text-sm uppercase tracking-wider">
          {period}
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-6xl font-serif font-bold text-white mb-2">
            {stats.completedHabits}
            <span className="text-2xl text-primary-400">/{stats.totalHabits}</span>
          </div>
          <div className="label-text text-primary-300">
            HABITS WITH PROGRESS
          </div>
          {stats.totalHabits > 0 && (
            <div className="mt-6">
              <div className="bg-primary-700 h-1 mb-2">
                <div 
                  className="bg-white h-1 transition-all duration-1000"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <div className="label-text text-primary-400">
                {stats.completionRate}% COMPLETION RATE
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="text-center border border-primary-700 p-4">
            <div className="text-2xl font-serif font-semibold text-success-400 mb-1">
              {stats.totalCompletions}
            </div>
            <div className="label-text text-primary-300">
              COMPLETED
            </div>
          </div>
          <div className="text-center border border-primary-700 p-4">
            <div className="text-2xl font-serif font-semibold text-danger-400 mb-1">
              {stats.totalMisses}
            </div>
            <div className="label-text text-primary-300">
              MISSED
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div className="text-center">
        <div className="mb-8">
          <div className="text-7xl font-serif font-bold text-white mb-4">
            {summary.totalHabits}
          </div>
          <div className="label-text text-primary-300">
            {summary.totalHabits === 1 ? 'HABIT TRACKED' : 'HABITS TRACKED'}
          </div>
        </div>
        
        {summary.totalHabits === 0 && (
          <div className="bg-primary-800 p-8 border border-primary-700">
            <p className="body-lg text-primary-300 mb-4">
              Begin your journey to better habits
            </p>
            <p className="label-text text-primary-400">
              CREATE YOUR FIRST HABIT BELOW
            </p>
          </div>
        )}
      </div>

      {/* Weekly and Monthly Stats */}
      {summary.totalHabits > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatCard
            title="THIS WEEK"
            period={summary.weekly.period}
            stats={summary.weekly}
            isWeekly={true}
          />
          <StatCard
            title="THIS MONTH"
            period={summary.monthly.period}
            stats={summary.monthly}
          />
        </div>
      )}

      {/* Motivational Messages */}
      {summary.totalHabits > 0 && (
        <div className="bg-primary-800 p-8 border border-primary-700">
          <div className="text-center">
            <MotivationalMessage summary={summary} />
          </div>
        </div>
      )}
    </div>
  );
}

function MotivationalMessage({ summary }) {
  const weeklyRate = summary.weekly.completionRate;
  
  if (weeklyRate >= 80) {
    return (
      <>
        <div className="text-6xl mb-6">✨</div>
        <h3 className="heading-sm text-white mb-4">
          EXCEPTIONAL PROGRESS
        </h3>
        <p className="body-base text-primary-300">
          You're achieving remarkable consistency. This level of dedication 
          transforms habits into lasting change.
        </p>
      </>
    );
  } else if (weeklyRate >= 60) {
    return (
      <>
        <div className="text-6xl mb-6">🎯</div>
        <h3 className="heading-sm text-white mb-4">
          STRONG MOMENTUM
        </h3>
        <p className="body-base text-primary-300">
          You're making solid progress with admirable consistency. 
          Continue this trajectory and watch your habits flourish.
        </p>
      </>
    );
  } else if (weeklyRate >= 40) {
    return (
      <>
        <div className="text-6xl mb-6">🌱</div>
        <h3 className="heading-sm text-white mb-4">
          BUILDING FOUNDATIONS
        </h3>
        <p className="body-base text-primary-300">
          Every tracked habit is meaningful progress. 
          You're cultivating the discipline that creates lasting change.
        </p>
      </>
    );
  } else if (summary.weekly.totalCompletions > 0) {
    return (
      <>
        <div className="text-6xl mb-6">🚀</div>
        <h3 className="heading-sm text-white mb-4">
          JOURNEY BEGINS
        </h3>
        <p className="body-base text-primary-300">
          You've taken the crucial first steps. 
          Consistency over perfection will guide you to success.
        </p>
      </>
    );
  } else {
    return (
      <>
        <div className="text-6xl mb-6">💫</div>
        <h3 className="heading-sm text-white mb-4">
          POTENTIAL AWAITS
        </h3>
        <p className="body-base text-primary-300">
          Your transformation begins with a single tracked habit. 
          Start today and build the life you envision.
        </p>
      </>
    );
  }
}

export default SummaryStats;