import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Header, IconTile, PrimaryButton, Screen, SectionHeading, StatCard } from '@/components/UI';
import { formatDate, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomeScreen() {
  const colors = useColors();
  const { profile, inventory, attendance, expenses, payments, reminders, resolveReminder } = useMess();
  const { language, t } = useTranslation();
  const lowStock = inventory.filter((item) => item.quantity <= item.minimum);
  const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const spend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentDate = new Date().toISOString().slice(0, 10);
  const dueReminders = reminders.filter((reminder) => reminder.dueDate <= currentDate);
  const todayLabel = new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : undefined, { weekday: 'long', day: '2-digit', month: 'long' });
  return (
    <Screen>
      <Header eyebrow={`${t('ownerWorkspace')} · ${todayLabel}`} title={t('goodMorning', { name: profile.name || t('owner') })} subtitle={profile.messName || t('herePulse')} onPress={() => router.push('/(tabs)/profile')} />
      {dueReminders.length > 0 ? <View style={[styles.reminderCard, { backgroundColor: colors.accent, borderColor: colors.accent }]}><View style={styles.reminderHeader}><View style={[styles.reminderIcon, { backgroundColor: colors.accentForeground }]}><Ionicons name="notifications-outline" size={18} color={colors.accent} /></View><View style={styles.reminderHeaderCopy}><Text style={[styles.reminderTitle, { color: colors.accentForeground }]}>{t('dueReminders')}</Text><Text style={[styles.reminderDetail, { color: colors.accentForeground }]}>{t('followUpsNeedAttention', { count: dueReminders.length, plural: dueReminders.length === 1 ? '' : 's' })}</Text></View></View>{dueReminders.map((reminder) => <View key={reminder.id} style={[styles.reminderRow, { borderTopColor: colors.accentForeground }]}><View style={styles.reminderCopy}><Text style={[styles.reminderItemTitle, { color: colors.accentForeground }]}>{reminder.title}</Text><Text style={[styles.reminderItemDetail, { color: colors.accentForeground }]}>{reminder.detail} · {formatDate(reminder.dueDate, language)}</Text></View><Pressable testID={`resolve-${reminder.id}`} onPress={() => resolveReminder(reminder.id)} style={[styles.resolveButton, { backgroundColor: colors.accentForeground }]}><Text style={[styles.resolveText, { color: colors.accent }]}>{t('resolve')}</Text></Pressable></View>)}</View> : null}
      <View style={[styles.ownerHero, { backgroundColor: colors.foreground }]}><View style={styles.ownerHeroCopy}><Text style={[styles.ownerKicker, { color: colors.accent }]}>{t('todayAtGlance').toUpperCase()}</Text><Text style={[styles.ownerTitle, { color: colors.card }]}>{t('keepKitchenMoving')}</Text><Text style={[styles.ownerDetail, { color: colors.card }]}>{t('operationsSteady')}</Text></View><Ionicons name="restaurant-outline" size={46} color={colors.accent} /></View>
      <View style={styles.statsRow}><StatCard label={t('mealsServed').toUpperCase()} value={`${attendance.length + 126}`} detail={t('vsLastWeek')} /><StatCard label={t('revenue').toUpperCase()} value={`₹${(revenue / 1000).toFixed(1)}k`} detail={t('thisMonth')} tone="amber" /></View>
      <View style={styles.statsRow}><StatCard label={t('expenses').toUpperCase()} value={`₹${(spend / 1000).toFixed(1)}k`} detail={t('thisMonth')} tone="red" /><StatCard label={t('activeMembers').toUpperCase()} value="148" detail={t('attendanceRate')} /></View>
      <SectionHeading title={t('runMessAction')} />
      <View style={styles.actionGrid}><IconTile icon="cube-outline" label={t('inventory')} onPress={() => router.push('/inventory')} /><IconTile icon="restaurant-outline" label={t('menuPlan')} onPress={() => router.push('/menu')} /><IconTile icon="people-outline" label={t('staff')} onPress={() => router.push('/staff')} /><IconTile icon="bar-chart-outline" label={t('reports')} onPress={() => router.push('/report')} /></View>
      <PrimaryButton label={t('openAdminPanel')} icon="grid" onPress={() => router.push('/(tabs)/admin')} />
      <SectionHeading title={t('needsAttention')} />
      <View style={[styles.attentionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>{lowStock.length > 0 ? <Pressable onPress={() => router.push('/inventory')} style={styles.attentionRow}><View style={[styles.attentionIcon, { backgroundColor: colors.accent }]}><Ionicons name="warning-outline" size={18} color={colors.accentForeground} /></View><View style={styles.attentionCopy}><Text style={[styles.attentionTitle, { color: colors.foreground }]}>{t('belowMinimum', { name: lowStock[0].name })}</Text><Text style={[styles.attentionDetail, { color: colors.mutedForeground }]}>{t('stockLeft', { quantity: lowStock[0].quantity, unit: lowStock[0].unit, minimum: lowStock[0].minimum })}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} /></Pressable> : <Text style={[styles.attentionTitle, { color: colors.foreground }]}>{t('allStockHealthy')}</Text>}<Pressable onPress={() => router.push('/expenses')} style={[styles.attentionRow, { borderTopWidth: 1, borderTopColor: colors.border }]}><View style={[styles.attentionIcon, { backgroundColor: colors.secondary }]}><Ionicons name="cash-outline" size={18} color={colors.primary} /></View><View style={styles.attentionCopy}><Text style={[styles.attentionTitle, { color: colors.foreground }]}>{t('logTodaysExpenses')}</Text><Text style={[styles.attentionDetail, { color: colors.mutedForeground }]}>{t('keepPnlUpdated')}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} /></Pressable></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionGrid: { flexDirection: 'row', gap: 8 },
  ownerHero: { padding: 20, borderRadius: 24, flexDirection: 'row', gap: 12, alignItems: 'center' },
  ownerHeroCopy: { flex: 1, gap: 7 },
  ownerKicker: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4 },
  ownerTitle: { fontSize: 23, fontWeight: '700', letterSpacing: -0.4 },
  ownerDetail: { fontSize: 12, lineHeight: 17, opacity: 0.75 },
  statsRow: { flexDirection: 'row', gap: 10 },
  attentionCard: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  attentionRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 14 },
  attentionIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  attentionCopy: { flex: 1, gap: 3 },
  attentionTitle: { fontSize: 14, fontWeight: '700' },
  attentionDetail: { fontSize: 12 },
  reminderCard: { borderRadius: 20, borderWidth: 1, padding: 14, gap: 11 },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reminderIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reminderHeaderCopy: { flex: 1, gap: 2 },
  reminderTitle: { fontSize: 15, fontWeight: '700' },
  reminderDetail: { fontSize: 12, opacity: 0.78 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 11, borderTopWidth: 1 },
  reminderCopy: { flex: 1, gap: 3 },
  reminderItemTitle: { fontSize: 13, fontWeight: '700' },
  reminderItemDetail: { fontSize: 11, opacity: 0.78 },
  resolveButton: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  resolveText: { fontSize: 11, fontWeight: '700' },
});