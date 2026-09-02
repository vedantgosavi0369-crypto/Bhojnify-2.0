import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, IconTile, PrimaryButton, Screen, SectionHeading, StatCard } from '@/components/UI';
import { daysUntil, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const mess = useMess();
  return mess.role === 'owner' ? <OwnerHome /> : <StudentHome />;
}

function StudentHome() {
  const colors = useColors();
  const { profile, credits, expiresOn, menus, attendance, setRole } = useMess();
  const days = daysUntil(expiresOn);
  const todayAttendance = attendance.filter((item) => item.date === new Date().toISOString().slice(0, 10));
  return (
    <Screen>
      <Header eyebrow="Wednesday · 02 September" title={`Good morning, ${profile.name.split(' ')[0]}`} subtitle={`${profile.hostel} · Member since ${profile.memberSince}`} onPress={() => router.push('/(tabs)/profile')} />
      <View style={[styles.membershipCard, { backgroundColor: colors.primary }]}>
        <View style={styles.membershipTop}><View><Text style={[styles.membershipKicker, { color: colors.primaryForeground }]}>STANDARD PLAN</Text><Text style={[styles.membershipTitle, { color: colors.primaryForeground }]}>You’re all set for today</Text></View><Ionicons name="leaf" size={28} color={colors.accent} /></View>
        <View style={styles.membershipBottom}><View><Text style={[styles.creditValue, { color: colors.primaryForeground }]}>{credits}</Text><Text style={[styles.creditLabel, { color: colors.primaryForeground }]}>meal credits left</Text></View><View style={styles.expiry}><Text style={[styles.expiryLabel, { color: colors.primaryForeground }]}>RENEWS IN</Text><Text style={[styles.expiryValue, { color: colors.accent }]}>{days} days</Text></View></View>
      </View>
      {days <= 3 ? <View style={[styles.notice, { backgroundColor: colors.accent }]}><Ionicons name="notifications-outline" size={20} color={colors.accentForeground} /><View style={styles.noticeCopy}><Text style={[styles.noticeTitle, { color: colors.accentForeground }]}>Membership expires soon</Text><Text style={[styles.noticeDetail, { color: colors.accentForeground }]}>Renew by {expiresOn} to keep your meal access active.</Text></View></View> : null}
      <SectionHeading title="Quick actions" />
      <View style={styles.actionGrid}>
        <IconTile icon="scan-outline" label="Mark meal" onPress={() => router.push('/(tabs)/meals')} />
        <IconTile icon="calendar-outline" label="Apply leave" onPress={() => router.push('/leave')} />
        <IconTile icon="star-outline" label="Rate a meal" onPress={() => router.push('/feedback')} />
        <IconTile icon="receipt-outline" label="Payments" onPress={() => router.push('/payments')} />
      </View>
      <SectionHeading title="Today’s plate" action="See menu" onPress={() => router.push('/(tabs)/meals')} />
      <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {menus.filter((menu) => menu.day === 'Today').map((menu, index) => <View key={menu.id} style={[styles.menuRow, index < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}><View style={[styles.mealDot, { backgroundColor: menu.meal === 'Breakfast' ? colors.accent : colors.secondary }]}><Ionicons name={menu.meal === 'Breakfast' ? 'sunny-outline' : menu.meal === 'Lunch' ? 'partly-sunny-outline' : 'moon-outline'} size={17} color={menu.meal === 'Breakfast' ? colors.accentForeground : colors.primary} /></View><View style={styles.menuCopy}><Text style={[styles.menuMeal, { color: colors.mutedForeground }]}>{menu.meal} · {menu.meal === 'Breakfast' ? '7:30–9:30 AM' : menu.meal === 'Lunch' ? '12:30–2:30 PM' : '7:30–9:30 PM'}</Text><Text style={[styles.menuDish, { color: colors.foreground }]}>{menu.dish}</Text><Text style={[styles.menuNote, { color: colors.mutedForeground }]}>{menu.note}</Text></View><Badge label={todayAttendance.some((record) => record.meal === menu.meal) ? 'Marked' : 'Open'} tone={todayAttendance.some((record) => record.meal === menu.meal) ? 'green' : 'gray'} /></View>)}</View>
      <Pressable onPress={() => { setRole('owner'); Alert.alert('Owner preview', 'Owner tools are now available from the home tab.'); }} style={({ pressed }) => [styles.switchPreview, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}><Ionicons name="swap-horizontal-outline" size={16} color={colors.primary} /><Text style={[styles.switchText, { color: colors.primary }]}>Preview owner workspace</Text></Pressable>
    </Screen>
  );
}

function OwnerHome() {
  const colors = useColors();
  const { inventory, attendance, expenses, payments, setRole } = useMess();
  const lowStock = inventory.filter((item) => item.quantity <= item.minimum);
  const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const spend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (
    <Screen>
      <Header eyebrow="Owner workspace · Wednesday" title="Good morning, Meera" subtitle="Here’s the pulse of your mess today." onPress={() => router.push('/(tabs)/profile')} />
      <View style={[styles.ownerHero, { backgroundColor: colors.foreground }]}><View style={styles.ownerHeroCopy}><Text style={[styles.ownerKicker, { color: colors.accent }]}>TODAY AT A GLANCE</Text><Text style={[styles.ownerTitle, { color: colors.card }]}>Keep the kitchen moving.</Text><Text style={[styles.ownerDetail, { color: colors.card }]}>Your operations are looking steady. One stock item needs attention.</Text></View><Ionicons name="restaurant-outline" size={46} color={colors.accent} /></View>
      <View style={styles.statsRow}><StatCard label="MEALS SERVED" value={`${attendance.length + 126}`} detail="+8% vs last week" /><StatCard label="REVENUE" value={`₹${(revenue / 1000).toFixed(1)}k`} detail="this month" tone="amber" /></View>
      <View style={styles.statsRow}><StatCard label="EXPENSES" value={`₹${(spend / 1000).toFixed(1)}k`} detail="this month" tone="red" /><StatCard label="ACTIVE MEMBERS" value="148" detail="96% attendance" /></View>
      <SectionHeading title="Run the mess" />
      <View style={styles.actionGrid}><IconTile icon="cube-outline" label="Inventory" onPress={() => router.push('/inventory')} /><IconTile icon="restaurant-outline" label="Menu plan" onPress={() => router.push('/menu')} /><IconTile icon="people-outline" label="Staff" onPress={() => router.push('/staff')} /><IconTile icon="bar-chart-outline" label="Reports" onPress={() => router.push('/report')} /></View>
      <SectionHeading title="Needs your attention" />
      <View style={[styles.attentionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>{lowStock.length > 0 ? <Pressable onPress={() => router.push('/inventory')} style={styles.attentionRow}><View style={[styles.attentionIcon, { backgroundColor: colors.accent }]}><Ionicons name="warning-outline" size={18} color={colors.accentForeground} /></View><View style={styles.attentionCopy}><Text style={[styles.attentionTitle, { color: colors.foreground }]}>{lowStock[0].name} is below minimum</Text><Text style={[styles.attentionDetail, { color: colors.mutedForeground }]}>{lowStock[0].quantity} {lowStock[0].unit} left · minimum {lowStock[0].minimum} {lowStock[0].unit}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} /></Pressable> : <Text style={[styles.attentionTitle, { color: colors.foreground }]}>All stock levels are healthy</Text>}<Pressable onPress={() => router.push('/expenses')} style={[styles.attentionRow, { borderTopWidth: 1, borderTopColor: colors.border }]}><View style={[styles.attentionIcon, { backgroundColor: colors.secondary }]}><Ionicons name="cash-outline" size={18} color={colors.primary} /></View><View style={styles.attentionCopy}><Text style={[styles.attentionTitle, { color: colors.foreground }]}>Log today’s expenses</Text><Text style={[styles.attentionDetail, { color: colors.mutedForeground }]}>Keep this month’s P&L up to date</Text></View><Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} /></Pressable></View>
      <Pressable onPress={() => { setRole('student'); Alert.alert('Student preview', 'Student meal access is now available from the home tab.'); }} style={({ pressed }) => [styles.switchPreview, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}><Ionicons name="swap-horizontal-outline" size={16} color={colors.primary} /><Text style={[styles.switchText, { color: colors.primary }]}>Preview student workspace</Text></Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  membershipCard: { borderRadius: 24, padding: 20, gap: 28 },
  membershipTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  membershipKicker: { fontSize: 11, letterSpacing: 1.4, fontWeight: '700', opacity: 0.72 },
  membershipTitle: { fontSize: 20, fontWeight: '700', marginTop: 8, letterSpacing: -0.3 },
  membershipBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  creditValue: { fontSize: 38, fontWeight: '700', lineHeight: 40 },
  creditLabel: { fontSize: 12, opacity: 0.72 },
  expiry: { alignItems: 'flex-end', gap: 4 },
  expiryLabel: { fontSize: 10, letterSpacing: 1.2, opacity: 0.7, fontWeight: '700' },
  expiryValue: { fontSize: 16, fontWeight: '700' },
  notice: { flexDirection: 'row', padding: 14, borderRadius: 16, gap: 11, alignItems: 'flex-start' },
  noticeCopy: { flex: 1, gap: 3 },
  noticeTitle: { fontSize: 14, fontWeight: '700' },
  noticeDetail: { fontSize: 12, lineHeight: 17 },
  actionGrid: { flexDirection: 'row', gap: 8 },
  menuCard: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 15 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 12 },
  mealDot: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  menuCopy: { flex: 1, gap: 3 },
  menuMeal: { fontSize: 11, fontWeight: '600' },
  menuDish: { fontSize: 15, fontWeight: '700' },
  menuNote: { fontSize: 11 },
  switchPreview: { alignSelf: 'center', flexDirection: 'row', gap: 7, alignItems: 'center', borderWidth: 1, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 9 },
  switchText: { fontSize: 12, fontWeight: '700' },
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
});