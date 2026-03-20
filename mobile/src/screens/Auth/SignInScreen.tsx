import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignInScreen = ({ navigation }: Props) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle='dark-content' backgroundColor='#f8faff' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your OneBuddy account</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter your mobile number'
              keyboardType='phone-pad'
              value={mobile}
              onChangeText={setMobile}
              placeholderTextColor='#94a3b8'
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder='Enter your password'
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor='#94a3b8'
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => navigation.replace('Dashboard')}
              activeOpacity={0.85}>
              <Text style={styles.submitText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8faff' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  backBtn: { marginBottom: 24 },
  backText: { color: '#2563eb', fontSize: 14, fontWeight: '600' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -0.8, marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748b' },
  form: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8, marginBottom: 24 },
  forgotText: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: '#64748b', fontSize: 14 },
  footerLink: { color: '#2563eb', fontSize: 14, fontWeight: '700' },
});

export default SignInScreen;
