import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';
import useProgressStore from '../../store/progressStore';
import Navbar from '../../components/Navbar';
import AntiGravityBackground from '../../components/AntiGravityBackground';

const quizQuestions = [
  { question: "What is Machine Learning?", options: ["A subset of Artificial Intelligence", "A type of Database", "An Operating System", "A Compiler"], answer: 0 },
  { question: "Which algorithm is used for Classification?", options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"], answer: 1 },
  { question: "What does CNN stand for in Deep Learning?", options: ["Central Neural Network", "Convolutional Neural Network", "Computer Neutral Node", "Conditional Naive Network"], answer: 1 },
  { question: "What is an epoch?", options: ["A single forward pass", "One complete pass through the training dataset", "The learning rate", "An activation function"], answer: 1 },
  { question: "What is the primary purpose of an Activation Function?", options: ["To introduce non-linearity", "To increase memory", "To initialize weights", "To calculate loss"], answer: 0 }
];

export default function SmartQuiz() {
   const { submitQuiz } = useProgressStore();
   
   const [currentIndex, setCurrentIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [isFinished, setIsFinished] = useState(false);
   const [selectedOption, setSelectedOption] = useState(null);

   const handleSelect = (idx) => {
       setSelectedOption(idx);
   };

   const handleNext = () => {
       if (selectedOption === quizQuestions[currentIndex].answer) {
           setScore(score + 1);
       }

       if (currentIndex < quizQuestions.length - 1) {
           setCurrentIndex(currentIndex + 1);
           setSelectedOption(null);
       } else {
           finishQuiz(score + (selectedOption === quizQuestions[currentIndex].answer ? 1 : 0));
       }
   };

   const finishQuiz = (finalScore) => {
       setIsFinished(true);
       const accuracyResult = finalScore / quizQuestions.length;
       
       // Deduce weak area based on final question if they struggled
       const topic = accuracyResult < 0.6 ? 'Machine Learning Fundamentals' : 'General AI';
       
       submitQuiz(finalScore, quizQuestions.length, topic);
   };

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

                {!isFinished ? (
                   <>
                      <Text style={styles.header}>Smart Quiz</Text>
                      <Text style={styles.subtext}>Question {currentIndex + 1} of {quizQuestions.length}</Text>
                      
                      <View style={styles.quizCard}>
                          <Text style={styles.questionText}>{quizQuestions[currentIndex].question}</Text>
                          
                          <View style={styles.optionsList}>
                              {quizQuestions[currentIndex].options.map((opt, idx) => (
                                  <TouchableOpacity 
                                     key={idx} 
                                     style={[styles.optionBtn, selectedOption === idx && styles.optionSelected]}
                                     onPress={() => handleSelect(idx)}
                                  >
                                      <Text style={styles.optionText}>{opt}</Text>
                                  </TouchableOpacity>
                              ))}
                          </View>

                          <TouchableOpacity 
                             style={[styles.nextBtn, selectedOption === null && { opacity: 0.5 }]} 
                             disabled={selectedOption === null}
                             onPress={handleNext}
                          >
                             <Text style={styles.nextText}>{currentIndex === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next Question'}</Text>
                          </TouchableOpacity>
                      </View>
                   </>
                ) : (
                   <View style={styles.quizCard}>
                       <Text style={styles.scoreTitle}>Quiz Completed!</Text>
                       <Text style={styles.scoreText}>Your Score: {score} / {quizQuestions.length}</Text>
                       <Text style={styles.accuracyText}>Accuracy: {Math.round((score / quizQuestions.length) * 100)}%</Text>
                       
                       <TouchableOpacity style={styles.nextBtn} onPress={() => router.replace('/student-dashboard')}>
                           <Text style={styles.nextText}>Return to Dashboard</Text>
                       </TouchableOpacity>
                   </View>
                )}
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
  
  header: { fontSize: 36, color: '#F9FAFB', fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtext: { color: '#06B6D4', fontSize: 16, marginBottom: 40, textAlign: 'center', fontWeight: 'bold' },
  
  quizCard: { 
     backgroundColor: 'rgba(255,255,255,0.05)', 
     padding: 30, borderRadius: 20, width: '100%', maxWidth: 700,
     borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', 
     ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }),
  },
  
  questionText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 30, lineHeight: 32 },
  
  optionsList: { gap: 15, marginBottom: 30 },
  
  optionBtn: { 
      backgroundColor: 'rgba(0,0,0,0.3)', 
      borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', 
      paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12 
  },
  optionSelected: { borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)' },
  optionText: { color: '#F9FAFB', fontSize: 16 },
  
  nextBtn: { backgroundColor: '#a855f7', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  nextText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

  // Results Styles
  scoreTitle: { color: '#F9FAFB', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  scoreText: { color: '#10B981', fontSize: 48, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  accuracyText: { color: '#9CA3AF', fontSize: 20, textAlign: 'center', marginBottom: 40 },
});
