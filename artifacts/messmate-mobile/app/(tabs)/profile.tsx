import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, RowItem, Screen, SectionHeading } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProfileScreen() {
  const colors = useColors();
  const { profile } = useMess();
  const { language, setLanguage, t } = useTranslation();
  const initials = profile.name ? profile.name.split(' ').map((word) => word[0]).join('').slice(0, 2) : 'OW';
  return <Screen><Header eyebrow={t('ownerAccount')} title={t('profileTitle')} subtitle={t('profileSubtitle')} /><View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{initials}</Text></View><View style={styles.profileCopy}><Text style={[styles.profileName, { color: colors.foreground }]}>{profile.name || t('owner')}</Text><Text style={[styles.profileDetail, { color: colors.mutedForeground }]}>{t('messOwner')} · {profile.messName || t('yourMess')}</Text></View><Badge label={t('owner')} tone="green" /></View><SectionHeading title={t('ownerShortcuts')} /><View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}><RowItem icon="grid" title={t('operationsPanel')} detail={t('operationsDetail')} onPress={() => router.push('/(tabs)/admin')} /><RowItem icon="box" title={t('inventoryLedger')} detail={t('inventoryDetail')} onPress={() => router.push('/inventory')} /><RowItem icon="calendar" title={t('menuPlanner')} detail={t('menuDetail')} onPress={() => router.push('/menu')} /><RowItem icon="bar-chart-2" title={t('septemberReport')} detail={t('reportDetail')} onPress={() => router.push('/report')} /></View><SectionHeading title={t('localWorkspace')} /><View style={[styles.localCard, { backgroundColor: colors.secondary }]}><Ionicons name="phone-portrait-outline" size={20} color={colors.primary} /><View style={styles.localCopy}><Text style={[styles.localTitle, { color: colors.primary }]}>{t('savedOnDevice')}</Text><Text style={[styles.localDetail, { color: colors.secondaryForeground }]}>{t('localStorageDetail')}</Text></View></View><SectionHeading title={t('language')} /><View style={[styles.languageCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.languageHint, { color: colors.mutedForeground }]}>{t('chooseLanguage')}</Text><View style={[styles.languagePicker, { backgroundColor: colors.background, borderColor: colors.border }]}><Pressable onPress={() => setLanguage('en')} style={[styles.languageOption, language === 'en' && { backgroundColor: colors.primary }]}><Text style={[styles.languageOptionText, { color: language === 'en' ? colors.primaryForeground : colors.foreground }]}>{t('english')}</Text></Pressable><Pressable onPress={() => setLanguage('mr')} style={[styles.languageOption, language === 'mr' && { backgroundColor: colors.primary }]}><Text style={[styles.languageOptionText, { color: language === 'mr' ? colors.primaryForeground : colors.foreground }]}>{t('marathi')}</Text></Pressable></View></View><Pressable onPress={() => Alert.alert('Bhojnify', t('ownerRecordsSaved', { name: profile.name || t('owner') }))} style={styles.privacy}><Ionicons name="shield-checkmark-outline" size={17} color={colors.primary} /><Text style={[styles.privacyText, { color: colors.mutedForeground }]}>{t('privacySecurity')}</Text><Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} /></Pressable></Screen>;
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
  languageCard: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 10 },
  languageHint: { fontSize: 12 },
  languagePicker: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 3, alignSelf: 'flex-start' },
  languageOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9 },
  languageOptionText: { fontSize: 13, fontWeight: '700' },
});