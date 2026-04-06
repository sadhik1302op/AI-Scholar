import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from '../firebase';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Firebase Auth listener hooks automatically
  checkSession: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const userData = { 
          email: user.email, 
          uid: user.uid, 
          username: user.displayName || 'Scholar',
          role: 'student' // Defaulting role because Firebase doesn't auto-assign it natively without Firestore
        };
        set({ user: userData, token });
      } else {
        set({ user: null, token: null });
      }
    });
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      const userData = { 
        email: userCredential.user.email, 
        uid: userCredential.user.uid,
        username: username, 
        role: 'student' 
      };
      
      set({ user: userData, token, isLoading: false, error: null });
      return { success: true, role: 'student' };
    } catch (error) {
      set({ 
          isLoading: false, 
          error: error.message 
      });
      return { success: false };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      const userData = { 
        email: userCredential.user.email, 
        uid: userCredential.user.uid, 
        role: 'student' 
      };
      
      set({ user: userData, token, isLoading: false, error: null });
      return { success: true, role: 'student' };
    } catch (error) {
      set({ 
          isLoading: false, 
          error: 'Firebase Auth Error: ' + error.message 
      });
      return { success: false };
    }
  },
  
  logout: async () => {
    await signOut(auth);
    set({ user: null, token: null });
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;
