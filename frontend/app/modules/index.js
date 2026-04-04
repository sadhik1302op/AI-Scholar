import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Navbar from '../../components/Navbar';

export default function ModulesPreviewPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const previewModules = [
    { title: 'AI Basics', desc: 'Understand the fundamental definitions and history of Artificial Intelligence.' },
    { title: 'Machine Learning', desc: 'Discover how computers can learn patterns from massive amounts of data.' },
    { title: 'Data & Algorithms', desc: 'Dive into the fuel and engines that power modern AI systems.' },
    { title: 'AI Ethics', desc: 'Learn about bias, privacy, and how to build responsible AI applications.' },
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
            <Text style={styles.title}>Learning Modules</Text>
            <Text style={styles.subtitle}>Explore our comprehensive curriculum designed for middle schoolers.</Text>
        </View>

        <View style={styles.gridContainer}>
           {previewModules.map((mod, idx) => (
               <PreviewCard key={idx} title={mod.title} description={mod.desc} />
           ))}
        </View>
      </ScrollView>
    </View>
  );
}

const PreviewCard = ({ title, description }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => router.push('/login')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={[styles.card, isHovered && styles.cardHover, Platform.OS === 'web' && { transition: 'transform 0.3s ease, box-shadow 0.3s ease' }]}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.lockIcon}>🔒</Text>
            </View>
            <Text style={styles.cardDesc}>{description}</Text>
            
            <View style={styles.cardFooter}>
                <Text style={styles.loginReqText}>👉 Login to access full lessons</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { paddingBottom: 80, alignItems: 'center' },
  header: {
      paddingVertical: 60,
      paddingHorizontal: 20,
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#1E3A8A'
  },
  title: {
      fontSize: 40,
      fontWeight: '900',
      color: '#FFFFFF',
      fontFamily: Platform.OS === 'web' ? 'Poppins, Inter, sans-serif' : 'System',
      marginBottom: 15
  },
  subtitle: {
      fontSize: 18,
      color: '#E5E7EB',
      fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
      textAlign: 'center',
      maxWidth: 600
  },
  gridContainer: {
      marginTop: -30, // Pull up over the header background
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 30,
      maxWidth: 1200,
      paddingHorizontal: 20
  },
  card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 30,
      width: 350,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      shadowColor: '#111827',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
  },
  cardHover: {
      transform: [{ translateY: -4 }],
      shadowOpacity: 0.1,
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15
  },
  cardTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#111827',
  },
  lockIcon: {
      fontSize: 20,
      color: '#9CA3AF'
  },
  cardDesc: {
      fontSize: 15,
      color: '#4B5563',
      lineHeight: 24,
      marginBottom: 30
  },
  cardFooter: {
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      paddingTop: 15
  },
  loginReqText: {
      color: '#4F46E5', // Indigo
      fontWeight: '600',
      fontSize: 14
  }
});
