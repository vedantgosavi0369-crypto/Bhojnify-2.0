import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Header, PrimaryButton, Screen, SectionHeading } from '@/components/UI';
import { Meal, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const mealInfo: Array<{ meal: Meal; time: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { meal: 'Breakfast', time: '7:30 – 9:30 AM', icon: 'sunny-outline' },
  { meal: 'Lunch', time: '12:30 – 2:30 PM', icon: 'partly-sunny-outline' },
  { meal: 'Dinner', time: '7:30 – 9:30 PM', icon: 'moon-outline' },
];

export default function MealsScreen() {
  const colors = useColors();
  const { menus, attendance, markAttendance, credits } = useMess();
  const today = new Date().toISOString().slice(0, 10);
  const marked = (meal: Meal) => attendance.some((item) => item.date === today && item.meal === meal);

  const handleMark = async (meal: Meal) => {
    if (marked(meal)) return;
    if (Platform.OS === 'web') {
      markAttendance(meal, false, 'Preview mode');
      Alert.alert('Meal marked', `${meal} attendance was saved locally. Native devices also verify biometrics and GPS.`);
      return;
    }
    try {
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (!locationPermission.granted) {
        Alert.alert('Location needed', 'Bhojnify checks that you are at the mess before marking attendance.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const distance = Math.sqrt(Math.pow((position.coords.latitude - 12.9716) * 111000, 2) + Math.pow((position.coords.longitude - 77.5946) * 111000, 2));
      if (distance > 250) {
        Alert.alert('Outside mess radius', 'Move closer to the mess and try again.');
        return;
      }
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const biometric = hasHardware ? await LocalAuthentication.authenticateAsync({ promptMessage: 'Verify to mark your meal' }) : { success: true };
      if (!biometric.success) return;
      markAttendance(meal, true, 'Biometric + GPS');
      Alert.alert('Attendance marked', `${meal} is logged. Enjoy your meal.`);
    } catch {
      Alert.alert('Could not verify', 'Please try again when you have a clear location signal.');
    }
  };

  return <Screen><Header eyebrow="Meal access" title="Mark your meal" subtitle="Attendance is protected with a quick device check." onPress={() => router.push('/(tabs)/profile')} /><View style={[styles.creditBanner, { backgroundColor: colors.secondary }]}><View><Text style={[styles.creditLabel, { color: colors.primary }]}>MEAL CREDITS</Text><Text style={[styles.creditValue, { color: colors.foreground }]}>{credits} <Text style={[styles.creditSmall, { color: colors.mutedForeground }]}>remaining</Text></Text></View><Ionicons name="shield-checkmark-outline" size={30} color={colors.primary} /></View><SectionHeading title="Today’s slots" /><View style={styles.mealList}>{mealInfo.map((item) => { const isMarked = marked(item.meal); const menu = menus.find((entry) => entry.day === 'Today' && entry.meal === item.meal); return <View key={item.meal} style={[styles.mealCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.mealIcon, { backgroundColor: item.meal === 'Breakfast' ? colors.accent : colors.secondary }]}><Ionicons name={item.icon} size={22} color={item.meal === 'Breakfast' ? colors.accentForeground : colors.primary} /></View><View style={styles.mealCopy}><View style={styles.mealHeading}><Text style={[styles.mealName, { color: colors.foreground }]}>{item.meal}</Text><Badge label={isMarked ? 'Verified' : 'Open'} tone={isMarked ? 'green' : 'gray'} /></View><Text style={[styles.mealTime, { color: colors.mutedForeground }]}>{item.time}</Text><Text style={[styles.mealDish, { color: colors.foreground }]}>{menu?.dish ?? 'Menu being updated'}</Text></View><Pressable testID={`mark-${item.meal.toLowerCase()}`} disabled={isMarked} onPress={() => handleMark(item.meal)} style={({ pressed }) => [styles.markButton, { backgroundColor: isMarked ? colors.secondary : colors.primary, opacity: pressed ? 0.78 : 1 }]}><Ionicons name={isMarked ? 'checkmark' : 'scan-outline'} size={20} color={isMarked ? colors.primary : colors.primaryForeground} /></Pressable></View> })}</View><View style={[styles.securityNote, { borderColor: colors.border }]}><Ionicons name="lock-closed-outline" size={17} color={colors.primary} /><Text style={[styles.securityText, { color: colors.mutedForeground }]}>Your location is checked only during attendance marking and is never tracked in the background.</Text></View><PrimaryButton label="View attendance history" icon="clock" secondary onPress={() => router.push('/(tabs)/activity')} /></Screen>;
}

const styles = StyleSheet.create({
  creditBanner: { padding: 18, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.3 },
  creditValue: { fontSize: 30, fontWeight: '700', marginTop: 4 },
  creditSmall: { fontSize: 13, fontWeight: '500' },
  mealList: { gap: 10 },
  mealCard: { borderWidth: 1, borderRadius: 20, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center' },
  mealIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  mealCopy: { flex: 1, gap: 3 },
  mealHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mealName: { fontSize: 16, fontWeight: '700' },
  mealTime: { fontSize: 11 },
  mealDish: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  markButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  securityNote: { flexDirection: 'row', borderWidth: 1, borderRadius: 15, padding: 13, gap: 9, alignItems: 'center' },
  securityText: { flex: 1, fontSize: 11, lineHeight: 16 },
});