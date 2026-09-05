import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, RowItem, Screen, SectionHeading } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function ProfileScreen() {
  const colors = useColors();
  const { profile } = useMess();
  const initials = profile.name ? profile.name.split(' ').map((word) => word[0]).join('').slice(0, 2) : 'OW';
  return <Screen><Header eyebrow="Owner account" title="Profile" subtitle="Your mess workspace, preferences, and local data." /><View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{initials}</Text></View><View style={styles.profileCopy}><Text style={[styles.profileName, { color: colors.foreground }]}>{profile.name || 'Owner'}</Text><Text style={[styles.profileDetail, { color: colors.mutedForeground }]}>Mess owner · {profile.messName || 'Your mess'}</Text></View><Badge label="Owner" tone="green" /></View><SectionHeading title="Owner shortcuts" /><View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}><RowItem icon="grid" title="Operations panel" detail="Approvals, alerts, and operations overview" onPress={() => router.push('/(tabs)/admin')} /><RowItem icon="box" title="Inventory ledger" detail="Manage stock and local reminders" onPress={() => router.push('/inventory')} /><RowItem icon="calendar" title="Menu planner" detail="Plan meals four weeks ahead" onPress={() => router.push('/menu')} /><RowItem icon="bar-chart-2" title="Monthly report" detail="Revenue, costs, and operating margin" onPress={() => router.push('/report')} /></View><SectionHeading title="Local workspace" /><View style={[styles.localCard, { backgroundColor: colors.secondary }]}><Ionicons name="phone-portrait-outline" size={20} color={colors.primary} /><View style={styles.localCopy}><Text style={[styles.localTitle, { color: colors.primary }]}>Saved on this device</Text><Text style={[styles.localDetail, { color: colors.secondaryForeground }]}>Bhojnify keeps your owner records and reminders in local storage. No student workspace or shared account is active.</Text></View></View><Pressable onPress={() => Alert.alert('Bhojnify', `Owner records for ${profile.name || 'this owner'} are saved securely on this device.`)} style={styles.privacy}><Ionicons name="shield-checkmark-outline" size={17} color={colors.primary} /><Text style={[styles.privacyText, { color: colors.mutedForeground }]}>Privacy & security</Text><Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} /></Pressable></Screen>;
}

const styles = StyleSheet.create({
  profileCard: { borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700' },
  profileCopy: { flex: 1, gap: 3 },
  profileName: { fontSize: 16, fontWeight: '700' },
  profileDetail: { fontSize: 12 },
  menuCard: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  localCard: { borderRadius: 18, padding: 15, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  localCopy: { flex: 1, gap: 4 },
  localTitle: { fontSize: 14, fontWeight: '700' },
  localDetail: { fontSize: 12, lineHeight: 18 },
  privacy: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, paddingVertical: 4 },
  privacyText: { fontSize: 12, fontWeight: '600' },
});