import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Badge, FormField, Header, PrimaryButton, SectionHeading } from '@/components/UI';
import { formatDate, useMess, CustomerPaymentStatus } from '@/context/AppContext';
import { localizedValue } from '@/lib/i18n';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';

export default function CustomersScreen() {
  const colors = useColors();
  const { customers, addCustomer } = useMess();
  const { language, t } = useTranslation();
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<CustomerPaymentStatus>('Paid');

  const add = () => {
    if (!name.trim() || !plan.trim() || !joiningDate.trim() || !expiryDate.trim() || !phone.trim()) {
      Alert.alert(t('completeCustomer'), t('customerRequiredMessage'));
      return;
    }
    addCustomer({ name: name.trim(), plan: plan.trim(), joiningDate: joiningDate.trim(), expiryDate: expiryDate.trim(), phone: phone.trim(), paymentStatus });
    setName('');
    setPlan('');
    setJoiningDate('');
    setExpiryDate('');
    setPhone('');
    setPaymentStatus('Paid');
  };

  return <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled">
    <Header eyebrow={t('ownerTools')} title={t('customerList')} subtitle={t('customerListSubtitle')} onPress={() => router.push('/(tabs)/admin')} />
    <View style={styles.summaryRow}>
      <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}><Ionicons name="people-outline" size={23} color={colors.accent} /><Text style={[styles.summaryValue, { color: colors.primaryForeground }]}>{customers.length}</Text><Text style={[styles.summaryLabel, { color: colors.primaryForeground }]}>{t('customerCount')}</Text></View>
      <View style={[styles.summaryCard, { backgroundColor: colors.accent }]}><Ionicons name="checkmark-circle-outline" size={23} color={colors.accentForeground} /><Text style={[styles.summaryValue, { color: colors.accentForeground }]}>{customers.filter((customer) => customer.paymentStatus === 'Paid').length}</Text><Text style={[styles.summaryLabel, { color: colors.accentForeground }]}>{t('paid')}</Text></View>
    </View>
    <SectionHeading title={t('currentCustomers')} />
    <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {customers.length ? customers.map((customer, index) => <View key={customer.id} style={[styles.customerRow, index < customers.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.secondary }]}><Text style={[styles.avatarText, { color: colors.primary }]}>{customer.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}</Text></View>
        <View style={styles.customerCopy}><View style={styles.nameLine}><Text style={[styles.customerName, { color: colors.foreground }]}>{customer.name}</Text><Badge label={localizedValue(language, customer.paymentStatus)} tone={customer.paymentStatus === 'Paid' ? 'green' : 'amber'} /></View><Text style={[styles.meta, { color: colors.mutedForeground }]}>{customer.plan} · {customer.phone}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{formatDate(customer.joiningDate, language)} – {formatDate(customer.expiryDate, language)}</Text></View>
      </View>) : <View style={styles.empty}><Ionicons name="people-outline" size={28} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{t('noCustomers')}</Text><Text style={[styles.emptyDetail, { color: colors.mutedForeground }]}>{t('noCustomersDetail')}</Text></View>}
    </View>
    <SectionHeading title={t('addCustomer')} />
    <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <FormField label={t('customerName')} value={name} onChangeText={setName} placeholder={t('enterCustomerName')} />
      <FormField label={t('planName')} value={plan} onChangeText={setPlan} placeholder={t('enterPlanName')} />
      <FormField label={t('joiningDate')} value={joiningDate} onChangeText={setJoiningDate} placeholder={t('enterJoiningDate')} />
      <FormField label={t('expiryDate')} value={expiryDate} onChangeText={setExpiryDate} placeholder={t('enterExpiryDate')} />
      <FormField label={t('customerPhone')} value={phone} onChangeText={setPhone} placeholder={t('enterCustomerPhone')} keyboardType="phone-pad" />
      <View style={styles.statusField}><Text style={[styles.statusLabel, { color: colors.foreground }]}>{t('paymentStatus')}</Text><Text style={[styles.statusHint, { color: colors.mutedForeground }]}>{t('choosePaymentStatus')}</Text><View style={styles.statusOptions}>{(['Paid', 'Unpaid'] as CustomerPaymentStatus[]).map((status) => <Pressable key={status} testID={`payment-status-${status.toLowerCase()}`} onPress={() => setPaymentStatus(status)} style={[styles.statusOption, { borderColor: paymentStatus === status ? colors.primary : colors.border, backgroundColor: paymentStatus === status ? colors.secondary : colors.background }]}><Ionicons name={paymentStatus === status ? 'radio-button-on' : 'radio-button-off'} size={18} color={paymentStatus === status ? colors.primary : colors.mutedForeground} /><Text style={[styles.statusOptionText, { color: colors.foreground }]}>{localizedValue(language, status)}</Text></Pressable>)}</View></View>
      <PrimaryButton label={t('addToCustomers')} icon="user-plus" onPress={add} />
    </View>
  </KeyboardAwareScrollViewCompat>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 40, gap: 18 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1, borderRadius: 18, padding: 15, gap: 5 },
  summaryValue: { fontSize: 24, fontWeight: '700', marginTop: 4 },
  summaryLabel: { fontSize: 11, fontWeight: '600', opacity: 0.78 },
  list: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  avatar: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700' },
  customerCopy: { flex: 1, gap: 4 },
  nameLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  customerName: { flex: 1, fontSize: 14, fontWeight: '700' },
  meta: { fontSize: 10 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyDetail: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  formCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 15 },
  statusField: { gap: 7 },
  statusLabel: { fontSize: 13, fontWeight: '700' },
  statusHint: { fontSize: 11 },
  statusOptions: { flexDirection: 'row', gap: 8 },
  statusOption: { flex: 1, minHeight: 45, borderWidth: 1, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  statusOptionText: { fontSize: 13, fontWeight: '700' },
});