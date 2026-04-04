import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import Navbar from '../components/Navbar';
import AntiGravityBackground from '../components/AntiGravityBackground';
import useAuthStore from '../store/authStore';

const HoverableButton = ({ onPress, style, hoverStyle, children, disabled }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <TouchableOpacity 
      activeOpacity={disabled ? 1 : 0.8}
      onPress={disabled ? null : onPress}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={[style, isHovered && !disabled && hoverStyle, disabled && { opacity: 0.5 }, Platform.OS === 'web' && { transition: 'all 0.3s ease' }]}
    >
      {children}
    </TouchableOpacity>
  );
};

const FocusableInput = ({ placeholder, secureTextEntry, icon, isPassword, value, onChangeText }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(!secureTextEntry);
    const isActuallySecure = isPassword && !showPassword;

    return (
        <View style={[
            styles.inputWrapper, 
            isFocused && styles.inputFieldFocused,
            Platform.OS === 'web' && { transition: 'box-shadow 0.2s ease, border-color 0.2s ease' }
        ]}>
            {icon && <Text style={[styles.inputIcon, isFocused && {color: '#a855f7', opacity: 1}]}>{icon}</Text>}
            <TextInput 
                style={[styles.inputFieldInner, Platform.OS === 'web' && { outlineStyle: 'none' }]} 
                placeholder={placeholder} 
                placeholderTextColor="#9CA3AF"
                secureTextEntry={isActuallySecure}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {isPassword && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                    <Text style={[styles.eyeIcon, !showPassword && { opacity: 0.4 }]}>👁️</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const PasswordStrengthMeter = ({ password }) => {
  let score = 0;
  if (password.length > 7) score += 25;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score += 25;
  if (password.match(/\d/)) score += 25;
  if (password.match(/[^a-zA-Z\d]/)) score += 25;

  let barColor = '#EF4444'; // Red
  let label = 'Weak';
  if (score === 100) { barColor = '#a855f7'; label = 'Strong'; } // High-tech Purple
  else if (score >= 75) { barColor = '#06B6D4'; label = 'Good'; } // Cyan
  else if (score >= 50) { barColor = '#F59E0B'; label = 'Fair'; } // Orange

  return (
      <View style={styles.meterContainer}>
          <Text style={styles.meterLabel}>Password security: <Text style={{ color: barColor, fontWeight: 'bold' }}>{label}</Text></Text>
          <View style={styles.meterTrack}>
              <Animated.View style={[
                  styles.meterFill, 
                  { width: `${score}%`, backgroundColor: barColor }, 
                  Platform.OS === 'web' && { transition: 'width 0.3s ease, background-color 0.3s ease', boxShadow: `0 0 8px ${barColor}` }
              ]} />
          </View>
      </View>
  );
};

export default function SignupPage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  useEffect(() => { clearError(); }, []);

  const handleSignup = async () => {
      if (!username || !email || !password) return;
      const res = await register(username, email, password);
      if (res.success) {
          if (res.role === 'admin') router.replace('/admin-dashboard');
          else router.replace('/student-dashboard');
      }
  };

  // Smooth Entry Fade Transition & Infinite Animations
  useEffect(() => {
     Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
     
     Animated.loop(
         Animated.sequence([
             Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
             Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true })
         ])
     ).start();

     Animated.loop(
         Animated.sequence([
             Animated.timing(pulseAnim, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
             Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
         ])
     ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Navbar />

      <View style={styles.deepSpaceBackground}>
         <AntiGravityBackground />
         <Animated.View style={[{ flex: 1, width: '100%', opacity: fadeAnim }]}>
           <ScrollView contentContainerStyle={styles.scrollContent}>
               <Animated.View style={[styles.authCard, { transform: [{ translateY: floatAnim }] }]}>
                   
                   <View style={styles.headerLogoContainer}>
                       <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                           <Text style={styles.headerLogo}>🧠</Text>
                       </Animated.View>
                   </View>
                   <Text style={styles.headerTitle}>Create Account</Text>
                   <Text style={styles.headerSubtitle}>Join the next generation of AI Scholars</Text>

                   {error && (
                       <View style={styles.errorBanner}>
                           <Text style={styles.errorText}>⚠️ {error}</Text>
                       </View>
                   )}

                   <View style={styles.formContainer}>
                       <FocusableInput placeholder="John Doe" icon="👤" value={username} onChangeText={setUsername} />
                       <FocusableInput placeholder="name@school.edu" icon="📧" value={email} onChangeText={setEmail} />
                       <FocusableInput 
                          placeholder="••••••••" 
                          secureTextEntry={true} 
                          isPassword={true} 
                          icon="🔒" 
                          value={password}
                          onChangeText={setPassword}
                       />
                       
                       {/* Real-time Validation */}
                       {(password.length > 0) && <PasswordStrengthMeter password={password} />}

                       <HoverableButton 
                          style={[styles.primaryButton, Platform.OS === 'web' && { backgroundImage: 'linear-gradient(90deg, #a855f7, #6366F1)' }]} 
                          hoverStyle={styles.primaryButtonHover}
                          onPress={handleSignup}
                          disabled={isLoading}
                       >
                           {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Sign Up</Text>}
                       </HoverableButton>
                   </View>

                   <View style={styles.socialContainer}>
                        <Text style={styles.socialText}>Or register with</Text>
                        <View style={styles.socialButtonsRow}>
                            <HoverableButton style={styles.socialButton} hoverStyle={styles.socialButtonHover}>
                                <Text style={styles.socialIcon}>G</Text>
                                <Text style={styles.socialButtonText}>Google</Text>
                            </HoverableButton>
                            <HoverableButton style={styles.socialButton} hoverStyle={styles.socialButtonHover}>
                                <Text style={styles.socialIcon}>GH</Text>
                                <Text style={styles.socialButtonText}>GitHub</Text>
                            </HoverableButton>
                        </View>
                   </View>

                   <View style={styles.divider} />
                   
                   <View style={styles.footerContainer}>
                       <Text style={styles.footerText}>Already have an account? </Text>
                       <TouchableOpacity onPress={() => router.push('/login')}>
                           <Text style={styles.footerLink}>Login</Text>
                       </TouchableOpacity>
                   </View>

               </Animated.View>
           </ScrollView>
         </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  deepSpaceBackground: { flex: 1, width: '100%', position: 'relative', backgroundColor: '#0F172A' },
  scrollContent: { flexGrow: 1, minHeight: Platform.OS === 'web' ? '100vh' : '100%', justifyContent: 'center', alignItems: 'center', padding: 20 },

  authCard: {
      width: '100%',
      maxWidth: 460,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }),
      borderRadius: 24, padding: 35, overflow: 'hidden',
      borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', 
      shadowColor: '#000000', shadowOpacity: 0.4, shadowRadius: 60, shadowOffset: { width: 0, height: 20 },
  },
  headerLogoContainer: { alignItems: 'center', marginBottom: 15 },
  headerLogo: { fontSize: 36 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#F9FAFB', marginBottom: 5, textAlign: 'center', fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System', letterSpacing: 1 },
  headerSubtitle: { fontSize: 16, color: 'rgba(110, 86, 207, 0.8)', textAlign: 'center', marginBottom: 25, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System', lineHeight: 22 },
  
  errorBanner: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#EF4444', padding: 12, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  errorText: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
  
  formContainer: { width: '100%' },
  
  inputWrapper: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', 
      borderRadius: 12, paddingHorizontal: 16, marginBottom: 15,
  },
  inputFieldFocused: { 
      borderColor: '#a855f7', 
      backgroundColor: 'rgba(255, 255, 255, 0.08)', 
      ...(Platform.OS === 'web' && { boxShadow: '0 0 8px rgba(168, 85, 247, 0.5)' }) 
  },
  inputIcon: { fontSize: 18, marginRight: 15, color: '#9CA3AF', opacity: 0.6 },
  inputFieldInner: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#FFFFFF', minHeight: 48, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  eyeIconContainer: { padding: 5, marginLeft: 5 },
  eyeIcon: { fontSize: 16, color: '#9CA3AF' },
  
  // Password Meter Styles
  meterContainer: { width: '100%', marginBottom: 15, paddingHorizontal: 5 },
  meterLabel: { color: '#9CA3AF', fontSize: 12, marginBottom: 6, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  meterTrack: { height: 4, width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  meterFill: { height: '100%', borderRadius: 2 },

  primaryButton: { backgroundColor: '#a855f7', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: '#a855f7', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  primaryButtonHover: { transform: [{ translateY: -2 }], shadowOpacity: 0.5, ...(Platform.OS === 'web' && { boxShadow: '0 10px 25px rgba(168,85,247,0.5)' }) },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 25 },
  
  footerContainer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#9CA3AF', fontSize: 14, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  footerLink: { color: '#8B5CF6', fontSize: 14, fontWeight: 'bold', fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },

  // Social & HUD
  socialContainer: { marginTop: 25, width: '100%', alignItems: 'center' },
  socialText: { color: '#9CA3AF', fontSize: 14, marginBottom: 15, fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System' },
  socialButtonsRow: { flexDirection: 'row', gap: 15, width: '100%' },
  socialButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.03)' },
  socialButtonHover: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' },
  socialIcon: { fontSize: 16, color: '#F9FAFB', fontWeight: 'bold', marginRight: 8 },
  socialButtonText: { color: '#F9FAFB', fontSize: 15, fontWeight: '600' }
});
