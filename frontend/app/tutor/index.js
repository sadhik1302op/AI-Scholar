import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import AntiGravityBackground from '../../components/AntiGravityBackground';

const API_BASE_URL = 'https://ai-scholar-backend.onrender.com'; // Hardcoded per request

export default function AITutorPage() {
   const [messages, setMessages] = useState([
      { id: '1', text: "Hello! I am your AI-Scholar Tutor. How can I help you master Artificial Intelligence today?", sender: "ai" }
   ]);
   const [inputText, setInputText] = useState("");
   const [isTyping, setIsTyping] = useState(false);
   const scrollRef = useRef();

   const handleSend = async () => {
      if (!inputText.trim()) return;
      
      const userText = inputText.trim();
      // Inject User Message Bubble
      const newMsg = { id: Date.now().toString(), text: userText, sender: "user" };
      setMessages(prev => [...prev, newMsg]);
      setInputText("");
      setIsTyping(true);

      try {
         const response = await axios.post(API_BASE_URL + '/api/ai/ask', {
            question: userText
         });
         
         const aiResponse = { 
             id: (Date.now() + 1).toString(), 
             text: response.data.reply || "Sorry, I couldn't understand. Try asking in a simpler way.", 
             sender: "ai" 
         };
         setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
         console.error("AI Error:", error);
         const aiResponse = { 
             id: (Date.now() + 1).toString(), 
             text: "Sorry, I couldn't understand. Try asking in a simpler way.", 
             sender: "ai" 
         };
         setMessages(prev => [...prev, aiResponse]);
      } finally {
         setIsTyping(false);
      }
   };

   return (
      <View style={styles.container}>
         <Stack.Screen options={{ headerShown: false }} />
         <Navbar />
         <View style={styles.bgWrapper}>
            <AntiGravityBackground />
            
            <View style={styles.chatWrapper}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/student-dashboard')}>
                    <Text style={styles.backText}>← Back to Dashboard</Text>
                    <Text style={styles.tutorHeader}>AI Tutor</Text>
                </TouchableOpacity>

                <ScrollView 
                   style={styles.chatContainer} 
                   contentContainerStyle={{ padding: 25, paddingBottom: 50 }}
                   ref={scrollRef}
                   onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map(m => (
                        <View key={m.id} style={[styles.bubble, m.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                            <Text style={[styles.bubbleText, m.sender === 'ai' && { color: '#E5E7EB' }]}>{m.text}</Text>
                        </View>
                    ))}
                    
                    {isTyping && (
                       <View style={[styles.bubble, styles.aiBubble, { width: 80, alignItems: 'center' }]}>
                           <Text style={styles.typingIndicator}>•••</Text>
                       </View>
                    )}
                </ScrollView>

                <View style={styles.inputRow}>
                   <TextInput 
                      style={styles.inputField}
                      placeholder="Ask anything about AI..."
                      placeholderTextColor="#6B7280"
                      value={inputText}
                      onChangeText={setInputText}
                      onSubmitEditing={handleSend}
                   />
                   <TouchableOpacity 
                      style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} 
                         onPress={handleSend} 
                         disabled={!inputText.trim()}
                      >
                      <Text style={styles.sendIcon}>➤</Text>
                   </TouchableOpacity>
                </View>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  bgWrapper: { flex: 1, position: 'relative', alignItems: 'center' },
  
  chatWrapper: { 
     width: '100%', maxWidth: 800, flex: 1, 
     backgroundColor: 'rgba(255, 255, 255, 0.01)', 
     borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', 
     borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 20,
     ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' }) 
  },
  
  backBtn: { padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backText: { color: '#9CA3AF', fontSize: 15, fontWeight: 'bold' },
  tutorHeader: { color: '#F9FAFB', fontSize: 20, fontWeight: '900' },

  chatContainer: { flex: 1 },
  
  bubble: { maxWidth: '80%', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 24, marginBottom: 15 },
  
  userBubble: { 
     alignSelf: 'flex-end', backgroundColor: '#a855f7', 
     borderBottomRightRadius: 5, 
     ...(Platform.OS === 'web' && { boxShadow: '0 5px 15px rgba(168, 85, 247, 0.4)' }) 
  },
  
  aiBubble: { 
     alignSelf: 'flex-start', backgroundColor: 'rgba(255, 255, 255, 0.08)', 
     borderBottomLeftRadius: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' 
  },
  
  bubbleText: { color: '#FFF', fontSize: 16, lineHeight: 24, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  typingIndicator: { color: '#a855f7', fontSize: 24, lineHeight: 24, fontWeight: 'bold', bottom: 4 },

  inputRow: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  
  inputField: { 
     flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', 
     borderRadius: 30, paddingHorizontal: 25, paddingVertical: 15, minHeight: 50,
     color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', 
     ...(Platform.OS === 'web' && { outlineStyle: 'none' }) 
  },
  
  sendBtn: { marginLeft: 15, backgroundColor: '#a855f7', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#FFF', fontSize: 18 }
});
