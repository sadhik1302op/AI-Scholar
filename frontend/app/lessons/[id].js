import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { lessonsData } from '../../data/lessonsData';
import useProgressStore from '../../store/progressStore';
import Navbar from '../../components/Navbar';
import AntiGravityBackground from '../../components/AntiGravityBackground';

const AIAssistantModal = ({ visible, onClose, lessonTitle, stepObj }) => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAskAI = (isSimple) => {
        setIsLoading(true);
        setResponse(null);

        // Required Prompt Logic Structuring
        let prompt;
        if (isSimple) {
            prompt = `Explain this in the simplest way possible like teaching a 10-year-old. Context: ${stepObj?.content || stepObj?.question}`;
        } else {
            prompt = `User is learning ${lessonTitle} at beginner level. Explain in a very simple way for a middle school student. Keep it short, clear, and example-based. User question: ${input}`;
        }

        // Simulating Backend Latency (User Approved)
        setTimeout(() => {
            setIsLoading(false);
            setResponse(`[Mock AI Response to: "${isSimple ? 'Explain Simpler' : input}"]\n\nThat's a great question! Think of it like a smart assistant that learns the more you use it. For example, when you watch movies, it remembers what you liked and guesses what to show you next!`);
        }, 1500);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}><Text style={styles.closeTxt}>✕</Text></TouchableOpacity>
                    <Text style={styles.modalTitle}>AI Assistant</Text>
                    
                    {!response && !isLoading && (
                        <>
                            <TextInput 
                               style={styles.aiInput} placeholder="Ask anything about this step..." 
                               placeholderTextColor="#9CA3AF" value={input} onChangeText={setInput} multiline 
                            />
                            
                            <View style={styles.aiActions}>
                                <TouchableOpacity style={styles.askBtn} onPress={() => handleAskAI(false)}>
                                    <Text style={styles.btnTxt}>Ask AI</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.simpleBtn} onPress={() => handleAskAI(true)}>
                                    <Text style={[styles.btnTxt, { color: '#a855f7' }]}>Explain Simpler</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {isLoading && <ActivityIndicator size="large" color="#a855f7" style={{ marginTop: 20 }} />}
                    
                    {response && (
                        <View style={styles.responseBox}>
                            <Text style={styles.responseText}>{response}</Text>
                            <TouchableOpacity style={[styles.askBtn, { marginTop: 15 }]} onPress={() => { setResponse(null); setInput(''); }}>
                                <Text style={styles.btnTxt}>Ask Another</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default function DynamicLessonPage() {
    const { id } = useLocalSearchParams();
    const lesson = lessonsData.find(l => l.id === id);
    const { markModuleComplete } = useProgressStore();

    const [stepIndex, setStepIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [interactionText, setInteractionText] = useState("");
    const [showAI, setShowAI] = useState(false);

    if (!lesson) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <Navbar />
                <Text style={{ color: 'red', margin: 50, fontSize: 20 }}>Lesson not found!</Text>
            </View>
        );
    }

    const step = lesson.steps[stepIndex];
    const isQuizStep = step.type === 'quiz';

    const handleNext = () => {
        if (isQuizStep) {
            // Evaluates and wraps up lesson since Quiz is the final step
            markModuleComplete(lesson.id);
            router.replace('/student-dashboard');
            return;
        }
        
        if (stepIndex < lesson.steps.length - 1) {
            setStepIndex(stepIndex + 1);
            setSelectedOption(null);
            setInteractionText("");
        }
    };

    const handlePrev = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
            setSelectedOption(null);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Navbar />
            
            <View style={styles.bgWrapper}>
                <AntiGravityBackground />
                
                <ScrollView contentContainerStyle={styles.content}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/lessons')}>
                        <Text style={styles.backText}>← Back to Curriculum</Text>
                    </TouchableOpacity>

                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>{lesson.title}</Text>
                        <Text style={styles.stepCounter}>Step {stepIndex + 1} / {lesson.steps.length}</Text>
                    </View>

                    {/* DYNAMIC LEARNING ENGINE RENDERING */}
                    <View style={styles.engineCard}>
                        
                        {step.type === 'explanation' && (
                            <View style={styles.block}>
                                <Text style={styles.blockLabel}>EXPLANATION</Text>
                                <Text style={styles.explanationText}>{step.content}</Text>
                            </View>
                        )}

                        {step.type === 'analogy' && (
                            <View style={[styles.block, styles.analogyBlock]}>
                                <Text style={[styles.blockLabel, { color: '#06B6D4' }]}>ANALOGY</Text>
                                <Text style={styles.analogyText}>{step.content}</Text>
                            </View>
                        )}

                        {step.type === 'interaction' && (
                            <View style={styles.block}>
                                <Text style={[styles.blockLabel, { color: '#F59E0B' }]}>YOUR TURN</Text>
                                <Text style={styles.interactionQuestion}>{step.question}</Text>
                                <TextInput 
                                    style={styles.interactionInput} 
                                    placeholder="Type your thoughts here..." 
                                    placeholderTextColor="#9CA3AF"
                                    value={interactionText}
                                    onChangeText={setInteractionText}
                                    multiline
                                />
                            </View>
                        )}

                        {step.type === 'quiz' && (
                            <View style={styles.block}>
                                <Text style={[styles.blockLabel, { color: '#10B981' }]}>KNOWLEDGE CHECK</Text>
                                <Text style={styles.interactionQuestion}>{step.question}</Text>
                                <View style={styles.optionsList}>
                                    {step.options.map((opt, i) => {
                                        const isSelected = selectedOption === opt;
                                        const isCorrect = selectedOption && opt === step.answer;
                                        const isWrongSelection = isSelected && opt !== step.answer;
                                        
                                        return (
                                            <TouchableOpacity 
                                                key={i} 
                                                style={[
                                                    styles.quizOptionBtn, 
                                                    isSelected && styles.quizOptionSelected,
                                                    isCorrect && { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                                                    isWrongSelection && { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.2)' }
                                                ]}
                                                onPress={() => !selectedOption && setSelectedOption(opt)}
                                                disabled={selectedOption !== null}
                                            >
                                                <Text style={styles.quizOptionText}>{opt}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        )}

                        <TouchableOpacity style={styles.floatAIBtn} onPress={() => setShowAI(true)}>
                            <Text style={styles.floatAIText}>✨ Ask AI</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ENGINE NAVIGATION */}
                    <View style={styles.navRow}>
                        <TouchableOpacity 
                            style={[styles.navBtn, stepIndex === 0 && { opacity: 0.3 }]} 
                            disabled={stepIndex === 0}
                            onPress={handlePrev}
                        >
                            <Text style={styles.navText}>◄ Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[
                                styles.navBtn, 
                                { backgroundColor: '#a855f7' },
                                isQuizStep && selectedOption === null && { opacity: 0.5 }
                            ]} 
                            disabled={isQuizStep && selectedOption === null}
                            onPress={handleNext}
                        >
                            <Text style={[styles.navText, { color: '#FFF' }]}>
                                {isQuizStep ? 'Finish Module' : 'Next Step ►'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>

            <AIAssistantModal visible={showAI} onClose={() => setShowAI(false)} lessonTitle={lesson.title} stepObj={step} />
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  bgWrapper: { flex: 1, position: 'relative' },
  content: { padding: 40, alignItems: 'center' },
  
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { color: '#9CA3AF', fontSize: 16, fontFamily: 'System' },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 750, marginBottom: 20 },
  headerTitle: { fontSize: 32, color: '#F9FAFB', fontWeight: 'bold' },
  stepCounter: { fontSize: 16, color: '#a855f7', fontWeight: 'bold' },

  engineCard: { 
     backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 40, borderRadius: 24, 
     width: '100%', maxWidth: 750, minHeight: 350, justifyContent: 'center',
     borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
     ...(Platform.OS === 'web' && { backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' })
  },
  
  block: { width: '100%' },
  blockLabel: { color: '#a855f7', fontSize: 13, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  
  explanationText: { color: '#E5E7EB', fontSize: 22, lineHeight: 34 },
  
  analogyBlock: { backgroundColor: 'rgba(6, 182, 212, 0.05)', padding: 25, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#06B6D4' },
  analogyText: { color: '#F9FAFB', fontSize: 20, lineHeight: 32, fontStyle: 'italic' },
  
  interactionQuestion: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 25 },
  interactionInput: { 
      backgroundColor: 'rgba(0,0,0,0.3)', color: '#FFF', fontSize: 18, 
      padding: 20, borderRadius: 12, minHeight: 120, textAlignVertical: 'top',
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
      ...(Platform.OS === 'web' && { outlineStyle: 'none' })
  },

  optionsList: { gap: 15 },
  quizOptionBtn: { backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 18, paddingHorizontal: 25, borderRadius: 12 },
  quizOptionText: { color: '#F9FAFB', fontSize: 18 },

  floatAIBtn: { position: 'absolute', top: -15, right: -15, backgroundColor: 'rgba(168, 85, 247, 0.2)', borderWidth: 1, borderColor: '#a855f7', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16 },
  floatAIText: { color: '#a855f7', fontWeight: 'bold' },

  navRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 750, marginTop: 30 },
  navBtn: { backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 12 },
  navText: { color: '#D1D5DB', fontWeight: 'bold', fontSize: 16 },

  // AI Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1E293B', width: '90%', maxWidth: 500, padding: 30, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  closeBtn: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  closeTxt: { color: '#9CA3AF', fontSize: 20, fontWeight: 'bold' },
  modalTitle: { color: '#F9FAFB', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  aiInput: { backgroundColor: 'rgba(0,0,0,0.4)', color: '#FFF', fontSize: 16, padding: 15, borderRadius: 10, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 20, ...(Platform.OS === 'web' && { outlineStyle: 'none' }) },
  aiActions: { flexDirection: 'row', justifyContent: 'space-between' },
  askBtn: { backgroundColor: '#a855f7', padding: 12, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' },
  simpleBtn: { backgroundColor: 'rgba(168, 85, 247, 0.1)', borderWidth: 1, borderColor: '#a855f7', padding: 12, borderRadius: 10, flex: 1, alignItems: 'center' },
  btnTxt: { color: '#FFF', fontWeight: 'bold' },
  responseBox: { backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  responseText: { color: '#E5E7EB', fontSize: 16, lineHeight: 24 }
});
