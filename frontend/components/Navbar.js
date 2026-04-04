import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, Animated } from 'react-native';
import { router, usePathname } from 'expo-router';

// Reusable Hoverable Button for Login/Signup
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

// "Anti-Gravity" Hover Nav Link
const HoverableNavLink = ({ onPress, active, children, onHoverChange }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <TouchableOpacity 
      activeOpacity={1}
      onPress={onPress}
      onMouseEnter={() => { setIsHovered(true); onHoverChange && onHoverChange(true); }}
      onMouseLeave={() => { setIsHovered(false); onHoverChange && onHoverChange(false); }}
      style={[
          styles.navLinkContainer, 
          isHovered && styles.navLinkHoverContainer,
          Platform.OS === 'web' && { transition: 'transform 0.3s ease' }
      ]}
    >
      <Text style={[
          styles.navLink, 
          active && styles.navLinkActive, 
          isHovered && styles.navLinkTextHovered,
          Platform.OS === 'web' && { transition: 'all 0.3s ease' }
      ]}>{children}</Text>
      
      {/* Animated Underline */}
      <View style={[
          styles.navLinkUnderline, 
          isHovered && styles.navLinkUnderlineHovered,
          Platform.OS === 'web' && { transition: 'all 0.3s ease' }
      ]} />
    </TouchableOpacity>
  );
};

export default function Navbar({ activeSection, onNavClick }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const currentPath = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Intelligent Pulse State
  const [isAnyNavHovered, setIsAnyNavHovered] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop;
    if (isAnyNavHovered) {
        // Fast pulse when hovering over menu items (gravity interaction)
        loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.25, duration: 400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 400, useNativeDriver: true })
            ])
        );
    } else {
        // Subtle ambient pulse otherwise
        loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 2500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true })
            ])
        );
    }
    loop.start();
    return () => loop.stop();
  }, [isAnyNavHovered]);

  const handleNav = (section) => {
      // Direct users completely back to the homepage URL + exact section anchor if they click a Landing Link from an unconnected Auth Page
      if (currentPath !== '/') {
          router.push(`/?section=${section}`);
      } else {
          if (onNavClick) onNavClick(section);
      }
      setMobileMenuOpen(false); // Close mobile menu on click
  };

  const NavLinks = () => (
    <>
      <HoverableNavLink onHoverChange={setIsAnyNavHovered} active={activeSection === 'home'} onPress={() => handleNav('home')}>Home</HoverableNavLink>
      <HoverableNavLink onHoverChange={setIsAnyNavHovered} active={activeSection === 'modules'} onPress={() => handleNav('modules')}>Modules</HoverableNavLink>
      <HoverableNavLink onHoverChange={setIsAnyNavHovered} active={activeSection === 'about'} onPress={() => handleNav('about')}>About</HoverableNavLink>
      <HoverableNavLink onHoverChange={setIsAnyNavHovered} active={activeSection === 'contact'} onPress={() => handleNav('contact')}>Contact</HoverableNavLink>
    </>
  );

  return (
    <>
      <View style={[styles.navbar, isDesktop && styles.navbarDesktop]}>
        <TouchableOpacity style={styles.logoContainer} onPress={() => handleNav('home')} activeOpacity={0.8}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.logoIcon}>🧠</Text>
            </Animated.View>
            <Text style={styles.logoText}>AI-Scholar</Text>
        </TouchableOpacity>
        
        {isDesktop ? (
          <View style={styles.desktopCenterLinks}>
             <NavLinks />
          </View>
        ) : null}

        <View style={styles.navActions}>
            {isDesktop ? (
              <>
                <HoverableButton onPress={() => router.push('/login')} style={styles.loginButton} hoverStyle={styles.loginButtonHover}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </HoverableButton>
                <HoverableButton onPress={() => router.push('/signup')} style={styles.signupButton} hoverStyle={styles.signupButtonHover}>
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                </HoverableButton>
              </>
            ) : (
                <TouchableOpacity onPress={() => setMobileMenuOpen(!mobileMenuOpen)} style={styles.hamburger}>
                    <Text style={styles.hamburgerIcon}>☰</Text>
                </TouchableOpacity>
            )}
        </View>
      </View>

      {/* Mobile Menu Dropdown */}
      {!isDesktop && mobileMenuOpen && (
        <View style={styles.mobileMenu}>
          <NavLinks />
          <View style={styles.mobileActions}>
            <TouchableOpacity style={styles.mobileLoginBtn} onPress={() => router.push('/login')}>
               <Text style={styles.mobileLoginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileSignupBtn} onPress={() => router.push('/signup')}>
               <Text style={styles.mobileSignupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 70,
    backgroundColor: 'rgba(15, 18, 30, 0.8)', // Deep Navy Glass
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }), 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    position: Platform.OS === 'web' ? 'sticky' : 'relative',
    top: 0,
    zIndex: 100,
  },
  navbarDesktop: { paddingHorizontal: 60 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { fontSize: 30, marginRight: 10 },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F9FAFB', 
    fontFamily: Platform.OS === 'web' ? 'Inter, system-ui, sans-serif' : 'System',
    marginTop: 2, 
  },
  desktopCenterLinks: {
    flexDirection: 'row',
    gap: 30,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -160 }] 
  },
  
  // Anti-Gravity Nav Link
  navLinkContainer: { paddingVertical: 10, paddingHorizontal: 15, position: 'relative', alignItems: 'center' },
  navLinkHoverContainer: { transform: [{ translateY: -3 }] },
  navLink: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e0e0e0',
    fontFamily: Platform.OS === 'web' ? 'Inter, system-ui, sans-serif' : 'System',
  },
  navLinkActive: { color: '#a855f7' },
  navLinkTextHovered: { color: '#a855f7', ...(Platform.OS === 'web' && { textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }) },
  navLinkUnderline: { position: 'absolute', bottom: 5, height: 2, backgroundColor: '#a855f7', width: 0, borderRadius: 2 },
  navLinkUnderlineHovered: { width: '80%' },
  
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  loginButton: {
    paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1, 
    borderColor: 'rgba(168, 85, 247, 0.4)', backgroundColor: 'transparent',
  },
  loginButtonHover: { backgroundColor: 'rgba(168, 85, 247, 0.05)', transform: [{ translateY: -1 }] },
  loginButtonText: {
    color: '#a855f7', fontWeight: '600', fontSize: 15, fontFamily: Platform.OS === 'web' ? 'Inter, system-ui, sans-serif' : 'System',
  },
  signupButton: {
    backgroundColor: '#a855f7', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1, borderColor: '#a855f7', 
  },
  signupButtonHover: { backgroundColor: '#9333ea', borderColor: '#9333ea', transform: [{ translateY: -1 }] },
  signupButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15, fontFamily: Platform.OS === 'web' ? 'Inter, system-ui, sans-serif' : 'System' },
  
  hamburger: { padding: 5 },
  hamburgerIcon: { fontSize: 28, color: '#e0e0e0' },
  
  mobileMenu: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 18, 30, 0.95)',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' }),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    zIndex: 99,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
  },
  mobileActions: {
    flexDirection: 'column',
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  mobileLoginBtn: {
    width: '100%', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#a855f7', alignItems: 'center'
  },
  mobileLoginText: { color: '#a855f7', fontWeight: 'bold' },
  mobileSignupBtn: {
    width: '100%', backgroundColor: '#a855f7', paddingVertical: 12, borderRadius: 8, alignItems: 'center'
  },
  mobileSignupText: { color: '#FFFFFF', fontWeight: 'bold' }
});
