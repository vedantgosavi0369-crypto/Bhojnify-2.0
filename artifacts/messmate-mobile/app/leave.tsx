import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Badge, FormField, Header, PrimaryButton, SectionHeading } from '@/components/UI';
import { formatDate, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';
import { localizedValue } from '@/lib/i18n';

export default function LeaveScreen() {
  const colors = useColors();
  const { customers, leaves, addLeave, updateLeaveStatus } = useMess();
  const { language, t } = useTranslation();
  const pendingLeaves = leaves.filter((leave) => leave.status === 'Pending');
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');

  const saveLeave = () => {
    if (!customerId || !from.trim() || !to.trim()) {
      Alert.alert(t('completeLeave'), t('leaveRequiredMessage'));
      return;
    }
    addLeave(customerId, from.trim(), to.trim(), note.trim());
    setCustomerId('');
    setFrom('');
    setTo('');
    setNote('');
    setShowForm(false);
  };

  return <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled">
    <Header eyebrow={t('ownerTools')} title={t('leaveTitle')} subtitle={t('leaveSubtitle')} onPress={() => router.push('/(tabs)/admin')} />
    <View style={[styles.summary, { backgroundColor: colors.secondary }]}><Ionicons name="calendar-outline" size={22} color={colors.primary} /><View style={styles.summaryCopy}><Text style={[styles.summaryTitle, { color: colors.primary }]}>{t('requestWaiting', { count: pendingLeaves.length, plural: pendingLeaves.length === 1 ? '' : 's' })}</Text><Text style={[styles.summaryDetail, { color: colors.secondaryForeground }]}>{t('approvedLeaveDetail')}</Text></View></View>
    <PrimaryButton label={t('addLeave')} icon="plus" onPress={() => setShowForm((visible) => !visible)} />
    {showForm ? <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.formIntro}><Text style={[styles.formTitle, { color: colors.foreground }]}>{t('addLeaveTitle')}</Text><Text style={[styles.formSubtitle, { color: colors.mutedForeground }]}>{t('addLeaveSubtitle')}</Text></View>
      <View style={styles.customerPicker}><Text style={[styles.fieldLabel, { color: colors.foreground }]}>{t('selectCustomer')}</Text>{customers.length ? <View style={styles.customerOptions}>{customers.map((customer) => <Pressable key={customer.id} testID={`select-customer-${customer.id}`} onPress={() => setCustomerId(customer.id)} style={[styles.customerOption, { borderColor: customerId === customer.id ? colors.primary : colors.border, backgroundColor: customerId === customer.id ? colors.secondary : colors.background }]}><View style={styles.customerOptionCopy}><Text style={[styles.customerOptionName, { color: colors.foreground }]}>{customer.name}</Text><Text style={[styles.customerOptionMeta, { color: colors.mutedForeground }]}>{customer.plan} · {localizedValue(language, customer.paymentStatus)}</Text></View><Ionicons name={customerId === customer.id ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={customerId === customer.id ? colors.primary : colors.mutedForeground} /></Pressable>)}</View> : <Pressable onPress={() => router.push('/customers')} style={[styles.noCustomers, { backgroundColor: colors.secondary }]}><Ionicons name="person-add-outline" size={18} color={colors.primary} /><Text style={[styles.noCustomersText, { color: colors.primary }]}>{t('noCustomersForLeave')}</Text></Pressable>}</View>
      <FormField label={t('leaveFrom')} value={from} onChangeText={setFrom} placeholder={t('enterLeaveFrom')} />
      <FormField label={t('leaveTo')} value={to} onChangeText={setTo} placeholder={t('enterLeaveTo')} />
      <FormField label={t('leaveNoteOptional')} value={note} onChangeText={setNote} placeholder={t('enterLeaveNote')} />
      <PrimaryButton label={t('saveLeave')} icon="check" onPress={saveLeave} disabled={!customers.length} />
    </View> : null}
    <SectionHeading title={t('allRequests')} />
    <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {leaves.length ? leaves.map((leave, index) => <View key={leave.id} style={[styles.row, index < leaves.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <View style={styles.copy}><Text style={[styles.customer, { color: colors.foreground }]}>{customers.find((customer) => customer.id === leave.customerId)?.name ?? t('memberLeave')}</Text><Text style={[styles.dates, { color: colors.foreground }]}>{formatDate(leave.from, language)} – {formatDate(leave.to, language)}</Text>{leave.reason ? <Text style={[styles.reason, { color: colors.mutedForeground }]}>{leave.reason}</Text> : null}</View>
        {leave.status === 'Pending' ? <View style={styles.actions}><Pressable testID={`approve-leave-${leave.id}`} onPress={() => updateLeaveStatus(leave.id, 'Approved')} style={[styles.action, { backgroundColor: colors.secondary }]}><Ionicons name="checkmark" size={17} color={colors.primary} /></Pressable><Pressable testID={`decline-leave-${leave.id}`} onPress={() => updateLeaveStatus(leave.id, 'Declined')} style={[styles.action, { backgroundColor: colors.muted }]}><Ionicons name="close" size={17} color={colors.destructive} /></Pressable></View> : <Badge label={localizedValue(language, leave.status)} tone={leave.status === 'Approved' ? 'green' : 'red'} />}
      </View>) : <Text style={[styles.empty, { color: colors.mutedForeground }]}>{t('noLeaveRequests')}</Text>}
    </View>
  </KeyboardAwareScrollViewCompat>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 40, gap: 18 },
  summary: { padding: 16, borderRadius: 18, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  summaryCopy: { flex: 1, gap: 4 },
  summaryTitle: { fontSize: 15, fontWeight: '700' },
  summaryDetail: { fontSize: 12, lineHeight: 18 },
  formCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 15 },
  formIntro: { gap: 4 },
  formTitle: { fontSize: 17, fontWeight: '700' },
  formSubtitle: { fontSize: 12, lineHeight: 18 },
  customerPicker: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '700' },
  customerOptions: { gap: 8 },
  customerOption: { minHeight: 54, borderWidth: 1, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 8 },
  customerOptionCopy: { flex: 1, gap: 3 },
  customerOptionName: { fontSize: 13, fontWeight: '700' },
  customerOptionMeta: { fontSize: 10 },
  noCustomers: { minHeight: 48, borderRadius: 13, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  noCustomersText: { fontSize: 12, fontWeight: '700' },
  list: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  copy: { flex: 1, gap: 4 },
  customer: { fontSize: 13, fontWeight: '700' },
  dates: { fontSize: 14, fontWeight: '700' },
  reason: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 6 },
  action: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  empty: { paddingVertical: 16, fontSize: 12 },
});