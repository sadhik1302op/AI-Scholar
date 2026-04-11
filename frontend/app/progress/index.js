import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import axios from 'axios';
import useProgressStore from '../../store/progressStore';
import Navbar from '../../components/Navbar';
import AntiGravityBackground from '../../components/AntiGravityBackground';

export default function ProgressReportPage() {
   const { modulesCompleted, quizScores, weakTopics, accuracy } = useProgressStore();
   
   const [aiRecommendations, setAiRecommendations] = useState('');
   const [loadingAi, setLoadingAi] = useState(false);

   useEffect(() => {
       if (weakTopics.length > 0) {
           setLoadingAi(true);
           const topicsStr = weakTopics.join(', ');
           axios.post('https://ai-scholar-backend.onrender.com/api/ai/ask', {
               question: `I am a middle school student and I took a quiz but I struggled with: ${topicsStr}. Please recommend a couple of practical YouTube search topics or short concepts I should study to get better at this.`
           }).then(res => {
               setAiRecommendations(res.data.reply);
           }).catch(err => {
               console.error("AI Recommender Error:", err);
               setAiRecommendations("Couldn't load AI recommendations right now. Try searching YouTube for the weak topics listed above!");
           }).finally(() => {
               setLoadingAi(false);
           });
       }
   }, [weakTopics]);

   return (
      <View style={styles.container}>
         <Stack.Screen options={{ headerShown: false }} />
         <Navbar />
         <View style={styles.bgWrapper}>
            <AntiGravityBackground />
            
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/student-dashboard')}>
                    <Text style={styles.backText}>← Back to Dashboard</Text>
                </TouchableOpacity>

                <Text style={styles.header}>Performance Analytics</Text>
                <Text style={styles.subtext}>A deep dive into your AI capability metrics.</Text>

                <View style={styles.metricsGrid}>
                    <View style={[styles.statBox, { borderColor: '#a855f7' }]}>
                        <Text style={styles.statLabel}>Global Accuracy</Text>
                        <Text style={[styles.statValue, { color: '#a855f7' }]}>{accuracy}%</Text>
                    </View>
                    
                    <View style={[styles.statBox, { borderColor: '#10B981' }]}>
                        <Text style={styles.statLabel}>Modules Finished</Text>
                        <Text style={[styles.statValue, { color: '#10B981' }]}>{modulesCompleted.length}</Text>
                    </View>

                    <View style={[styles.statBox, { borderColor: '#06B6D4' }]}>
                        <Text style={styles.statLabel}>Quizzes Taken</Text>
                        <Text style={[styles.statValue, { color: '#06B6D4' }]}>{quizScores.length}</Text>
                    </View>
                </View>

                <View style={styles.detailedSection}>
                     <Text style={styles.sectionTitle}>Identified Weaknesses & AI Guidance</Text>
                     {weakTopics.length > 0 ? (
                         <>
                             {weakTopics.map((topic, i) => (
                                 <View key={i} style={styles.weakBadge}>
                                     <Text style={styles.weakText}>⚠️ {topic} (Action Required)</Text>
                                 </View>
                             ))}
                             
                             <View style={styles.aiRecommendationCard}>
                                 <Text style={styles.aiHeader}>🤖 AI Recommendations</Text>
                                 {loadingAi ? (
                                    <ActivityIndicator size="small" color="#06B6D4" style={{ marginTop: 10 }} />
                                 ) : (
                                    <Text style={styles.aiText}>{aiRecommendations}</Text>
                                 )}
                             </View>
                         </>
                     ) : (
                         <Text style={styles.perfectText}>All systems optimal! No weak areas detected.</Text>
                     )}
                </View>

                <View style={styles.detailedSection}>
                     <Text style={styles.sectionTitle}>Recent Quiz Feedback</Text>
                     {quizScores.length > 0 ? (
                         quizScores.map((q, i) => (
                             <View key={i} style={styles.quizResultCard}>
                                 <Text style={styles.quizTopic}>{q.topic}</Text>
                                 <Text style={[styles.quizScore, (q.score / q.total) < 0.6 ? { color: '#EF4444' } : { color: '#10B981' }]}>
                                     {q.score} / {q.total} ({(q.score / q.total * 100).toFixed(0)}%)
                                 </Text>
                             </View>
                         ))
                     ) : (
                         <Text style={styles.perfectText}>You haven't taken any Smart Quizzes yet.</Text>
                     )}
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
  backText: { color: '#9CA3AF', fontSize: 16, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System', fontWeight: 'bold' },
  
  header: { fontSize: 36, color: '#F9FAFB', fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtext: { color: '#9CA3AF', fontSize: 16, marginBottom: 40, textAlign: 'center' },
  
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20, width: '100%', maxWidth: 800, marginBottom: 40 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 30, borderRadius: 20, borderWidth: 2, alignItems: 'center', width: 220, ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' }) },
  statLabel: { color: '#D1D5DB', fontSize: 14, marginBottom: 15, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { fontSize: 48, fontWeight: '900' },

  detailedSection: { width: '100%', maxWidth: 700, backgroundColor: 'rgba(0,0,0,0.3)', padding: 30, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 25 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 15, marginBottom: 20 },
  
  perfectText: { color: '#10B981', fontSize: 16, fontStyle: 'italic' },
  
  weakBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#EF4444', padding: 15, borderRadius: 12, marginBottom: 10 },
  weakText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },

  quizResultCard: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  quizTopic: { color: '#D1D5DB', fontSize: 16 },
  quizScore: { fontWeight: 'bold', fontSize: 16 },

  aiRecommendationCard: { marginTop: 20, backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)' },
  aiHeader: { color: '#06B6D4', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  aiText: { color: '#E5E7EB', lineHeight: 22, fontSize: 15, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' }
});
