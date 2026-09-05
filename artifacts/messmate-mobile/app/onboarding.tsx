import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { FormField, PrimaryButton } from '@/components/UI';
import { OwnerProfile, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function OnboardingScreen() {
  const colors = useColors();
  const { completeOwnerSetup } = useMess();
  const [name, setName] = useState('');
  const [messName, setMessName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');

  const finishSetup = () => {
    const profile: OwnerProfile = {
      name: name.trim(),
      messName: messName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      email: email.trim(),
    };
    if (!profile.name || !profile.messName || !profile.phone || !profile.location) {
      Alert.alert('Complete your owner profile', 'Name, mess name, phone number, and location are required.');
      return;
    }
    completeOwnerSetup(profile);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled">
      <View style={[styles.brandMark, { backgroundColor: colors.primary }]}><Ionicons name="restaurant-outline" size={28} color={colors.accent} /></View>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>BHOJNIFY · OWNER SETUP</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Run your mess from one calm place.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Set up your local owner workspace. Your details and records stay on this device.</Text>
      <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.formTitle, { color: colors.foreground }]}>Tell us about you</Text>
        <Text style={[styles.formDetail, { color: colors.mutedForeground }]}>Required fields are marked by the button validation.</Text>
        <FormField label="Owner name" value={name} onChangeText={setName} placeholder="e.g. Meera Shah" />
        <FormField label="Mess name" value={messName} onChangeText={setMessName} placeholder="e.g. Green Bowl Mess" />
        <FormField label="Phone number" value={phone} onChangeText={setPhone} placeholder="e.g. +91 98765 43210" keyboardType="numeric" />
        <FormField label="City or location" value={location} onChangeText={setLocation} placeholder="e.g. Pune, Maharashtra" />
        <FormField label="Email (optional)" value={email} onChangeText={setEmail} placeholder="owner@example.com" />
        <PrimaryButton label="Create owner workspace" icon="arrow-right" onPress={finishSetup} />
      </View>
      <View style={styles.localNote}><Ionicons name="lock-closed-outline" size={16} color={colors.primary} /><Text style={[styles.localNoteText, { color: colors.mutedForeground }]}>Local-only setup · no online account is created</Text></View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 46, paddingBottom: 40, gap: 14 },
  brandMark: { width: 58, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  title: { fontSize: 32, lineHeight: 37, fontWeight: '700', letterSpacing: -0.8, maxWidth: 350 },
  subtitle: { fontSize: 14, lineHeight: 21, marginBottom: 7 },
  formCard: { borderWidth: 1, borderRadius: 23, padding: 17, gap: 15 },
  formTitle: { fontSize: 19, fontWeight: '700' },
  formDetail: { fontSize: 12, lineHeight: 17, marginTop: -8 },
  localNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 4 },
  localNoteText: { fontSize: 12, fontWeight: '600' },
});