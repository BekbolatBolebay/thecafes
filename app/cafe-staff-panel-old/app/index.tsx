import { useRole } from '@/contexts/RoleContext';
import { initializeData } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelection() {
  const router = useRouter();
  const { setRole } = useRole();

  useEffect(() => {
    // Initialize database with tables and staff
    initializeData().catch(err => console.log('Init error:', err));
  }, []);

  const selectRole = (role: string) => {
    setRole(role as any);
    router.push('/(tabs)/orders' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="restaurant" size={60} color="#FFD700" />
        <Text style={styles.title}>Staff Panel</Text>
        <Text style={styles.subtitle}>Рөліңізді таңдаңыз</Text>
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => selectRole('Админ')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FF6B6B' }]}>
            <Ionicons name="shield-checkmark" size={40} color="#FFF" />
          </View>
          <Text style={styles.roleTitle}>Админ</Text>
          <Text style={styles.roleDesc}>Толық басқару</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => selectRole('Қабылдаушы')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#4ECDC4' }]}>
            <Ionicons name="cash" size={40} color="#FFF" />
          </View>
          <Text style={styles.roleTitle}>Қабылдаушы</Text>
          <Text style={styles.roleDesc}>Тапсырыс қабылдау</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => selectRole('Курьер')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#95E1D3' }]}>
            <Ionicons name="bicycle" size={40} color="#FFF" />
          </View>
          <Text style={styles.roleTitle}>Жіберуші / Курьер</Text>
          <Text style={styles.roleDesc}>Тапсырыс жеткізу</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#B0B0B0',
    marginTop: 8,
  },
  rolesContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#16213E',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleDesc: {
    fontSize: 14,
    color: '#B0B0B0',
  },
});





