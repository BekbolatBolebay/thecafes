import { getTables, Table } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function TablesScreen() {
  const [tables, setTables] = useState<Table[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTables();
    const interval = setInterval(loadTables, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const loadTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
    } catch (error) {
      console.error('Қате:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTables();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Бос': return '#95E1D3';
      case 'Толған': return '#FF6B6B';
      case 'Бронь': return '#FFD700';
      default: return '#888';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Бос': return 'checkmark-circle';
      case 'Толған': return 'people';
      case 'Бронь': return 'time';
      default: return 'help-circle';
    }
  };

  const renderTable = ({ item }: { item: Table }) => (
    <View style={[styles.tableCard, { borderLeftColor: getStatusColor(item.status), borderLeftWidth: 6 }]}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableNumber}>Үстел #{item.number}</Text>
        <Ionicons name={getStatusIcon(item.status)} size={32} color={getStatusColor(item.status)} />
      </View>
      <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  const sortedTables = [...tables].sort((a, b) => a.number - b.number);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Үстелдер</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: '#95E1D3' }]} />
            <Text style={styles.statText}>Бос: {tables.filter(t => t.status === 'Бос').length}</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.dot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.statText}>Толған: {tables.filter(t => t.status === 'Толған').length}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={sortedTables}
        renderItem={renderTable}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}
        ListEmptyComponent={<Text style={styles.emptyText}>Үстелдер жоқ</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    padding: 16,
    backgroundColor: '#16213E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  list: {
    padding: 8,
  },
  tableCard: {
    flex: 1,
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    minHeight: 140,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 32,
  },
});