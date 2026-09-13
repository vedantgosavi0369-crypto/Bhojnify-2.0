import { Feather, Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true, refreshing = false }: { children: ReactNode; scroll?: boolean; refreshing?: boolean }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const content = <View style={[styles.screenContent, { paddingTop: Platform.OS === 'web' ? Math.max(insets.top, 67) + 12 : insets.top + 12, paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 34 : 16) + 92 }]}>{children}</View>;
  return scroll ? <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{content}</ScrollView> : <View style={[styles.screen, { backgroundColor: colors.background }]}>{content}</View>;
}

export function Header({ eyebrow, title, subtitle, onPress }: { eyebrow?: string; title: string; subtitle?: string; onPress?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
      </View>
      {onPress ? <Pressable testID="header-action" onPress={onPress} style={({ pressed }) => [styles.headerButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}><Feather name="user" size={19} color={colors.foreground} /></Pressable> : null}
    </View>
  );
}

export function SectionHeading({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionHeading}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>{action ? <Pressable onPress={onPress} hitSlop={8}><Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text></Pressable> : null}</View>;
}

export function Badge({ label, tone = 'green' }: { label: string; tone?: 'green' | 'amber' | 'red' | 'gray' }) {
  const colors = useColors();
  const palette = tone === 'green' ? { bg: colors.secondary, fg: colors.primary } : tone === 'amber' ? { bg: colors.accent, fg: colors.accentForeground } : tone === 'red' ? { bg: colors.destructive, fg: colors.destructiveForeground } : { bg: colors.muted, fg: colors.mutedForeground };
  return <View style={[styles.badge, { backgroundColor: palette.bg }]}><Text style={[styles.badgeText, { color: palette.fg }]}>{label}</Text></View>;
}

export function PrimaryButton({ label, icon, onPress, secondary = false, disabled = false }: { label: string; icon?: keyof typeof Feather.glyphMap; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const colors = useColors();
  return <Pressable testID={`button-${label.toLowerCase().replace(/\s/g, '-')}`} onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryButton, { backgroundColor: secondary ? colors.secondary : colors.primary, borderColor: secondary ? colors.border : colors.primary, opacity: disabled ? 0.45 : pressed ? 0.82 : 1 }]}>{icon ? <Feather name={icon} size={17} color={secondary ? colors.secondaryForeground : colors.primaryForeground} /> : null}<Text style={[styles.primaryButtonText, { color: secondary ? colors.secondaryForeground : colors.primaryForeground }]}>{label}</Text></Pressable>;
}

export function IconTile({ icon, label, color, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; color?: string; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.iconTile, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}><View style={[styles.iconCircle, { backgroundColor: color ?? colors.secondary }]}><Ionicons name={icon} size={20} color={color ? colors.card : colors.primary} /></View><Text style={[styles.iconTileLabel, { color: colors.foreground }]}>{label}</Text></Pressable>;
}

export function StatCard({ label, value, detail, tone = 'green' }: { label: string; value: string; detail?: string; tone?: 'green' | 'amber' | 'red' }) {
  const colors = useColors();
  const bg = tone === 'amber' ? colors.accent : tone === 'red' ? colors.destructive : colors.primary;
  const fg = tone === 'amber' ? colors.accentForeground : colors.primaryForeground;
  return <View style={[styles.statCard, { backgroundColor: bg }]}><Text style={[styles.statLabel, { color: fg, opacity: 0.76 }]}>{label}</Text><Text style={[styles.statValue, { color: fg }]}>{value}</Text>{detail ? <Text style={[styles.statDetail, { color: fg, opacity: 0.82 }]}>{detail}</Text> : null}</View>;
}

export function RowItem({ icon, title, detail, right, onPress, destructive = false }: { icon: keyof typeof Feather.glyphMap; title: string; detail?: string; right?: ReactNode; onPress?: () => void; destructive?: boolean }) {
  const colors = useColors();
  const row = <View style={styles.rowItem}><View style={[styles.rowIcon, { backgroundColor: destructive ? colors.destructive : colors.secondary }]}><Feather name={icon} size={17} color={destructive ? colors.destructiveForeground : colors.primary} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: colors.foreground }]}>{title}</Text>{detail ? <Text style={[styles.rowDetail, { color: colors.mutedForeground }]}>{detail}</Text> : null}</View>{right ?? <Feather name="chevron-right" size={18} color={colors.mutedForeground} />}</View>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>{row}</Pressable> : row;
}

export function FormField({ label, value, onChangeText, placeholder, keyboardType = 'default' }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: 'default' | 'numeric' | 'phone-pad' }) {
  const colors = useColors();
  return <View style={styles.formField}><Text style={[styles.formLabel, { color: colors.foreground }]}>{label}</Text><TextInput testID={`input-${label.toLowerCase().replace(/\s/g, '-')}`} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} keyboardType={keyboardType} style={[styles.textInput, { borderColor: colors.input, backgroundColor: colors.card, color: colors.foreground }]} /></View>;
}

export function EmptyState({ icon = 'inbox', title, detail }: { icon?: keyof typeof Feather.glyphMap; title: string; detail: string }) {
  const colors = useColors();
  return <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={icon} size={26} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyDetail, { color: colors.mutedForeground }]}>{detail}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  screenContent: { paddingHorizontal: 20, gap: 20, minHeight: '100%' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
  headerCopy: { flex: 1, gap: 5 },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, fontWeight: '700' },
  headerTitle: { fontSize: 30, lineHeight: 35, fontWeight: '700', letterSpacing: -0.7 },
  headerSubtitle: { fontSize: 14, lineHeight: 20 },
  headerButton: { width: 42, height: 42, borderWidth: 1, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: -9 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
  sectionAction: { fontSize: 13, fontWeight: '700' },
  badge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 99, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  primaryButton: { minHeight: 50, paddingHorizontal: 18, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  primaryButtonText: { fontSize: 15, fontWeight: '700' },
  iconTile: { flex: 1, minWidth: 74, paddingVertical: 12, paddingHorizontal: 6, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
  iconCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  iconTileLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  statCard: { flex: 1, minHeight: 104, padding: 15, borderRadius: 18, justifyContent: 'space-between' },
  statLabel: { fontSize: 11, fontWeight: '700' },
  statValue: { fontSize: 27, fontWeight: '700', letterSpacing: -0.8 },
  statDetail: { fontSize: 11, fontWeight: '600' },
  rowItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  rowIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, gap: 3 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowDetail: { fontSize: 12, lineHeight: 17 },
  formField: { gap: 8 },
  formLabel: { fontSize: 13, fontWeight: '700' },
  textInput: { borderWidth: 1, borderRadius: 13, minHeight: 48, paddingHorizontal: 14, fontSize: 15 },
  emptyState: { borderWidth: 1, borderRadius: 18, padding: 24, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyDetail: { fontSize: 13, textAlign: 'center', lineHeight: 19 },
});