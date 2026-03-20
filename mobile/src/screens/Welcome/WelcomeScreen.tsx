import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

// ── Feature cards shown below the hero ───────────────────────────────────────
const FEATURES = [
  { icon: '🚗', title: 'Ride Booking',     desc: 'Book rides instantly across 7 vehicle types' },
  { icon: '👨‍✈️', title: 'Captain App',    desc: 'Dedicated driver app with live navigation' },
  { icon: '📦', title: 'Parcel Delivery',  desc: 'Same-day delivery, track in real time' },
  { icon: '🚐', title: 'Driver Hire',      desc: 'Hire a driver for your own vehicle by the day' },
  { icon: '🔑', title: 'Vehicle Rental',   desc: 'Self-drive rentals with flexible bundles' },
  { icon: '🔒', title: 'Secure & Fast',    desc: 'JWT auth, refresh tokens, end-to-end encrypted' },
];

// ── Stats shown in the hero ───────────────────────────────────────────────────
const STATS = [
  { value: '20+', label: 'Cities' },
  { value: '7',   label: 'Vehicle Types' },
  { value: '5',   label: 'Services' },
];

/**
 * WelcomeScreen — first screen customers see when they open the app.
 *
 * Structure:
 *   Hero  →  Stats row  →  Feature grid  →  CTA buttons
 */
const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle='light-content' backgroundColor='#0f172a' />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <View style={styles.hero}>
          {/* Decorative orbs */}
          <View style={styles.orb1} />
          <View style={styles.orb2} />

          {/* Brand */}
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>🚀</Text>
            </View>
            <View>
              <Text style={styles.brandName}>OneBuddy</Text>
              <Text style={styles.brandTagline}>MOBILITY PLATFORM</Text>
            </View>
          </View>

          {/* Live badge */}
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Now Live in 20+ Cities</Text>
          </View>

          {/* Headline */}
          <Text style={styles.heroTitle}>
            Your City,{'\n'}
            <Text style={styles.heroTitleAccent}>Your Ride.</Text>
          </Text>

          {/* Sub-headline */}
          <Text style={styles.heroSubtitle}>
            Rides · Driver Hire · Vehicle Rental · Parcel Delivery.
            One app, every mobility need.
          </Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {STATS.map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Feature grid ─────────────────────────────────────────────────── */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionLabel}>PLATFORM FEATURES</Text>
          <Text style={styles.sectionTitle}>Everything You Need</Text>

          <View style={styles.featureGrid}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Port reference (dev info) ─────────────────────────────────────── */}
        <View style={styles.portBox}>
          <Text style={styles.portBoxTitle}>Developer Ports</Text>
          <Text style={styles.portLine}>API (Express)       :3001</Text>
          <Text style={styles.portLine}>Admin Web           :1600</Text>
          <Text style={styles.portLine}>Captain Web Preview :1700</Text>
          <Text style={styles.portLine}>Customer Web Preview:1800</Text>
          <Text style={styles.portLine}>Mobile Metro        :8081</Text>
          <Text style={styles.portLine}>PostgreSQL          :5432</Text>
          <Text style={styles.portLine}>Redis               :6379</Text>
        </View>

        {/* ── CTA buttons ──────────────────────────────────────────────────── */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Get Started — It's Free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.85}>
            <Text style={styles.btnSecondaryText}>Sign In to Your Account</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 OneBuddy · All rights reserved</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  scroll: {
    flexGrow: 1,
  },

  // Hero
  hero: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    overflow: 'hidden',
  },

  orb1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(99,102,241,0.12)',
  },

  orb2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59,130,246,0.1)',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },

  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandIconText: {
    fontSize: 22,
  },

  brandName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  brandTagline: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 20,
    gap: 7,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },

  liveBadgeText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },

  heroTitle: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 14,
  },

  heroTitleAccent: {
    color: '#60a5fa',
  },

  heroSubtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 32,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 0,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: 4,
  },

  statValue: {
    color: '#60a5fa',
    fontSize: 22,
    fontWeight: '900',
  },

  statLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.3,
  },

  // Features section
  featuresSection: {
    backgroundColor: '#f8faff',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 28,
  },

  sectionLabel: {
    textAlign: 'center',
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  sectionTitle: {
    textAlign: 'center',
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 24,
  },

  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  featureCard: {
    width: (width - 40 - 12) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  featureIcon: {
    fontSize: 26,
    marginBottom: 10,
  },

  featureTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  featureDesc: {
    color: '#64748b',
    fontSize: 11,
    lineHeight: 16,
  },

  // Port reference box
  portBox: {
    backgroundColor: '#0f172a',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  portBoxTitle: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },

  portLine: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 22,
  },

  // CTA
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: '#f8faff',
  },

  btnPrimary: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },

  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  btnSecondary: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },

  btnSecondaryText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '700',
  },

  // Footer
  footer: {
    backgroundColor: '#f8faff',
    paddingVertical: 20,
    alignItems: 'center',
  },

  footerText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});

export default WelcomeScreen;
