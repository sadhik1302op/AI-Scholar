import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TextInput, TouchableOpacity } from 'react-native';
import Navbar from '../components/Navbar';

export default function ContactPage() {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.splitLayout}>
            {/* Info Section */}
            <View style={styles.infoCol}>
                <Text style={styles.title}>Get in Touch</Text>
                <Text style={styles.description}>
                    Have a question regarding the academic material or want to report an issue with the AI demonstrations? 
                    Reach out to the project maintainers below!
                </Text>

                <View style={styles.projectInfo}>
                    <Text style={styles.infoLabel}>Developer</Text>
                    <Text style={styles.infoValue}>Project Creator</Text>
                    
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>admin@ai-scholar.edu</Text>

                    <Text style={styles.infoLabel}>Institution</Text>
                    <Text style={styles.infoValue}>Academic Technology Lab</Text>
                </View>
            </View>

            {/* Form Section */}
            <View style={styles.formCol}>
                <Text style={styles.formTitle}>Send a Message</Text>
                
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput style={styles.inputField} placeholder="John Doe" />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput style={styles.inputField} placeholder="john@student.edu" />

                <Text style={styles.inputLabel}>Message</Text>
                <TextInput 
                    style={[styles.inputField, { height: 120, textAlignVertical: 'top' }]} 
                    multiline 
                    placeholder="How can we help?" 
                />

                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitText}>Send Message</Text>
                </TouchableOpacity>
            </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentContainer: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 20 },
  splitLayout: {
      flexDirection: Platform.OS === 'web' && window.innerWidth > 768 ? 'row' : 'column',
      width: '100%',
      maxWidth: 1000,
      gap: 50,
  },
  infoCol: { flex: 1 },
  title: {
      fontSize: 40,
      fontWeight: '900',
      color: '#111827',
      marginBottom: 15,
      fontFamily: Platform.OS === 'web' ? 'Poppins, sans-serif' : 'System',
  },
  description: {
      fontSize: 16,
      color: '#4B5563',
      lineHeight: 26,
      marginBottom: 40
  },
  projectInfo: {
      backgroundColor: '#F9FAFB',
      padding: 30,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#4F46E5'
  },
  infoLabel: { fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#111827', fontWeight: 'bold', marginBottom: 20 },
  
  formCol: { 
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 40,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 15,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#E5E7EB'
  },
  formTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 25 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputField: {
      backgroundColor: '#F9FAFB',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 15,
      marginBottom: 20
  },
  submitButton: {
      backgroundColor: '#4F46E5',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10
  },
  submitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});
