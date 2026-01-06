import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const { role, userName } = useRole();
  const { onLogout } = useAuth();


  const handleLogout = () => {
    Alert.alert(
      'Шығу',
      'Панельден шығу қалайсыз ба?',
      [
        { text: 'Жоқ', style: 'cancel' },
        {
          text: 'Иә, шығу',
          onPress: onLogout, // Use onLogout from AuthContext
          style: 'destructive',
        },
      ]
    );
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'Админ': return 'shield-checkmark';
      case 'Қабылдаушы': return 'cash';
      case 'Курьер': return 'bicycle';
      default: return 'person';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'Админ': return '#FF6B6B';
      case 'Қабылдаушы': return '#4ECDC4';
      case 'Курьер': return '#95E1D3';
      default: return '#888';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatarCircle, { backgroundColor: getRoleColor() }]}>
          <Ionicons name={getRoleIcon()} size={48} color="#FFF" />
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userRole}>{role}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase" size={24} color="#FFD700" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Рөлі</Text>
              <Text style={styles.infoValue}>{role}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={24} color="#95E1D3" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Статус</Text>
              <Text style={styles.infoValue}>Активті</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.permissions}>
        <Text style={styles.permissionsTitle}>Қолжетімділік</Text>
        
        <View style={styles.permissionItem}>
          <Ionicons name="receipt" size={20} color="#4ECDC4" />
          <Text style={styles.permissionText}>Тапсырыстарды көру</Text>
        </View>

        <View style={styles.permissionItem}>
          <Ionicons name="grid" size={20} color="#4ECDC4" />
          <Text style={styles.permissionText}>Үстелдерді көру</Text>
        </View>

        {(role === 'Админ' || role === 'Қабылдаушы') && (
          <View style={styles.permissionItem}>
            <Ionicons name="cash" size={20} color="#4ECDC4" />
            <Text style={styles.permissionText}>Төлемдерді басқару</Text>
          </View>
        )}

        {role === 'Админ' && (
          <View style={styles.permissionItem}>
            <Ionicons name="people" size={20} color="#4ECDC4" />
            <Text style={styles.permissionText}>Қызметкерлерді көру</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Шығу (Logout)</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Staff Panel v1.0</Text>
        <Text style={styles.footerSubtext}>Қазақша</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#16213E',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  infoContainer: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  permissions: {
    padding: 16,
  },
  permissionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  permissionText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  footerSubtext: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
});