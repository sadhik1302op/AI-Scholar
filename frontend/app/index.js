import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform, Animated, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Navbar from '../components/Navbar';
import AntiGravityBackground from '../components/AntiGravityBackground';

// Helper for hover animations
const HoverableButton = ({ onPress, style, hoverStyle, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={[style, isHovered && hoverStyle, Platform.OS === 'web' && { transition: 'all 0.3s ease' }]}
    >
      {children}
    </TouchableOpacity>
  );
};

// Web-only keyframes injection 
const WebStyles = () => {
    if (Platform.OS !== 'web') return null;
    return (
        <style>
            {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(8px); }
            }
            html { scroll-behavior: smooth; }
            `}
        </style>
    );
};

export default function SinglePageLanding() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { section } = useLocalSearchParams();

  const scrollViewRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  const sectionLayouts = useRef({ home: 0, modules: 0, about: 0, contact: 0 });

  useEffect(() => {
     if (section && sectionLayouts.current[section] !== undefined) {
         // Slight timeout to ensure layout has propagated before scrolling
         setTimeout(() => scrollToSection(section), 200);
     }
  }, [section]);

  const bounceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
     if (Platform.OS !== 'web') {
         Animated.loop(Animated.sequence([
              Animated.timing(bounceAnim, { toValue: 8, duration: 750, useNativeDriver: true }),
              Animated.timing(bounceAnim, { toValue: 0, duration: 750, useNativeDriver: true })
         ])).start();
     }
  }, []);

  // Handle smooth scroll triggers from Navbar
  const scrollToSection = (sectionId) => {
      const y = sectionLayouts.current[sectionId];
      if (scrollViewRef.current && y !== undefined) {
          scrollViewRef.current.scrollTo({ y, animated: true });
          setActiveSection(sectionId);
      }
  };

  // ScrollSpy equivalent to highlight navbar based on exact scroll position
  const handleScroll = (event) => {
      const scrollY = event.nativeEvent.contentOffset.y;
      const threshold = scrollY + 150; 
      
      let currentSection = 'home';
      if (threshold >= sectionLayouts.current.contact) {
          currentSection = 'contact';
      } else if (threshold >= sectionLayouts.current.about) {
          currentSection = 'about';
      } else if (threshold >= sectionLayouts.current.modules) {
          currentSection = 'modules';
      }

      if (currentSection !== activeSection) {
          setActiveSection(currentSection);
      }
  };

  return (
    <View style={styles.container}>
      <WebStyles />

      {/* FIXED NAVBAR */}
      <Navbar activeSection={activeSection} onNavClick={scrollToSection} />

      {/* GLOBAL 3D BACKGROUND */}
      <View style={styles.fixedBackground}>
          <AntiGravityBackground />
      </View>

      <ScrollView 
         ref={scrollViewRef}
         contentContainerStyle={styles.contentContainer}
         onScroll={handleScroll}
         scrollEventThrottle={16}
      >
        
        {/* === SECTION 1: HOME (HERO) === */}
        <View onLayout={(e) => sectionLayouts.current.home = e.nativeEvent.layout.y}>
            <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
                <View style={styles.heroOverlay} />
                <View style={styles.heroTextContainer}>
                    <Text style={styles.title}>Learn Artificial Intelligence the Smart Way</Text>
                    <Text style={styles.description}>
                    Interactive AI lessons, real-world demonstrations, quizzes, and a smart AI tutor designed for middle school students.
                    </Text>
                    
                    <View style={[styles.heroButtonsContainer, isDesktop && styles.heroButtonsDesktop]}>
                        <HoverableButton onPress={() => router.push('/signup')} style={styles.primaryActionButton} hoverStyle={styles.primaryActionHover}>
                            <Text style={styles.primaryActionButtonText}>Start Learning</Text>
                        </HoverableButton>
                        <HoverableButton onPress={() => scrollToSection('modules')} style={styles.secondaryActionButton} hoverStyle={styles.secondaryActionHover}>
                            <Text style={styles.secondaryActionButtonText}>Explore Modules</Text>
                        </HoverableButton>
                    </View>

                    {isDesktop && (
                    <Animated.View style={[styles.scrollIndicator, Platform.OS !== 'web' && { transform: [{ translateY: bounceAnim }] }]}>
                        <Text style={[styles.scrollArrow, Platform.OS === 'web' && { animation: 'bounce 1.5s infinite' }]}>↓</Text>
                    </Animated.View>
                    )}
                </View>
            </View>
        </View>


        {/* === SECTION 2: MODULES PREVIEW === */}
        <View onLayout={(e) => sectionLayouts.current.modules = e.nativeEvent.layout.y} style={styles.modulesSection}>
           <View style={styles.sectionInner}>
               <Text style={styles.sectionLabel}>PROGRAM</Text>
               <Text style={styles.sectionHeading}>Program Modules</Text>
               <Text style={styles.sectionSubheading}>A comprehensive curriculum bridging the gap between curiosity and technical understanding.</Text>
               
               <View style={styles.gridContainer}>
                  {[
                    { title: 'AI Basics', desc: 'Understand the fundamental definitions and history of Artificial Intelligence.' },
                    { title: 'Machine Learning', desc: 'Discover how computers can learn patterns from massive amounts of data.' },
                    { title: 'Data & Algorithms', desc: 'Dive into the fuel and engines that power modern AI systems.' },
                    { title: 'AI Ethics', desc: 'Learn about bias, privacy, and how to build responsible AI applications.' },
                  ].map((mod, idx) => (
                      <ModulePreviewCard key={idx} title={mod.title} description={mod.desc} />
                  ))}
               </View>
           </View>
        </View>


        {/* === SECTION 3: ABOUT (Redesigned Card Layout) === */}
        <View onLayout={(e) => sectionLayouts.current.about = e.nativeEvent.layout.y} style={styles.aboutSection}>
           <View style={styles.sectionInner}>
               <Text style={styles.sectionLabel}>ABOUT</Text>
               <Text style={styles.sectionHeading}>About AI-Scholar</Text>
               
               <View style={isDesktop ? styles.aboutCardsDesktop : styles.aboutCardsMobile}>
                   <HoverableAboutCard 
                      title="Our Purpose" 
                      desc="Demystify complex computational logic and ensure the next generation builds AI, not just consumes it."
                   />
                   <HoverableAboutCard 
                      title="Why AI Literacy?" 
                      desc="Understanding concepts like data bias and algorithms is critical for responsible technology usage."
                   />
                   <HoverableAboutCard 
                      title="Target Audience" 
                      desc="Designed for Middle Schoolers (11–15) by removing complex math and focusing on interactive projects."
                   />
               </View>
            </View>
        </View>


        {/* === SECTION 4: CONTACT === */}
        <View onLayout={(e) => sectionLayouts.current.contact = e.nativeEvent.layout.y} style={styles.contactSection}>
           <View style={styles.sectionInner}>
               <Text style={styles.sectionLabel}>CONTACT</Text>
               <Text style={styles.sectionHeading}>Get in Touch</Text>
               <Text style={styles.sectionSubheading}>Have a question or want to report an issue? Reach out to the maintainers below!</Text>
               
               <View style={styles.splitLayout}>
                    <View style={styles.projectInfoCol}>
                        <Text style={styles.infoLabel}>Developer</Text>
                        <Text style={styles.infoValue}>Project Creator</Text>
                        
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>admin@ai-scholar.edu</Text>

                        <Text style={styles.infoLabel}>Institution</Text>
                        <Text style={styles.infoValue}>Academic Technology Lab</Text>
                    </View>

                    <View style={styles.formCol}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <FocusableTextInput placeholder="John Doe" />

                        <Text style={styles.inputLabel}>Email</Text>
                        <FocusableTextInput placeholder="john@student.edu" />

                        <Text style={styles.inputLabel}>Message</Text>
                        <FocusableTextInput placeholder="How can we help?" multiline={true} dynamicHeight={120} />

                        <HoverableButton style={styles.submitButton} hoverStyle={{backgroundColor: '#9333ea', transform: [{ translateY: -2 }]}}>
                            <Text style={styles.submitText}>Send Message</Text>
                        </HoverableButton>
                    </View>
                </View>
            </View>
        </View>

      </ScrollView>
    </View>
  );
}

// Subcomponents
const ModulePreviewCard = ({ title, description }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={() => router.push('/login')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={[styles.moduleCard, isHovered && styles.moduleCardHover, Platform.OS === 'web' && { transition: 'transform 0.3s ease, box-shadow 0.3s ease' }]}
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
    );
};

const HoverableAboutCard = ({ title, desc }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    return (
        <TouchableOpacity 
            activeOpacity={1} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={[
                styles.aboutCard, 
                isHovered && styles.aboutCardHover, 
                Platform.OS === 'web' && { transition: 'all 0.3s ease' }
            ]}
        >
            <Text style={[styles.aboutCardTitle, isHovered && { color: '#06B6D4' }]}>{title}</Text>
            <Text style={styles.aboutCardDesc}>{desc}</Text>
        </TouchableOpacity>
    );
};

const FocusableTextInput = ({ placeholder, multiline = false, dynamicHeight = 48 }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
      <TextInput 
          style={[
              styles.inputField, 
              { minHeight: dynamicHeight },
              multiline && { textAlignVertical: 'top' },
              isFocused && styles.inputFieldFocused,
              Platform.OS === 'web' && { transition: 'box-shadow 0.2s ease, border-color 0.2s ease', outlineStyle: 'none' }
          ]} 
          multiline={multiline}
          placeholder={placeholder} 
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
      />
  )
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  fixedBackground: { ...StyleSheet.absoluteFillObject, position: Platform.OS === 'web' ? 'fixed' : 'absolute', zIndex: -1 },
  contentContainer: { paddingBottom: 0 }, 
  
  /* Shared Uniform Section Alignment rules */
  sectionInner: { width: '100%', maxWidth: 1200, alignSelf: 'center', alignItems: 'center', paddingHorizontal: 20 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#06B6D4', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontFamily: Platform.OS === 'web' ? 'Inter, system-ui, sans-serif' : 'System' },
  sectionHeading: { fontSize: 36, fontWeight: '900', color: '#F9FAFB', marginBottom: 15, textAlign: 'center', fontFamily: Platform.OS === 'web' ? 'Poppins, Inter, sans-serif' : 'System' },
  sectionSubheading: { fontSize: 18, color: '#9CA3AF', textAlign: 'center', marginBottom: 50, paddingHorizontal: 20 },

  /* Hero Section */
  hero: { width: '100%', paddingVertical: 100, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: Platform.OS === 'web' ? '90vh' : 600 },
  heroDesktop: { paddingVertical: 140 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.3)' },
  heroTextContainer: { maxWidth: 900, alignItems: 'center', textAlign: 'center', zIndex: 1 },
  title: { fontSize: 48, lineHeight: 58, fontWeight: '800', color: '#FFFFFF', marginBottom: 20, textAlign: 'center', fontFamily: Platform.OS === 'web' ? 'Poppins, Inter, system-ui, sans-serif' : 'System' },
  description: { fontSize: 20, lineHeight: 32, color: '#E0E0E0', textAlign: 'center', marginBottom: 40, maxWidth: 700, fontFamily: Platform.OS === 'web' ? 'Inter, system-ui, sans-serif' : 'System' },
  heroButtonsContainer: { flexDirection: 'column', width: '100%', maxWidth: 300, gap: 24, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  heroButtonsDesktop: { flexDirection: 'row', maxWidth: 600 },
  primaryActionButton: { backgroundColor: '#a855f7', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#a855f7', shadowOpacity: 0.4, shadowRadius: 15, shadowOffset: { height: 6, width: 0 }, flex: 1, minWidth: 180 },
  primaryActionHover: { backgroundColor: '#9333ea', transform: [{ translateY: -2 }], shadowOpacity: 0.6 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  secondaryActionButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#a855f7', paddingVertical: 16, paddingHorizontal: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flex: 1, minWidth: 180 },
  secondaryActionHover: { backgroundColor: 'rgba(168, 85, 247, 0.1)', transform: [{ translateY: -2 }] },
  secondaryActionButtonText: { color: '#a855f7', fontSize: 16, fontWeight: '600' },
  scrollIndicator: { marginTop: 60, opacity: 0.8 },
  scrollArrow: { color: '#a855f7', fontSize: 24, fontWeight: '300' },

  /* Modules Section */
  modulesSection: { paddingVertical: 80, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 30, width: '100%' },
  moduleCard: { 
      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
      ...(Platform.OS === 'web' && { backdropFilter: 'blur(12px)' }),
      borderRadius: 12, padding: 30, width: '100%', maxWidth: 350, 
      borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderTopWidth: 4, borderTopColor: '#a855f7', 
      shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } 
  },
  moduleCardHover: { transform: [{ translateY: -4 }], shadowOpacity: 0.8, borderColor: 'rgba(168, 85, 247, 0.3)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#F9FAFB' },
  lockIcon: { fontSize: 20, color: '#9CA3AF' },
  cardDesc: { fontSize: 15, color: '#9CA3AF', lineHeight: 24, marginBottom: 30 },
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)', paddingTop: 15 },
  loginReqText: { color: '#a855f7', fontWeight: '600', fontSize: 14 },

  /* About Section Redesign (Glassmorphism Card UI) */
  aboutSection: { paddingVertical: 80, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  aboutCardsDesktop: { flexDirection: 'row', justifyContent: 'center', gap: 30, width: '100%' },
  aboutCardsMobile: { flexDirection: 'column', width: '100%', maxWidth: 400, gap: 30 },
  aboutCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 40, borderRadius: 16, flex: 1,
      ...(Platform.OS === 'web' && { backdropFilter: 'blur(12px)' }),
      borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderTopWidth: 4, borderTopColor: '#06B6D4',
      shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }
  },
  aboutCardHover: {
      borderColor: '#06B6D4', transform: [{ translateY: -6 }, { scale: 1.02 }], shadowOpacity: 0.8, shadowRadius: 25
  },
  aboutCardTitle: { fontSize: 22, fontWeight: '800', color: '#F9FAFB', marginBottom: 15, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  aboutCardDesc: { fontSize: 16, color: '#9CA3AF', lineHeight: 26, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },

  /* Contact Section */
  contactSection: { paddingVertical: 80, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  splitLayout: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', width: '100%', gap: 50 },
  projectInfoCol: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', ...(Platform.OS === 'web' && { backdropFilter: 'blur(12px)' }), padding: 40, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#a855f7', justifyContent: 'center' },
  infoLabel: { fontSize: 13, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  infoValue: { fontSize: 18, color: '#F9FAFB', fontWeight: 'bold', marginBottom: 30 },
  formCol: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', ...(Platform.OS === 'web' && { backdropFilter: 'blur(12px)' }), padding: 40, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#e0e0e0', marginBottom: 8 },
  inputField: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15, marginBottom: 20, color: '#F9FAFB' },
  inputFieldFocused: { borderColor: '#a855f7', backgroundColor: 'rgba(255, 255, 255, 0.08)', ...(Platform.OS === 'web' && { boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)' }) },
  submitButton: { backgroundColor: '#a855f7', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, shadowColor: '#a855f7', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  submitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
});
