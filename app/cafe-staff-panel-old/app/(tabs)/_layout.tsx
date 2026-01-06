import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useRole } from '../../contexts/RoleContext';

export default function TabLayout() {
  const { role } = useRole();
  const isAdmin = role === 'Админ';
  const canSeePayments = isAdmin || role === 'Қабылдаушы';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#16213E',
          borderTopColor: '#2A3F5F',
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: '#1A1A2E',
        },
        headerTintColor: '#FFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Тапсырыстар',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tables"
        options={{
          title: 'Үстелдер',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Төлемдер',
          href: canSeePayments ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Сурет жүктеу',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
