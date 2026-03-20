import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const ProfileScreen = () => (
  <SafeAreaView style={styles.root}>
    <View style={styles.center}>
      <Text style={styles.icon}>👤</Text>
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.desc}>
        Account settings, saved addresses, payment methods, and KYC documents will appear here.
      </Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8faff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 52, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 10 },
  desc: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 22 },
});

export default ProfileScreen;
