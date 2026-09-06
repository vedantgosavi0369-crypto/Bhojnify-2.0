import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Language } from '@/lib/i18n';

export type Role = 'owner';
export type Meal = 'Breakfast' | 'Lunch' | 'Dinner';

export interface AttendanceRecord {
  id: string;
  date: string;
  meal: Meal;
  time: string;
  verified: boolean;
  method: string;
}

export interface LeaveRequest {
  id: string;
  customerId?: string;
  from: string;
  to: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export type CustomerPaymentStatus = 'Paid' | 'Unpaid';

export interface Customer {
  id: string;
  name: string;
  plan: string;
  joiningDate: string;
  expiryDate: string;
  paymentStatus: CustomerPaymentStatus;
  phone: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  note: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minimum: number;
  category: string;
}

export interface MenuItem {
  id: string;
  day: string;
  meal: Meal;
  dish: string;
  note: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  salary: number;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string;
}

export interface Feedback {
  id: string;
  dish: string;
  rating: number;
  note: string;
  date: string;
}

export interface Reminder {
  id: string;
  title: string;
  detail: string;
  dueDate: string;
  createdAt: string;
}

export interface OwnerProfile {
  name: string;
  messName: string;
  phone: string;
  location: string;
  email: string;
}

interface MessState {
  role: Role;
  language: Language;
  onboardingComplete: boolean;
  credits: number;
  expiresOn: string;
  profile: OwnerProfile;
  attendance: AttendanceRecord[];
  customers: Customer[];
  leaves: LeaveRequest[];
  payments: Payment[];
  inventory: InventoryItem[];
  menus: MenuItem[];
  staff: StaffMember[];
  expenses: Expense[];
  feedback: Feedback[];
  reminders: Reminder[];
}

interface MessActions {
  setLanguage: (language: Language) => void;
  completeOwnerSetup: (profile: OwnerProfile) => void;
  markAttendance: (meal: Meal, verified: boolean, method: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  markCustomerPaid: (id: string) => void;
  addLeave: (customerId: string, from: string, to: string, reason: string) => void;
  updateLeaveStatus: (id: string, status: LeaveRequest['status']) => void;
  addFeedback: (dish: string, rating: number, note: string) => void;
  addInventory: (item: Omit<InventoryItem, 'id'>) => void;
  removeInventory: (id: string) => void;
  addMenu: (item: Omit<MenuItem, 'id'>) => void;
  addStaff: (item: Omit<StaffMember, 'id'>) => void;
  addExpense: (item: Omit<Expense, 'id'>) => void;
  addPayment: (item: Omit<Payment, 'id'>) => void;
  addReminder: (title: string, daysFromNow: number, detail?: string) => void;
  resolveReminder: (id: string) => void;
}

const STORAGE_KEY = '@messmate/state-v1';
const today = new Date().toISOString().slice(0, 10);
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialState: MessState = {
  role: 'owner',
  language: 'en',
  onboardingComplete: false,
  credits: 18,
  expiresOn: '2026-09-18',
  profile: { name: '', messName: '', phone: '', location: '', email: '' },
  attendance: [
    { id: 'a1', date: today, meal: 'Breakfast', time: '08:04 AM', verified: true, method: 'Biometric + GPS' },
    { id: 'a2', date: today, meal: 'Lunch', time: '01:12 PM', verified: true, method: 'Biometric + GPS' },
    { id: 'a3', date: '2026-09-01', meal: 'Dinner', time: '08:06 PM', verified: true, method: 'Biometric + GPS' },
  ],
  customers: [],
  leaves: [
    { id: 'l1', from: '2026-09-08', to: '2026-09-10', reason: 'Family function', status: 'Pending' },
    { id: 'l2', from: '2026-08-21', to: '2026-08-22', reason: 'Weekend travel', status: 'Approved' },
  ],
  payments: [
    { id: 'p1', date: '2026-08-18', amount: 4200, method: 'UPI', note: 'September meal plan' },
    { id: 'p2', date: '2026-07-18', amount: 4200, method: 'UPI', note: 'August meal plan' },
  ],
  inventory: [
    { id: 'i1', name: 'Basmati rice', quantity: 32, unit: 'kg', minimum: 24, category: 'Grains' },
    { id: 'i2', name: 'Toor dal', quantity: 18, unit: 'kg', minimum: 20, category: 'Pulses' },
    { id: 'i3', name: 'Cooking oil', quantity: 12, unit: 'L', minimum: 10, category: 'Essentials' },
    { id: 'i4', name: 'Onions', quantity: 24, unit: 'kg', minimum: 18, category: 'Produce' },
  ],
  menus: [
    { id: 'm1', day: 'Today', meal: 'Breakfast', dish: 'Masala dosa', note: 'Coconut chutney · Sambar' },
    { id: 'm2', day: 'Today', meal: 'Lunch', dish: 'Rajma rice', note: 'Cucumber salad · Buttermilk' },
    { id: 'm3', day: 'Today', meal: 'Dinner', dish: 'Paneer bhurji', note: 'Phulka · Seasonal vegetables' },
    { id: 'm4', day: 'Tomorrow', meal: 'Breakfast', dish: 'Poha & chai', note: 'Peanuts · Fresh fruit' },
  ],
  staff: [
    { id: 's1', name: 'Meena Joshi', role: 'Head Cook', phone: '+91 98204 16320', salary: 28000 },
    { id: 's2', name: 'Rakesh Kumar', role: 'Server', phone: '+91 99102 76211', salary: 19000 },
  ],
  expenses: [
    { id: 'e1', date: '2026-09-01', category: 'Inventory', amount: 12400, note: 'Weekly produce purchase' },
    { id: 'e2', date: '2026-09-01', category: 'Gas', amount: 1800, note: 'Cylinder refill' },
    { id: 'e3', date: '2026-08-30', category: 'Maintenance', amount: 950, note: 'Exhaust fan service' },
  ],
  feedback: [
    { id: 'f1', dish: 'Rajma rice', rating: 4, note: 'Comforting and nicely spiced.', date: '2026-09-01' },
  ],
  reminders: [
    { id: 'r1', title: 'Check cooking oil supply', detail: 'Review reorder quantity before the next delivery.', dueDate: today, createdAt: today },
  ],
};

const MessContext = createContext<(MessState & MessActions) | null>(null);

export function MessProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MessState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<MessState>;
          setState({
            ...initialState,
            ...parsed,
            language: parsed.language === 'mr' ? 'mr' : 'en',
            profile: { ...initialState.profile, ...(parsed.profile ?? {}) },
            onboardingComplete: parsed.onboardingComplete === true,
            role: 'owner',
          });
        }
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state, hydrated]);

  const actions = useMemo<MessActions>(() => ({
    setLanguage: (language) => setState((prev) => ({ ...prev, language })),
    completeOwnerSetup: (profile) => setState((prev) => ({ ...prev, profile, onboardingComplete: true, role: 'owner' })),
    markAttendance: (meal, verified, method) => setState((prev) => ({
      ...prev,
      credits: Math.max(0, prev.credits - 1),
      attendance: [
        { id: id(), date: new Date().toISOString().slice(0, 10), meal, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), verified, method },
        ...prev.attendance,
      ],
    })),
    addCustomer: (customer) => setState((prev) => ({ ...prev, customers: [{ ...customer, id: id() }, ...prev.customers] })),
    markCustomerPaid: (customerId) => setState((prev) => ({ ...prev, customers: prev.customers.map((customer) => customer.id === customerId ? { ...customer, paymentStatus: 'Paid' } : customer) })),
    addLeave: (customerId, from, to, reason) => setState((prev) => ({ ...prev, leaves: [{ id: id(), customerId, from, to, reason, status: 'Pending' }, ...prev.leaves] })),
    updateLeaveStatus: (requestId, status) => setState((prev) => ({ ...prev, leaves: prev.leaves.map((leave) => leave.id === requestId ? { ...leave, status } : leave) })),
    addFeedback: (dish, rating, note) => setState((prev) => ({ ...prev, feedback: [{ id: id(), dish, rating, note, date: new Date().toISOString().slice(0, 10) }, ...prev.feedback] })),
    addInventory: (item) => setState((prev) => ({ ...prev, inventory: [{ ...item, id: id() }, ...prev.inventory] })),
    removeInventory: (itemId) => setState((prev) => ({ ...prev, inventory: prev.inventory.filter((item) => item.id !== itemId) })),
    addMenu: (item) => setState((prev) => ({ ...prev, menus: [{ ...item, id: id() }, ...prev.menus] })),
    addStaff: (item) => setState((prev) => ({ ...prev, staff: [{ ...item, id: id() }, ...prev.staff] })),
    addExpense: (item) => setState((prev) => ({ ...prev, expenses: [{ ...item, id: id() }, ...prev.expenses] })),
    addPayment: (item) => setState((prev) => ({ ...prev, payments: [{ ...item, id: id() }, ...prev.payments] })),
    addReminder: (title, daysFromNow, detail = 'Inventory follow-up') => setState((prev) => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.max(0, Math.round(daysFromNow)));
      return {
        ...prev,
        reminders: [
          {
            id: id(),
            title,
            detail,
            dueDate: dueDate.toISOString().slice(0, 10),
            createdAt: new Date().toISOString().slice(0, 10),
          },
          ...prev.reminders,
        ],
      };
    }),
    resolveReminder: (reminderId) => setState((prev) => ({ ...prev, reminders: prev.reminders.filter((reminder) => reminder.id !== reminderId) })),
  }), []);

  return <MessContext.Provider value={{ ...state, ...actions }}>{children}</MessContext.Provider>;
}

export function useMess() {
  const context = useContext(MessContext);
  if (!context) throw new Error('useMess must be used inside MessProvider');
  return context;
}

export function formatDate(value: string, language: Language = 'en') {
  return new Date(`${value}T12:00:00`).toLocaleDateString(language === 'mr' ? 'mr-IN' : undefined, { day: 'numeric', month: 'short' });
}

export function daysUntil(value: string) {
  const diff = new Date(`${value}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}