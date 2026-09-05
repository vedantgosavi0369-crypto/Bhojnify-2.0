import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, Screen, SectionHeading } from '@/components/UI';
import { formatDate, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function LeaveScreen() {
  const colors = useColors();
  const { leaves, updateLeaveStatus } = useMess();
  const pendingLeaves = leaves.filter((leave) => leave.status === 'Pending');

  return <Screen>
    <Header eyebrow="Owner tools" title="Leave approvals" subtitle="Review member leave requests and keep meal planning accurate." onPress={() => router.push('/(tabs)/admin')} />
    <View style={[styles.summary, { backgroundColor: colors.secondary }]}><Ionicons name="calendar-outline" size={22} color={colors.primary} /><View style={styles.summaryCopy}><Text style={[styles.summaryTitle, { color: colors.primary }]}>{pendingLeaves.length} request{pendingLeaves.length === 1 ? '' : 's'} waiting</Text><Text style={[styles.summaryDetail, { color: colors.secondaryForeground }]}>Approved leave can be reflected in your local member records.</Text></View></View>
    <SectionHeading title="All requests" />
    <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {leaves.length ? leaves.map((leave, index) => <View key={leave.id} style={[styles.row, index < leaves.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <View style={styles.copy}><Text style={[styles.dates, { color: colors.foreground }]}>{formatDate(leave.from)} – {formatDate(leave.to)}</Text><Text style={[styles.reason, { color: colors.mutedForeground }]}>{leave.reason}</Text></View>
        {leave.status === 'Pending' ? <View style={styles.actions}><Pressable testID={`approve-leave-${leave.id}`} onPress={() => updateLeaveStatus(leave.id, 'Approved')} style={[styles.action, { backgroundColor: colors.secondary }]}><Ionicons name="checkmark" size={17} color={colors.primary} /></Pressable><Pressable testID={`decline-leave-${leave.id}`} onPress={() => updateLeaveStatus(leave.id, 'Declined')} style={[styles.action, { backgroundColor: colors.muted }]}><Ionicons name="close" size={17} color={colors.destructive} /></Pressable></View> : <Badge label={leave.status} tone={leave.status === 'Approved' ? 'green' : 'red'} />}
      </View>) : <Text style={[styles.empty, { color: colors.mutedForeground }]}>No leave requests have been recorded.</Text>}
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  summary: { padding: 16, borderRadius: 18, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  summaryCopy: { flex: 1, gap: 4 },
  summaryTitle: { fontSize: 15, fontWeight: '700' },
  summaryDetail: { fontSize: 12, lineHeight: 18 },
  list: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14 },
  copy: { flex: 1, gap: 4 },
  dates: { fontSize: 14, fontWeight: '700' },
  reason: { fontSize: 12 },
  actions: { flexDirection: 'row', gap: 6 },
  action: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  empty: { paddingVertical: 16, fontSize: 12 },
});