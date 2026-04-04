import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import useProgressStore from '../../store/progressStore';
import Navbar from '../../components/Navbar';
import AntiGravityBackground from '../../components/AntiGravityBackground';
import { lessonsData } from '../../data/lessonsData';

export default function LessonsPage() {
   const { modulesCompleted, markModuleComplete } = useProgressStore();

   return (
      <View style={styles.container}>
         <Stack.Screen options={{ headerShown: false }} />
         <Navbar />
         <View style={styles.bgWrapper}>
            <AntiGravityBackground />
            
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back to Dashboard</Text>
                </TouchableOpacity>

                <Text style={styles.header}>AI Lessons</Text>
                <Text style={styles.subtext}>Master theoretical concepts before testing your practical knowledge.</Text>
                
                <View style={styles.listContainer}>
                    {lessonsData.map((l, index) => {
                       const isDone = modulesCompleted.includes(l.id);
                       return (
                           <View key={l.id} style={[styles.lessonCard, isDone && { borderColor: 'rgba(16, 185, 129, 0.4)' }]}>
                               <View style={styles.textContainer}>
                                  <Text style={styles.lessonTitle}>{index + 1}. {l.title}</Text>
                                  <Text style={styles.lessonDesc}>{l.level.toUpperCase()} LEVEL</Text>
                               </View>

                               <View style={styles.actions}>
                                   <TouchableOpacity style={styles.startBtn} onPress={() => router.push(`/lessons/${l.id}`)}>
                                       <Text style={styles.startBtnText}>Start Learning</Text>
                                   </TouchableOpacity>
                                   
                                   <TouchableOpacity 
                                     style={[styles.completeBtn, isDone && {backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981'}]}
                                     onPress={() => markModuleComplete(l.id)}
                                     disabled={isDone}
                                   >
                                       <Text style={[styles.completeBtnText, isDone && {color: '#10B981'} ]}>
                                          {isDone ? 'Completed ✅' : 'Mark Complete'}
                                       </Text>
                                   </TouchableOpacity>
                               </View>
                           </View>
                       )
                    })}
                </View>
            </ScrollView>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  bgWrapper: { flex: 1, position: 'relative' },
  content: { padding: 40, alignItems: 'center' },
  
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { color: '#9CA3AF', fontSize: 16, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  
  header: { fontSize: 36, color: '#F9FAFB', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtext: { color: '#9CA3AF', fontSize: 16, marginBottom: 40, textAlign: 'center' },
  
  listContainer: { width: '100%', maxWidth: 700, gap: 15 },
  
  lessonCard: { 
     backgroundColor: 'rgba(255,255,255,0.05)', 
     padding: 24, borderRadius: 16, 
     borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', 
     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
     ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' }),
     flexWrap: 'wrap'
  },
  
  textContainer: { flex: 1, minWidth: 200, marginRight: 20 },
  lessonTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  lessonDesc: { color: '#9CA3AF', fontSize: 14, lineHeight: 20 },
  
  actions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  startBtn: { backgroundColor: '#a855f7', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  startBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  
  completeBtn: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, justifyContent: 'center' },
  completeBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 }
});
