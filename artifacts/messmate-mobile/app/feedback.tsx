import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { FormField, Header, PrimaryButton } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { useState } from 'react';

export default function FeedbackScreen() {
  const colors = useColors();
  const { menus, addFeedback } = useMess();
  const [dish, setDish] = useState(menus.find((menu) => menu.day === 'Today')?.dish ?? 'Rajma rice');
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');
  const submit = () => { if (!rating) { Alert.alert('Add a rating', 'Choose between one and five stars.'); return; } addFeedback(dish, rating, note); Alert.alert('Thanks for the feedback', 'Your note has been shared with the kitchen.'); router.back(); };
  return <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled"><Header eyebrow="Make it better" title="Rate your meal" subtitle="A quick note helps the kitchen keep improving." /><View style={[styles.dishCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.dishLabel, { color: colors.mutedForeground }]}>TODAY’S DISH</Text><Text style={[styles.dishName, { color: colors.foreground }]}>{dish}</Text><Text style={[styles.dishNote, { color: colors.mutedForeground }]}>Consumed today · lunch</Text></View><Text style={[styles.ratingLabel, { color: colors.foreground }]}>How was it?</Text><View style={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <Pressable testID={`rating-${value}`} key={value} onPress={() => setRating(value)} hitSlop={6}><Ionicons name={value <= rating ? 'star' : 'star-outline'} size={34} color={value <= rating ? colors.accent : colors.mutedForeground} /></Pressable>)}</View><FormField label="Optional note" value={note} onChangeText={setNote} placeholder="What stood out?" /><PrimaryButton label="Share feedback" icon="star" onPress={submit} /></KeyboardAwareScrollViewCompat>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 40, gap: 18 },
  dishCard: { borderWidth: 1, borderRadius: 20, padding: 18, gap: 5 },
  dishLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  dishName: { fontSize: 24, fontWeight: '700', marginTop: 3 },
  dishNote: { fontSize: 12 },
  ratingLabel: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  stars: { flexDirection: 'row', gap: 10 },
});