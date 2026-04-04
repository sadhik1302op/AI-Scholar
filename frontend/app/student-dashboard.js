import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Platform, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import Navbar from '../components/Navbar';
import AntiGravityBackground from '../components/AntiGravityBackground';
import useAuthStore from '../store/authStore';
import useProgressStore from '../store/progressStore';

const DashboardCard = ({ title, description, buttonText, onPress, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <View 
      style={[styles.moduleCard, isHovered && styles.moduleCardHover, Platform.OS === 'web' && { transition: 'all 0.3s ease' }]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleDescription}>{description}</Text>
      
      {children}

      <TouchableOpacity style={styles.startButton} onPress={onPress}>
        <Text style={styles.startText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { accuracy, weakTopics, fetchProgress } = useProgressStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    fetchProgress(); // Hook Viva Endpoint load
  }, []);

  const handleContinueLearning = () => {
     router.push('/lessons'); // Automatically opens modules listing
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Navbar />
      
      <View style={styles.deepSpaceBackground}>
        <AntiGravityBackground />
        
        <Animated.View style={[{ flex: 1, width: '100%', opacity: fadeAnim }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.header}>
               <Text style={styles.welcomeText}>Welcome back, {user?.username || 'Scholar'}</Text>
               <Text style={styles.subText}>Continue your AI learning journey with smart insights.</Text>
               
               <TouchableOpacity style={styles.continueButton} onPress={handleContinueLearning}>
                  <Text style={styles.continueText}>🚀 Continue Learning</Text>
               </TouchableOpacity>
            </View>

            {/* Row 1 Grid: Lessons | Quiz | Flashcards */}
            <View style={styles.rowLayout}>
               <DashboardCard title="AI Lessons" description="Learn concepts like Neural Networks, ML, Data Science." buttonText="Start Learning" onPress={() => router.push('/lessons')} />
               <DashboardCard title="Smart Quiz" description="Test your understanding with AI-generated questions." buttonText="Take Quiz" onPress={() => router.push('/quiz')} />
               <DashboardCard title="Flashcards" description="Revise key concepts quickly with interactive cards." buttonText="Practice Now" onPress={() => router.push('/flashcards')} />
            </View>

            {/* Row 2 Grid: AI Tutor | Performance Progress */}
            <View style={styles.rowLayout}>
               <DashboardCard title="AI Tutor" description="Ask doubts and get instant explanations regarding concepts." buttonText="Ask AI" onPress={() => router.push('/tutor')} />
               
               <DashboardCard title="Your Progress" description="Track strengths & weaknesses across models" buttonText="View Report" onPress={() => router.push('/progress')}>
                    <View style={styles.progressDataBox}>
                        <Text style={styles.progressDataText}>Accuracy: <Text style={styles.highlightText}>{accuracy}%</Text></Text>
                        <Text style={styles.progressDataText}>Weak Area: <Text style={styles.errorText}>{weakTopics.length > 0 ? weakTopics[0] : 'None detected'}</Text></Text>
                    </View>
               </DashboardCard>
            </View>
            
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  deepSpaceBackground: { flex: 1, position: 'relative' },
  scrollContent: { padding: 40, alignItems: 'center' },
  
  header: { alignItems: 'center', marginBottom: 50 },
  welcomeText: { color: '#F9FAFB', fontSize: 34, fontWeight: 'bold', fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System', textAlign: 'center' },
  subText: { color: '#9CA3AF', fontSize: 18, marginTop: 10, textAlign: 'center' },
  
  continueButton: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 1, borderColor: '#10B981', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, marginTop: 25 },
  continueText: { color: '#10B981', fontWeight: 'bold', fontSize: 16 },

  rowLayout: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, width: '100%', maxWidth: 1000, marginBottom: 20 },
  
  moduleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20, padding: 25, width: 300,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'space-between', minHeight: 230,
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' })
  },
  moduleCardHover: {
    borderColor: 'rgba(168, 85, 247, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    ...(Platform.OS === 'web' && { transform: 'translateY(-5px)', boxShadow: '0 15px 30px rgba(0,0,0,0.5)' })
  },
  moduleTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  moduleDescription: { color: '#9CA3AF', fontSize: 14, marginBottom: 20, lineHeight: 22 },
  
  progressDataBox: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  progressDataText: { color: '#D1D5DB', fontSize: 13, marginBottom: 4, fontWeight: 'bold' },
  highlightText: { color: '#06B6D4', fontSize: 16 }, // Cyan
  errorText: { color: '#EF4444', fontSize: 14 }, // Red
  
  startButton: { backgroundColor: '#a855f7', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 'auto' },
  startText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});
