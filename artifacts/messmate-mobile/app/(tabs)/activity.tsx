import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, PrimaryButton, Screen, SectionHeading } from '@/components/UI';
import { formatDate, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function ActivityScreen() {
  const colors = useColors();
  const { attendance, leaves } = useMess();
  return <Screen><Header eyebrow="Your records" title="Activity" subtitle="A clear view of every meal and leave day." onPress={() => router.push('/(tabs)/profile')} /><View style={styles.stats}><View style={[styles.activityStat, { backgroundColor: colors.secondary }]}><Text style={[styles.activityValue, { color: colors.primary }]}>{attendance.length}</Text><Text style={[styles.activityLabel, { color: colors.mutedForeground }]}>Meals marked</Text></View><View style={[styles.activityStat, { backgroundColor: colors.accent }]}><Text style={[styles.activityValue, { color: colors.accentForeground }]}>{leaves.filter((leave) => leave.status === 'Approved').length}</Text><Text style={[styles.activityLabel, { color: colors.accentForeground }]}>Leaves approved</Text></View></View><SectionHeading title="Recent attendance" /><View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>{attendance.slice(0, 8).map((item, index) => <View key={item.id} style={[styles.recordRow, index < Math.min(attendance.length, 8) - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}><View style={[styles.recordIcon, { backgroundColor: colors.secondary }]}><Ionicons name={item.meal === 'Breakfast' ? 'sunny-outline' : item.meal === 'Lunch' ? 'partly-sunny-outline' : 'moon-outline'} size={17} color={colors.primary} /></View><View style={styles.recordCopy}><Text style={[styles.recordTitle, { color: colors.foreground }]}>{item.meal}</Text><Text style={[styles.recordDetail, { color: colors.mutedForeground }]}>{formatDate(item.date)} · {item.time}</Text></View><Badge label={item.verified ? 'Verified' : 'Saved'} tone={item.verified ? 'green' : 'gray'} /></View>)}</View><SectionHeading title="Leave requests" action="Apply" onPress={() => router.push('/leave')} /><View style={[styles.listCard, { backgroundColor: colors.card, borderColor: colors.border }]}>{leaves.map((leave, index) => <Pressable onPress={() => router.push('/leave')} key={leave.id} style={[styles.leaveRow, index < leaves.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}><View style={styles.leaveCopy}><Text style={[styles.recordTitle, { color: colors.foreground }]}>{formatDate(leave.from)} – {formatDate(leave.to)}</Text><Text style={[styles.recordDetail, { color: colors.mutedForeground }]}>{leave.reason}</Text></View><Badge label={leave.status} tone={leave.status === 'Approved' ? 'green' : leave.status === 'Pending' ? 'amber' : 'red'} /></Pressable>)}</View><PrimaryButton label="Rate a consumed meal" icon="star" secondary onPress={() => router.push('/feedback')} /></Screen>;
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: 10 },
  activityStat: { flex: 1, borderRadius: 18, padding: 16, gap: 5 },
  activityValue: { fontSize: 28, fontWeight: '700' },
  activityLabel: { fontSize: 12, fontWeight: '600' },
  listCard: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13 },
  recordIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  recordCopy: { flex: 1, gap: 3 },
  recordTitle: { fontSize: 14, fontWeight: '700' },
  recordDetail: { fontSize: 11 },
  leaveRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 10 },
  leaveCopy: { flex: 1, gap: 3 },
});