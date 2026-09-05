import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Header, Screen, SectionHeading } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function FeedbackScreen() {
  const colors = useColors();
  const { feedback } = useMess();

  return <Screen>
    <Header eyebrow="Owner tools" title="Meal feedback" subtitle="Review member notes and spot patterns in the kitchen experience." onPress={() => router.push('/(tabs)/admin')} />
    <View style={[styles.summary, { backgroundColor: colors.primary }]}><Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.accent} /><View style={styles.summaryCopy}><Text style={[styles.summaryTitle, { color: colors.primaryForeground }]}>{feedback.length} note{feedback.length === 1 ? '' : 's'} recorded</Text><Text style={[styles.summaryDetail, { color: colors.primaryForeground }]}>Use feedback to improve the next menu cycle.</Text></View></View>
    <SectionHeading title="Recent notes" />
    <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {feedback.length ? feedback.map((item, index) => <View key={item.id} style={[styles.row, index < feedback.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <View style={styles.stars}>{Array.from({ length: item.rating }).map((_, starIndex) => <Ionicons key={starIndex} name="star" size={15} color={colors.accent} />)}</View>
        <Text style={[styles.note, { color: colors.foreground }]}>{item.note || `Rated ${item.dish}`}</Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>{item.dish} · {item.date}</Text>
      </View>) : <Text style={[styles.empty, { color: colors.mutedForeground }]}>No member feedback has been recorded.</Text>}
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  summary: { padding: 17, borderRadius: 19, flexDirection: 'row', gap: 11, alignItems: 'flex-start' },
  summaryCopy: { flex: 1, gap: 4 },
  summaryTitle: { fontSize: 15, fontWeight: '700' },
  summaryDetail: { fontSize: 12, lineHeight: 18, opacity: 0.78 },
  list: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 15 },
  row: { paddingVertical: 14, gap: 5 },
  stars: { flexDirection: 'row', gap: 2 },
  note: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 11 },
  empty: { paddingVertical: 16, fontSize: 12 },
});