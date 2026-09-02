import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Badge, FormField, Header, PrimaryButton, SectionHeading } from '@/components/UI';
import { useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';
import { useState } from 'react';

export default function InventoryScreen() {
  const colors = useColors();
  const { inventory, addInventory, removeInventory } = useMess();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minimum, setMinimum] = useState('');
  const add = () => { if (!name || !quantity || !minimum) { Alert.alert('Complete item details', 'Add a name, quantity, and minimum level.'); return; } addInventory({ name, quantity: Number(quantity), unit, minimum: Number(minimum), category: 'Essentials' }); setName(''); setQuantity(''); setMinimum(''); };
  return <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled"><Header eyebrow="Owner tools" title="Inventory ledger" subtitle="Stay ahead of the next meal service." onPress={() => router.push('/(tabs)/profile')} /><View style={[styles.alertBanner, { backgroundColor: colors.accent }]}><Ionicons name="warning-outline" size={20} color={colors.accentForeground} /><Text style={[styles.alertText, { color: colors.accentForeground }]}>{inventory.filter((item) => item.quantity <= item.minimum).length} item below minimum stock</Text></View><SectionHeading title="Current stock" /><View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>{inventory.map((item, index) => { const low = item.quantity <= item.minimum; return <View key={item.id} style={[styles.itemRow, index < inventory.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}><View style={[styles.itemIcon, { backgroundColor: low ? colors.accent : colors.secondary }]}><Ionicons name="cube-outline" size={19} color={low ? colors.accentForeground : colors.primary} /></View><View style={styles.itemCopy}><Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{item.category} · minimum {item.minimum} {item.unit}</Text></View><View style={styles.itemRight}><Text style={[styles.itemQty, { color: low ? colors.destructive : colors.foreground }]}>{item.quantity} {item.unit}</Text><Badge label={low ? 'Low' : 'Good'} tone={low ? 'amber' : 'green'} /></View><Pressable onPress={() => removeInventory(item.id)} hitSlop={8}><Ionicons name="trash-outline" size={17} color={colors.mutedForeground} /></Pressable></View> })}</View><SectionHeading title="Add stock item" /><View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}><FormField label="Ingredient" value={name} onChangeText={setName} placeholder="e.g. Chickpeas" /><View style={styles.twoCol}><View style={{ flex: 1 }}><FormField label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="0" keyboardType="numeric" /></View><View style={{ flex: 1 }}><FormField label="Minimum" value={minimum} onChangeText={setMinimum} placeholder="0" keyboardType="numeric" /></View></View><FormField label="Unit" value={unit} onChangeText={setUnit} placeholder="kg, L, pcs" /><PrimaryButton label="Add to ledger" icon="plus" onPress={add} /></View></KeyboardAwareScrollViewCompat>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 40, gap: 18 },
  alertBanner: { padding: 14, borderRadius: 15, flexDirection: 'row', gap: 9, alignItems: 'center' },
  alertText: { fontSize: 13, fontWeight: '700' },
  list: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  itemIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemCopy: { flex: 1, gap: 3 },
  itemName: { fontSize: 14, fontWeight: '700' },
  itemMeta: { fontSize: 11 },
  itemRight: { alignItems: 'flex-end', gap: 5 },
  itemQty: { fontSize: 13, fontWeight: '700' },
  formCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 15 },
  twoCol: { flexDirection: 'row', gap: 12 },
});