import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, RowItem, Screen, SectionHeading } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function ProfileScreen() {
  const colors = useColors();
  const { profile, role, setRole, expiresOn } = useMess();
  const owner = role === 'owner';
  return <Screen><Header eyebrow="Account" title="Profile" subtitle="Your access, preferences, and workspace." /><View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{profile.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</Text></View><View style={styles.profileCopy}><Text style={[styles.profileName, { color: colors.foreground }]}>{owner ? 'Meera Shah' : profile.name}</Text><Text style={[styles.profileDetail, { color: colors.mutedForeground }]}>{owner ? 'Mess owner · Green Bowl Mess' : profile.hostel}</Text></View><Badge label={owner ? 'Owner' : 'Student'} /></View><SectionHeading title="Workspace" /><View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}><RowItem icon="home" title="Student access" detail="Meals, attendance, leaves, and payments" right={<Pressable onPress={() => setRole('student')}><Badge label={!owner ? 'Active' : 'Switch'} tone={!owner ? 'green' : 'gray'} /></Pressable>} /><View style={[styles.divider, { backgroundColor: colors.border }]} /><RowItem icon="briefcase" title="Owner tools" detail="Inventory, menu, staff, expenses, and reports" right={<Pressable onPress={() => setRole('owner')}><Badge label={owner ? 'Active' : 'Switch'} tone={owner ? 'green' : 'gray'} /></Pressable>} /></View><SectionHeading title="Shortcuts" /><View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>{owner ? <><RowItem icon="box" title="Inventory ledger" detail="Manage stock and low-level alerts" onPress={() => router.push('/inventory')} /><RowItem icon="calendar" title="Menu planner" detail="Plan meals four weeks ahead" onPress={() => router.push('/menu')} /><RowItem icon="bar-chart-2" title="Monthly report" detail="Revenue, costs, and operating margin" onPress={() => router.push('/report')} /></> : <><RowItem icon="calendar" title="Leave requests" detail="Protect your meal credits while away" onPress={() => router.push('/leave')} /><RowItem icon="credit-card" title="Payment history" detail={`Plan active through ${expiresOn}`} onPress={() => router.push('/payments')} /><RowItem icon="star" title="Meal feedback" detail="Help the kitchen improve" onPress={() => router.push('/feedback')} /></>}</View><Pressable onPress={() => Alert.alert('MessMate', 'Your local workspace is saved securely on this device.')} style={styles.privacy}><Ionicons name="shield-checkmark-outline" size={17} color={colors.primary} /><Text style={[styles.privacyText, { color: colors.mutedForeground }]}>Privacy & security</Text><Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} /></Pressable></Screen>;
}

const styles = StyleSheet.create({
  profileCard: { borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700' },
  profileCopy: { flex: 1, gap: 3 },
  profileName: { fontSize: 16, fontWeight: '700' },
  profileDetail: { fontSize: 12 },
  menuCard: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  divider: { height: 1 },
  privacy: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, paddingVertical: 4 },
  privacyText: { fontSize: 12, fontWeight: '600' },
});