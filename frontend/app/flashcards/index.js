import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Animated } from 'react-native';
import { router, Stack } from 'expo-router';
import Navbar from '../../components/Navbar';
import AntiGravityBackground from '../../components/AntiGravityBackground';

const flashcardsData = [
  { q: "What is Backpropagation?", a: "The method of fine-tuning weights of a neural net based on the error rate." },
  { q: "Define Overfitting", a: "When a model learns the training data too well, failing to generalize to new data." },
  { q: "What is a Tensor?", a: "A multi-dimensional array of numbers used as the fundamental data structure in ML." },
  { q: "What is the purpose of NLP?", a: "To enable computers to understand, interpret, and manipulate human language." }
];

export default function FlashcardsPage() {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isFlipped, setIsFlipped] = useState(false);
   
   const flipAnim = useRef(new Animated.Value(0)).current;

   const flipCard = () => {
      Animated.timing(flipAnim, {
         toValue: isFlipped ? 0 : 180,
         duration: 400, // Smooth 3D animation
         useNativeDriver: true
      }).start();
      setIsFlipped(!isFlipped);
   };

   const nextCard = () => {
      if (currentIndex < flashcardsData.length - 1) {
         resetFlipAndNavigate(currentIndex + 1);
      }
   };
   
   const prevCard = () => {
      if (currentIndex > 0) {
         resetFlipAndNavigate(currentIndex - 1);
      }
   };

   const resetFlipAndNavigate = (newIndex) => {
      if (isFlipped) {
         flipAnim.setValue(0);
         setIsFlipped(false);
      }
      setCurrentIndex(newIndex);
   };

   // 3D Matrix Interpolations
   const frontAnimatedStyle = { transform: [{ rotateY: flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] }) }] };
   const backAnimatedStyle = { transform: [{ rotateY: flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] }) }] };

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

                <Text style={styles.header}>Flashcards</Text>
                <Text style={styles.subtext}>Card {currentIndex + 1} of {flashcardsData.length}</Text>
                
                <View style={styles.cardContainer}>
                    {/* Front of Card */}
                    <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
                        <Text style={styles.cardIndicator}>QUESTION</Text>
                        <Text style={styles.cardText}>{flashcardsData[currentIndex].q}</Text>
                        
                        <TouchableOpacity style={styles.flipBtn} onPress={flipCard}>
                            <Text style={styles.flipText}>Tap to reveal answer ↺</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Back of Card */}
                    <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
                        <Text style={[styles.cardIndicator, { color: '#10B981' }]}>ANSWER</Text>
                        <Text style={[styles.cardText, { color: '#F9FAFB' }]}>{flashcardsData[currentIndex].a}</Text>
                        
                        <TouchableOpacity style={[styles.flipBtn, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }]} onPress={flipCard}>
                            <Text style={[styles.flipText, { color: '#10B981' }]}>Tap to see question ↺</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Navigation Controls */}
                <View style={styles.controlsRow}>
                    <TouchableOpacity 
                       style={[styles.navBtn, currentIndex === 0 && { opacity: 0.3 }]} 
                       disabled={currentIndex === 0}
                       onPress={prevCard}
                    >
                        <Text style={styles.navText}>◄ Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                       style={[styles.navBtn, currentIndex === flashcardsData.length - 1 && { opacity: 0.3 }]} 
                       disabled={currentIndex === flashcardsData.length - 1}
                       onPress={nextCard}
                    >
                        <Text style={styles.navText}>Next ►</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  bgWrapper: { flex: 1, position: 'relative' },
  content: { padding: 40, alignItems: 'center' },
  
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { color: '#9CA3AF', fontSize: 16, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  
  header: { fontSize: 36, color: '#F9FAFB', fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  subtext: { color: '#a855f7', fontSize: 16, marginBottom: 40, textAlign: 'center', fontWeight: 'bold' },
  
  cardContainer: { width: '100%', maxWidth: 650, height: 400, alignItems: 'center', justifyContent: 'center' },
  
  card: { 
     position: 'absolute', width: '100%', height: '100%',
     backgroundColor: 'rgba(255,255,255,0.05)', 
     padding: 40, borderRadius: 24, 
     borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', 
     alignItems: 'center', justifyContent: 'center',
     backfaceVisibility: 'hidden',
     ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }),
  },
  cardFront: { zIndex: 2 },
  cardBack: { zIndex: 1, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  
  cardIndicator: { fontSize: 14, fontWeight: '900', color: '#a855f7', letterSpacing: 2, position: 'absolute', top: 30 },
  cardText: { color: '#FFF', fontSize: 26, fontWeight: 'bold', textAlign: 'center', lineHeight: 36, marginVertical: 30 },
  
  flipBtn: { position: 'absolute', bottom: 30, backgroundColor: 'rgba(168, 85, 247, 0.1)', borderWidth: 1, borderColor: '#a855f7', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  flipText: { color: '#a855f7', fontWeight: 'bold', fontSize: 14 },
  
  controlsRow: { flexDirection: 'row', gap: 20, marginTop: 40 },
  navBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12 },
  navText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
