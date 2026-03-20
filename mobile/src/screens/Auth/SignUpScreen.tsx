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

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join OneBuddy and start your journey</Text>
          </View>

          <View style={styles.form}>
            {[
              { label: 'Full Name',      value: name,     set: setName,     placeholder: 'Enter your full name',     keyboardType: 'default' as const,       secure: false },
              { label: 'Mobile Number',  value: mobile,   set: setMobile,   placeholder: 'Enter your mobile number',  keyboardType: 'phone-pad' as const,     secure: false },
              { label: 'Email Address',  value: email,    set: setEmail,    placeholder: 'Enter your email',          keyboardType: 'email-address' as const, secure: false },
              { label: 'Password',       value: password, set: setPassword, placeholder: 'Create a strong password',  keyboardType: 'default' as const,       secure: true  },
            ].map((field) => (
              <View key={field.label}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  keyboardType={field.keyboardType}
                  secureTextEntry={field.secure}
                  value={field.value}
                  onChangeText={field.set}
                  placeholderTextColor='#94a3b8'
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => navigation.replace('Dashboard')}
              activeOpacity={0.85}>
              <Text style={styles.submitText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
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

export default SignUpScreen;
