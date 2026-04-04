import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Platform, TouchableOpacity, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import Navbar from '../components/Navbar';
import AntiGravityBackground from '../components/AntiGravityBackground';
import useAuthStore from '../store/authStore';

const StatCard = ({ title, value, color }) => (
  <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Navbar />
      
      <View style={styles.deepSpaceBackground}>
        <AntiGravityBackground />
        
        <Animated.View style={[{ flex: 1, width: '100%', opacity: fadeAnim }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.header}>
               <Text style={styles.telemetryTag}>SYS_ADMIN_ACCESS_GRANTED // ROOT_AUTHORITY</Text>
               <Text style={styles.welcomeText}>Control Center</Text>
               <Text style={styles.subText}>Administrator: {user?.username || 'Admin'}</Text>
            </View>

            <View style={styles.statsRow}>
               <StatCard title="Total Users" value="1,204" color="#06B6D4" />
               <StatCard title="Active Modules" value="12" color="#a855f7" />
               <StatCard title="System Health" value="100%" color="#10B981" />
            </View>

            <View style={styles.adminPanel}>
                <Text style={styles.panelTitle}>Add New Learning Module</Text>
                
                <TextInput style={styles.input} placeholder="Module Title" placeholderTextColor="#6B7280" />
                <TextInput style={[styles.input, { height: 80, alignItems: 'flex-start' }]} placeholder="Module Description" placeholderTextColor="#6B7280" multiline />
                
                <TouchableOpacity style={styles.actionButton}>
                   <Text style={styles.actionText}>Deploy Module</Text>
                </TouchableOpacity>
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
  
  header: { alignItems: 'center', marginBottom: 40 },
  telemetryTag: { color: '#06B6D4', fontSize: 12, fontFamily: Platform.OS === 'web' ? 'monospace' : 'System', letterSpacing: 2, marginBottom: 15 },
  welcomeText: { color: '#F9FAFB', fontSize: 32, fontWeight: 'bold' },
  subText: { color: '#a855f7', fontSize: 16, marginTop: 5 },
  
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, width: '100%', maxWidth: 1000, marginBottom: 40 },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16, padding: 25, width: 220,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' })
  },
  statTitle: { color: '#9CA3AF', fontSize: 14, marginBottom: 10 },
  statValue: { fontSize: 36, fontWeight: '900' },
  
  adminPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20, padding: 30, width: '100%', maxWidth: 600,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  panelTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    color: '#FFF', marginBottom: 15,
    ...(Platform.OS === 'web' && { outlineStyle: 'none' })
  },
  
  actionButton: { backgroundColor: '#a855f7', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  actionText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
