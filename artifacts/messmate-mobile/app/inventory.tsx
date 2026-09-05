import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Badge, FormField, Header, PrimaryButton, SectionHeading } from '@/components/UI';
import { formatDate, useMess } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function InventoryScreen() {
  const colors = useColors();
  const { inventory, addInventory, removeInventory, reminders, addReminder, resolveReminder } = useMess();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minimum, setMinimum] = useState('');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDays, setReminderDays] = useState('');

  const add = () => {
    const itemName = name.trim();
    const quantityValue = Number(quantity);
    const minimumValue = Number(minimum);
    const hasReminder = reminderTitle.trim() || reminderDays.trim();
    const daysValue = Number(reminderDays);

    if (!itemName || !quantity || !minimum || Number.isNaN(quantityValue) || Number.isNaN(minimumValue)) {
      Alert.alert('Complete item details', 'Add a name, quantity, and minimum level.');
      return;
    }
    if (hasReminder && (!reminderDays.trim() || Number.isNaN(daysValue) || daysValue < 0)) {
      Alert.alert('Complete reminder details', 'Add the number of days before this reminder should appear.');
      return;
    }

    addInventory({ name: itemName, quantity: quantityValue, unit: unit.trim() || 'kg', minimum: minimumValue, category: 'Essentials' });
    if (hasReminder) {
      addReminder(reminderTitle.trim() || `Recheck ${itemName}`, daysValue, `Inventory: ${itemName}`);
    }
    setName('');
    setQuantity('');
    setMinimum('');
    setReminderTitle('');
    setReminderDays('');
  };

  const currentDate = new Date().toISOString().slice(0, 10);

  return (
    <KeyboardAwareScrollViewCompat style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} bottomOffset={24} keyboardShouldPersistTaps="handled">
      <Header eyebrow="Owner tools" title="Inventory ledger" subtitle="Stay ahead of the next meal service." onPress={() => router.push('/(tabs)/profile')} />
      <View style={[styles.alertBanner, { backgroundColor: colors.accent }]}>
        <Ionicons name="warning-outline" size={20} color={colors.accentForeground} />
        <Text style={[styles.alertText, { color: colors.accentForeground }]}>{inventory.filter((item) => item.quantity <= item.minimum).length} item below minimum stock</Text>
      </View>

      <SectionHeading title="Current stock" />
      <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {inventory.map((item, index) => {
          const low = item.quantity <= item.minimum;
          return <View key={item.id} style={[styles.itemRow, index < inventory.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.itemIcon, { backgroundColor: low ? colors.accent : colors.secondary }]}><Ionicons name="cube-outline" size={19} color={low ? colors.accentForeground : colors.primary} /></View>
            <View style={styles.itemCopy}><Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{item.category} · minimum {item.minimum} {item.unit}</Text></View>
            <View style={styles.itemRight}><Text style={[styles.itemQty, { color: low ? colors.destructive : colors.foreground }]}>{item.quantity} {item.unit}</Text><Badge label={low ? 'Low' : 'Good'} tone={low ? 'amber' : 'green'} /></View>
            <Pressable onPress={() => removeInventory(item.id)} hitSlop={8}><Ionicons name="trash-outline" size={17} color={colors.mutedForeground} /></Pressable>
          </View>;
        })}
      </View>

      <SectionHeading title="Active reminders" action={`${reminders.length}`} />
      <View style={[styles.reminderList, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {reminders.length ? reminders.map((reminder, index) => {
          const due = reminder.dueDate <= currentDate;
          return <View key={reminder.id} style={[styles.reminderRow, index < reminders.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={[styles.reminderIcon, { backgroundColor: due ? colors.accent : colors.secondary }]}><Ionicons name="notifications-outline" size={18} color={due ? colors.accentForeground : colors.primary} /></View>
            <View style={styles.reminderCopy}><Text style={[styles.reminderTitle, { color: colors.foreground }]}>{reminder.title}</Text><Text style={[styles.reminderMeta, { color: colors.mutedForeground }]}>{reminder.detail} · {due ? 'Due now' : `Due ${formatDate(reminder.dueDate)}`}</Text></View>
            <Pressable onPress={() => resolveReminder(reminder.id)} style={[styles.resolveButton, { backgroundColor: due ? colors.accent : colors.secondary }]}><Text style={[styles.resolveText, { color: due ? colors.accentForeground : colors.primary }]}>Resolve</Text></Pressable>
          </View>;
        }) : <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No active reminders. Add one below when stock needs a follow-up.</Text>}
      </View>

      <SectionHeading title="Add stock item" />
      <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FormField label="Ingredient" value={name} onChangeText={setName} placeholder="e.g. Chickpeas" />
        <View style={styles.twoCol}><View style={{ flex: 1 }}><FormField label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="0" keyboardType="numeric" /></View><View style={{ flex: 1 }}><FormField label="Minimum" value={minimum} onChangeText={setMinimum} placeholder="0" keyboardType="numeric" /></View></View>
        <FormField label="Unit" value={unit} onChangeText={setUnit} placeholder="kg, L, pcs" />
        <View style={[styles.reminderPrompt, { backgroundColor: colors.secondary }]}><View style={styles.reminderPromptHeader}><Ionicons name="notifications-outline" size={18} color={colors.primary} /><Text style={[styles.reminderPromptTitle, { color: colors.primary }]}>Add a follow-up reminder</Text></View><Text style={[styles.reminderPromptDetail, { color: colors.secondaryForeground }]}>It will appear on Home after the number of days you choose.</Text><FormField label="Reminder title (optional)" value={reminderTitle} onChangeText={setReminderTitle} placeholder="e.g. Reorder cooking oil" /><FormField label="Show after how many days" value={reminderDays} onChangeText={setReminderDays} placeholder="e.g. 7" keyboardType="numeric" /></View>
        <PrimaryButton label="Add to ledger" icon="plus" onPress={add} />
      </View>
    </KeyboardAwareScrollViewCompat>
  );
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
  reminderList: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  reminderIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reminderCopy: { flex: 1, gap: 3 },
  reminderTitle: { fontSize: 13, fontWeight: '700' },
  reminderMeta: { fontSize: 11, lineHeight: 16 },
  resolveButton: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  resolveText: { fontSize: 11, fontWeight: '700' },
  emptyText: { paddingVertical: 16, fontSize: 12, lineHeight: 18 },
  formCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 15 },
  twoCol: { flexDirection: 'row', gap: 12 },
  reminderPrompt: { borderRadius: 15, padding: 13, gap: 10 },
  reminderPromptHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  reminderPromptTitle: { fontSize: 13, fontWeight: '700' },
  reminderPromptDetail: { fontSize: 11, lineHeight: 16 },
});