import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Badge, FormField, Header, PrimaryButton, SectionHeading } from '@/components/UI';
import { Meal, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { useState } from 'react';

export default function MenuScreen() {
  const colors = useColors();
  const { menus, addMenu } = useMess();
  const [day, setDay] = useState('Friday');
  const [meal, setMeal] = useState<Meal>('Lunch');
  const [dish, setDish] = useState('');
  const [note, setNote] = useState('');
  const add = () => { if (!dish) { Alert.alert('Add a dish', 'Give this menu item a name first.'); return; } addMenu({ day, meal, dish, note: note || 'Freshly prepared' }); setDish(''); setNote(''); };
  return <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled"><Header eyebrow="Owner tools" title="Menu planner" subtitle="Shape the next four weeks of meals." onPress={() => router.push('/(tabs)/profile')} /><View style={[styles.menuHero, { backgroundColor: colors.primary }]}><Ionicons name="calendar-outline" size={26} color={colors.accent} /><View><Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>Next up</Text><Text style={[styles.heroDetail, { color: colors.primaryForeground }]}>Plan ahead, waste less, serve better.</Text></View></View><SectionHeading title="Published menu" /><View style={[styles.menuList, { backgroundColor: colors.card, borderColor: colors.border }]}>{menus.map((item, index) => <View key={item.id} style={[styles.menuRow, index < menus.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}><View style={[styles.dayPill, { backgroundColor: colors.secondary }]}><Text style={[styles.dayText, { color: colors.primary }]}>{item.day.slice(0, 3).toUpperCase()}</Text></View><View style={styles.menuCopy}><View style={styles.menuTop}><Text style={[styles.mealText, { color: colors.mutedForeground }]}>{item.meal}</Text><Badge label="Published" /></View><Text style={[styles.dishText, { color: colors.foreground }]}>{item.dish}</Text><Text style={[styles.noteText, { color: colors.mutedForeground }]}>{item.note}</Text></View></View>)}</View><SectionHeading title="Add to plan" /><View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}><FormField label="Day" value={day} onChangeText={setDay} placeholder="e.g. Friday" /><FormField label="Meal slot" value={meal} onChangeText={(value) => setMeal((value || 'Lunch') as Meal)} placeholder="Breakfast, Lunch, Dinner" /><FormField label="Dish" value={dish} onChangeText={setDish} placeholder="e.g. Vegetable biryani" /><FormField label="Notes" value={note} onChangeText={setNote} placeholder="Sides, allergens, or prep notes" /><PrimaryButton label="Publish menu item" icon="check" onPress={add} /></View></KeyboardAwareScrollViewCompat>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 40, gap: 18 },
  menuHero: { padding: 18, borderRadius: 20, flexDirection: 'row', gap: 12, alignItems: 'center' },
  heroTitle: { fontSize: 17, fontWeight: '700' },
  heroDetail: { fontSize: 12, opacity: 0.76, marginTop: 3 },
  menuList: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  menuRow: { flexDirection: 'row', gap: 11, paddingVertical: 14 },
  dayPill: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 10, fontWeight: '700' },
  menuCopy: { flex: 1, gap: 3 },
  menuTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealText: { fontSize: 11, fontWeight: '600' },
  dishText: { fontSize: 15, fontWeight: '700' },
  noteText: { fontSize: 11 },
  formCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 15 },
});