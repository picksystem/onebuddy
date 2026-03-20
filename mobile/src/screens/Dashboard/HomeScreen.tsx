import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

const QUICK_ACTIONS = [
  { icon: '🚗', label: 'Ride Now' },
  { icon: '📦', label: 'Parcel' },
  { icon: '🚐', label: 'Driver Hire' },
  { icon: '🔑', label: 'Rental' },
];

const HomeScreen = () => (
  <SafeAreaView style={styles.root}>
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning 👋</Text>
        <Text style={styles.subtitle}>Where are you heading today?</Text>
      </View>

      {/* Search / destination input placeholder */}
      <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
        <Text style={styles.searchIcon}>📍</Text>
        <Text style={styles.searchPlaceholder}>Enter your destination...</Text>
      </TouchableOpacity>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((a) => (
          <TouchableOpacity key={a.label} style={styles.quickCard} activeOpacity={0.8}>
            <Text style={styles.quickIcon}>{a.icon}</Text>
            <Text style={styles.quickLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Coming soon notice */}
      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonTitle}>🚧 Full features coming soon</Text>
        <Text style={styles.comingSoonDesc}>
          Live map, real-time tracking, and booking are under active development.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8faff' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    marginBottom: 28,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { color: '#94a3b8', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 14 },
  quickGrid: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  quickCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  quickIcon: { fontSize: 24, marginBottom: 8 },
  quickLabel: { fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'center' },
  comingSoon: {
    backgroundColor: 'rgba(37,99,235,0.06)',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.15)',
  },
  comingSoonTitle: { fontSize: 14, fontWeight: '700', color: '#1e3a8a', marginBottom: 6 },
  comingSoonDesc: { fontSize: 13, color: '#3b5fa0', lineHeight: 19 },
});

export default HomeScreen;
