import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { FormField, Header, PrimaryButton } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { useState } from 'react';

export default function LeaveScreen() {
  const colors = useColors();
  const { leaves, addLeave } = useMess();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');
  const submit = () => { if (!from || !to || !reason) { Alert.alert('Complete the request', 'Add dates and a short reason before submitting.'); return; } addLeave(from, to, reason); Alert.alert('Leave submitted', 'Your request is now waiting for owner approval.'); router.back(); };
  return <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled"><Header eyebrow="Meal credits protected" title="Apply for leave" subtitle="Approved days won’t deduct from your meal plan." /><View style={[styles.info, { backgroundColor: colors.secondary }]}><Text style={[styles.infoTitle, { color: colors.primary }]}>A little heads up</Text><Text style={[styles.infoText, { color: colors.secondaryForeground }]}>Submit before you leave. The mess owner will review your request and your credits will stay intact once approved.</Text></View><FormField label="From" value={from} onChangeText={setFrom} placeholder="YYYY-MM-DD" /><FormField label="To" value={to} onChangeText={setTo} placeholder="YYYY-MM-DD" /><FormField label="Reason" value={reason} onChangeText={setReason} placeholder="Family function, travel, etc." /><PrimaryButton label="Submit leave request" icon="send" onPress={submit} /><View style={styles.existing}><Text style={[styles.existingTitle, { color: colors.foreground }]}>Recent requests</Text>{leaves.slice(0, 3).map((leave) => <View key={leave.id} style={[styles.existingRow, { borderColor: colors.border }]}><Text style={[styles.existingDates, { color: colors.foreground }]}>{leave.from} – {leave.to}</Text><Text style={[styles.existingStatus, { color: colors.mutedForeground }]}>{leave.status}</Text></View>)}</View></KeyboardAwareScrollViewCompat>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 40, gap: 18 },
  info: { padding: 16, borderRadius: 17, gap: 5 },
  infoTitle: { fontSize: 14, fontWeight: '700' },
  infoText: { fontSize: 12, lineHeight: 18 },
  existing: { gap: 10, marginTop: 8 },
  existingTitle: { fontSize: 17, fontWeight: '700' },
  existingRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingVertical: 10 },
  existingDates: { fontSize: 13, fontWeight: '600' },
  existingStatus: { fontSize: 12 },
});