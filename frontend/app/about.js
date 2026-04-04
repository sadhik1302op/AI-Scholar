import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import Navbar from '../components/Navbar';

export default function AboutPage() {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.heroStrip}>
            <Text style={styles.title}>About AI-Scholar</Text>
        </View>

        <View style={styles.textDocument}>
            <Text style={styles.heading}>Our Purpose</Text>
            <Text style={styles.paragraph}>
              AI-Scholar is a dedicated interactive platform built to demystify complex computational logic for younger minds. 
              Our goal is to ensure that the next generation isn't just utilizing Artificial Intelligence, but actively understanding how it operates.
            </Text>

            <Text style={styles.heading}>Why AI Literacy?</Text>
            <Text style={styles.paragraph}>
              As AI systems become embedded into everyday applications, understanding concepts like data bias, privacy, and algorithmic structures becomes critical. 
              We focus heavily on integrating ethics into foundational learning so students develop into responsible digital citizens.
            </Text>

            <Text style={styles.heading}>Target Audience</Text>
            <Text style={styles.paragraph}>
              This platform is specifically designed for Middle School students (ages 11–15). 
              We've stripped away advanced mathematical jargon and replaced it with clean, approachable, project-based demonstrations.
            </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { alignItems: 'center', paddingBottom: 100 },
  heroStrip: {
      width: '100%',
      backgroundColor: '#1E3A8A',
      paddingVertical: 60,
      alignItems: 'center'
  },
  title: {
      color: '#FFFFFF',
      fontSize: 36,
      fontWeight: 'bold',
      fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  textDocument: {
      width: '100%',
      maxWidth: 800,
      backgroundColor: '#FFFFFF',
      padding: 50,
      marginTop: -30,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  heading: {
      fontSize: 24,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 15,
      marginTop: 20,
      fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
  },
  paragraph: {
      fontSize: 16,
      lineHeight: 28,
      color: '#4B5563',
      marginBottom: 20
  }
});
