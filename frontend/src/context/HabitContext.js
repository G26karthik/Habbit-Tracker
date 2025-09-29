import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { habitAPI } from '../services/api';

// Initial state
const initialState = {
  habits: [],
  checkins: {},
  summary: null,
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_HABITS: 'SET_HABITS',
  ADD_HABIT: 'ADD_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  SET_CHECKINS: 'SET_CHECKINS',
  UPDATE_CHECKIN: 'UPDATE_CHECKIN',
  SET_SUMMARY: 'SET_SUMMARY'
};

// Reducer
function habitReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.SET_HABITS:
      return { ...state, habits: action.payload, loading: false };
    
    case actionTypes.ADD_HABIT:
      return { 
        ...state, 
        habits: [action.payload, ...state.habits],
        loading: false 
      };
    
    case actionTypes.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        checkins: Object.fromEntries(
          Object.entries(state.checkins).filter(([key]) => 
            !key.startsWith(`${action.payload}-`)
          )
        ),
        loading: false
      };
    
    case actionTypes.SET_CHECKINS:
      return { 
        ...state, 
        checkins: { ...state.checkins, ...action.payload }, 
        loading: false 
      };
    
    case actionTypes.UPDATE_CHECKIN:
      const { habitId, date, status } = action.payload;
      const key = `${habitId}-${date}`;
      return {
        ...state,
        checkins: {
          ...state.checkins,
          [key]: status
        },
        loading: false
      };
    
    case actionTypes.SET_SUMMARY:
      return { ...state, summary: action.payload, loading: false };
    
    default:
      return state;
  }
}

// Context
const HabitContext = createContext();

// Provider component
export function HabitProvider({ children }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Actions
  const setLoading = (loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  };

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const habits = await habitAPI.getAll();
      dispatch({ type: actionTypes.SET_HABITS, payload: habits });
    } catch (error) {
      setError('Failed to fetch habits');
      console.error('Error fetching habits:', error);
    }
  };

  const createHabit = async (habitData) => {
    try {
      setLoading(true);
      const newHabit = await habitAPI.create(habitData);
      dispatch({ type: actionTypes.ADD_HABIT, payload: newHabit });
      return newHabit;
    } catch (error) {
      setError('Failed to create habit');
      console.error('Error creating habit:', error);
      throw error;
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      setLoading(true);
      await habitAPI.delete(habitId);
      dispatch({ type: actionTypes.DELETE_HABIT, payload: habitId });
    } catch (error) {
      setError('Failed to delete habit');
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  const fetchCheckinsForHabit = async (habitId, startDate, endDate) => {
    try {
      const checkins = await habitAPI.getCheckins(habitId, startDate, endDate);
      const checkinsMap = {};
      checkins.forEach(checkin => {
        const key = `${habitId}-${checkin.date}`;
        checkinsMap[key] = checkin.status;
      });
      dispatch({ type: actionTypes.SET_CHECKINS, payload: checkinsMap });
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  const updateCheckin = async (habitId, date, status) => {
    try {
      await habitAPI.updateCheckin(habitId, date, status);
      dispatch({ 
        type: actionTypes.UPDATE_CHECKIN, 
        payload: { habitId, date, status } 
      });
    } catch (error) {
      setError('Failed to update check-in');
      console.error('Error updating check-in:', error);
      throw error;
    }
  };

  const fetchSummary = async () => {
    try {
      const summary = await habitAPI.getSummary();
      dispatch({ type: actionTypes.SET_SUMMARY, payload: summary });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchHabits();
    fetchSummary();
  }, []);

  const contextValue = {
    ...state,
    fetchHabits,
    createHabit,
    deleteHabit,
    fetchCheckinsForHabit,
    updateCheckin,
    fetchSummary,
    setError
  };

  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
}

// Hook to use the context
export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}