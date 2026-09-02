import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Header, PrimaryButton, Screen, SectionHeading } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function ReportScreen() {
  const colors = useColors();
  const { payments, expenses, inventory, attendance } = useMess();
  const revenue = payments.reduce((sum, item) => sum + item.amount, 0);
  const costs = expenses.reduce((sum, item) => sum + item.amount, 0);
  const margin = revenue - costs;
  const stockValue = inventory.reduce((sum, item) => sum + item.quantity * 100, 0);
  return <Screen><Header eyebrow="Owner tools" title="September report" subtitle="A monthly view of revenue, operating costs, and service health." onPress={() => router.push('/(tabs)/profile')} /><View style={[styles.profitCard, { backgroundColor: colors.primary }]}><View><Text style={[styles.profitLabel, { color: colors.primaryForeground }]}>OPERATING SURPLUS</Text><Text style={[styles.profitValue, { color: colors.primaryForeground }]}>₹{margin.toLocaleString()}</Text><Text style={[styles.profitDetail, { color: colors.primaryForeground }]}>Revenue less logged expenses</Text></View><Ionicons name="trending-up-outline" size={34} color={colors.accent} /></View><View style={styles.statsRow}><View style={[styles.smallStat, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>REVENUE</Text><Text style={[styles.smallValue, { color: colors.foreground }]}>₹{revenue.toLocaleString()}</Text><Badge label="+12%" /></View><View style={[styles.smallStat, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>EXPENSES</Text><Text style={[styles.smallValue, { color: colors.foreground }]}>₹{costs.toLocaleString()}</Text><Badge label="Tracked" tone="gray" /></View></View><SectionHeading title="Service health" /><View style={[styles.healthCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.healthRow}><Text style={[styles.healthLabel, { color: colors.foreground }]}>Meals served</Text><Text style={[styles.healthValue, { color: colors.foreground }]}>{attendance.length + 126}</Text></View><View style={[styles.progressTrack, { backgroundColor: colors.muted }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: '78%' }]} /></View><View style={styles.healthRow}><Text style={[styles.healthLabel, { color: colors.foreground }]}>Stock value estimate</Text><Text style={[styles.healthValue, { color: colors.foreground }]}>₹{stockValue.toLocaleString()}</Text></View><View style={[styles.progressTrack, { backgroundColor: colors.muted }]}><View style={[styles.progressFill, { backgroundColor: colors.accent, width: '54%' }]} /></View><View style={styles.healthRow}><Text style={[styles.healthLabel, { color: colors.foreground }]}>Members renewed</Text><Text style={[styles.healthValue, { color: colors.foreground }]}>92%</Text></View><View style={[styles.progressTrack, { backgroundColor: colors.muted }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: '92%' }]} /></View></View><PrimaryButton label="Manage expenses" icon="edit-3" secondary onPress={() => router.push('/expenses')} /></Screen>;
}

const styles = StyleSheet.create({
  profitCard: { borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profitLabel: { fontSize: 10, letterSpacing: 1.3, fontWeight: '700', opacity: 0.7 },
  profitValue: { fontSize: 33, fontWeight: '700', marginTop: 5 },
  profitDetail: { fontSize: 11, opacity: 0.76, marginTop: 3 },
  statsRow: { flexDirection: 'row', gap: 10 },
  smallStat: { flex: 1, borderWidth: 1, borderRadius: 18, padding: 15, gap: 8 },
  smallLabel: { fontSize: 10, letterSpacing: 1.1, fontWeight: '700' },
  smallValue: { fontSize: 21, fontWeight: '700' },
  healthCard: { borderWidth: 1, borderRadius: 19, padding: 16, gap: 9 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  healthLabel: { fontSize: 13, fontWeight: '600' },
  healthValue: { fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
});