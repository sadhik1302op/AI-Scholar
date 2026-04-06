import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ai-scholar-backend.onrender.com';
const BASE_URL = API_BASE_URL + '/api';
const API_URL = `${BASE_URL}/auth`;

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Load from storage on boot if needed
  checkSession: async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedToken && storedUser) {
        set({ token: storedToken, user: JSON.parse(storedUser) });
      }
    } catch (e) {
      console.error("Session fetch error", e);
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/register`, { username, email, password });
      
      const { token, progressData, ...userData } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (progressData) {
          await AsyncStorage.setItem('progressData', progressData);
      }
      
      set({ user: userData, token, isLoading: false, error: null });
      return { success: true, role: userData.role };
    } catch (error) {
      set({ 
          isLoading: false, 
          error: error.response?.data?.message || 'Failed to create account. Please try again.' 
      });
      return { success: false };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      const { token, progressData, ...userData } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      if (progressData) {
          await AsyncStorage.setItem('progressData', progressData);
      }
      
      set({ user: userData, token, isLoading: false, error: null });
      return { success: true, role: userData.role };
    } catch (error) {
      set({ 
          isLoading: false, 
          error: error.response?.data?.message || 'Invalid email or password.' 
      });
      return { success: false };
    }
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null });
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;
