import { create } from 'zustand';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Production Ready API Sync Route
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ai-scholar-backend.onrender.com';
const BASE_URL = API_BASE_URL + '/api';
const SYNC_URL = `${BASE_URL}/auth/sync`;

const useProgressStore = create((set, get) => ({
  modulesCompleted: [],
  quizScores: [], // Stores objects: { topic, score, total }
  weakTopics: [], // Stores topic strings
  accuracy: 0,
  isLoading: false,

  // Loads initial data if user returns
  fetchProgress: async () => {
    try {
      const dataStr = await AsyncStorage.getItem('progressData');
      if (dataStr) {
        set({ ...JSON.parse(dataStr) });
      }
    } catch(e) { console.error("Error parsing stored progress", e); }
  },

  syncDatabase: async (newState) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
           await axios.put(SYNC_URL, { progressData: JSON.stringify(newState) }, {
               headers: { Authorization: `Bearer ${token}` }
           });
           await AsyncStorage.setItem('progressData', JSON.stringify(newState));
        }
    } catch (e) {
        console.error("Failed to sync progress to Database:", e.response?.data?.message || e.message);
    }
  },

  // Process Quiz Submission and Recalculate Stats
  submitQuiz: async (score, total, topic) => {
    // Viva Reference: await axios.post(`${API_URL}/quiz`, { quizId, answers });
    
    set((state) => {
      const newQuizScores = [...state.quizScores, { topic, score, total }];
      
      // Update Accuracy = totalScore / totalQuestions
      let totalEarned = 0;
      let totalPossible = 0;
      newQuizScores.forEach(q => {
         totalEarned += q.score;
         totalPossible += q.total;
      });
      
      const newAccuracy = totalPossible === 0 ? 0 : Math.round((totalEarned / totalPossible) * 100);

      // Detect Weak Topics (Threshold < 60%)
      const weakTopicsSet = new Set(state.weakTopics);
      const percentage = score / total;
      if (percentage < 0.6) {
         weakTopicsSet.add(topic);
      } else {
         weakTopicsSet.delete(topic); // They improved!
      }

      const newState = {
        modulesCompleted: state.modulesCompleted,
        quizScores: newQuizScores,
        accuracy: newAccuracy,
        weakTopics: Array.from(weakTopicsSet)
      };
      
      get().syncDatabase(newState);
      return newState;
    });
  },

  markModuleComplete: async (moduleId) => {
    // Viva Reference: await axios.post(`${API_URL}/lesson`, { lessonId: moduleId });
    
    set((state) => {
      if (!state.modulesCompleted.includes(moduleId)) {
        const newState = { ...state, modulesCompleted: [...state.modulesCompleted, moduleId] };
        // Exclude ephemeral zustand functions from saving
        const { syncDatabase, fetchProgress, submitQuiz, markModuleComplete, isLoading, ...pureState } = newState;
        get().syncDatabase(pureState);
        return newState;
      }
      return state;
    });
  }
}));

export default useProgressStore;
