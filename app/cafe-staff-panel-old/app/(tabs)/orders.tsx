import { useRole } from '@/contexts/RoleContext';
import { createOrder, getOrders, Order, payOrder, updateOrderStatus } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface NewOrderItem {
  name: string;
  price: string;
}

export default function OrdersScreen() {
  const { role } = useRole();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showPayment, setShowPayment] = useState<Order | null>(null);
  
  const [newOrder, setNewOrder] = useState({
    tableNumber: '',
    items: [{ name: '', price: '' }] as NewOrderItem[],
  });

  const isAdmin = role === 'Админ';
  const isReceptionist = role === 'Қабылдаушы';
  const isCourier = role === 'Курьер';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Қате:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleStatusChange = async (orderId: string, currentStatus: string) => {
    let newStatus = '';
    if (currentStatus === 'Жаңа') newStatus = 'Дайын';
    else if (currentStatus === 'Дайын') newStatus = 'Жеткізілді';
    
    if (!newStatus) return;

    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Қате:', error);
    }
  };

  const handlePayment = async (method: string) => {
    if (!showPayment) return;

    try {
      await payOrder(showPayment.id, method);
      setShowPayment(null);
      loadOrders();
      Alert.alert('Сәтті', 'Төлем жасалды');
    } catch (error) {
      console.error('Қате:', error);
      Alert.alert('Қате', 'Төлем жасау сәтсіз аяқталды');
    }
  };

  const handleCreateOrder = async () => {
    const items = newOrder.items.filter(item => item.name && item.price);
    if (!newOrder.tableNumber || items.length === 0) {
      Alert.alert('Қате', 'Барлық өрістерді толтырыңыз');
      return;
    }

    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const order = {
      tableNumber: parseInt(newOrder.tableNumber),
      items: items.map(item => ({ name: item.name, price: parseFloat(item.price) })),
      total,
      status: 'Жаңа',
      paymentStatus: 'Төленбеді',
    };

    try {
      await createOrder(order);
      setShowNewOrder(false);
      setNewOrder({ tableNumber: '', items: [{ name: '', price: '' }] });
      loadOrders();
      Alert.alert('Сәтті', 'Тапсырыс жасалды');
    } catch (error) {
      console.error('Қате:', error);
      Alert.alert('Қате', 'Тапсырыс жасау сәтсіз аяқталды');
    }
  };

  const addItem = () => {
    setNewOrder({ ...newOrder, items: [...newOrder.items, { name: '', price: '' }] });
  };

  const updateItem = (index: number, field: keyof NewOrderItem, value: string) => {
    const items = [...newOrder.items];
    items[index][field] = value;
    setNewOrder({ ...newOrder, items });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Жаңа': return '#FF6B6B';
      case 'Дайын': return '#4ECDC4';
      case 'Жеткізілді': return '#95E1D3';
      default: return '#888';
    }
  };

  const canChangeStatus = (status: string) => {
    if (isAdmin) return true;
    if (isReceptionist && status === 'Жаңа') return true;
    if (isCourier && status === 'Дайын') return true;
    return false;
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.tableInfo}>
          <Ionicons name="restaurant" size={24} color="#FFD700" />
          <Text style={styles.tableNumber}>Үстел #{item.tableNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.totalText}>₸{item.total.toFixed(2)}</Text>
        <View style={styles.paymentInfo}>
          <Text style={[styles.paymentStatus, { color: item.paymentStatus === 'Төленді' ? '#95E1D3' : '#FF6B6B' }]}>
            {item.paymentStatus}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {canChangeStatus(item.status) && item.status !== 'Жеткізілді' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4ECDC4' }]}
            onPress={() => handleStatusChange(item.id, item.status)}
          >
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Келесі статус</Text>
          </TouchableOpacity>
        )}
        
        {isAdmin && item.paymentStatus === 'Төленбеді' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#95E1D3' }]}
            onPress={() => setShowPayment(item)}
          >
            <Ionicons name="card" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Төлем жасау</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Тапсырыстар</Text>
        {isAdmin && (
          <TouchableOpacity onPress={() => setShowNewOrder(true)}>
            <Ionicons name="add-circle" size={32} color="#FFD700" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}
        ListEmptyComponent={<Text style={styles.emptyText}>Тапсырыс жоқ</Text>}
      />

      {/* New Order Modal */}
      <Modal visible={showNewOrder} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Жаңа тапсырыс</Text>
            
            <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>Үстел нөмірі</Text>
              <TextInput
                style={styles.input}
                value={newOrder.tableNumber}
                onChangeText={(text) => setNewOrder({ ...newOrder, tableNumber: text })}
                keyboardType="number-pad"
                placeholder="1-15"
                placeholderTextColor="#666"
              />

              <Text style={styles.label}>Тағамдар</Text>
              {newOrder.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <TextInput
                    style={[styles.input, { flex: 2 }]}
                    value={item.name}
                    onChangeText={(text) => updateItem(index, 'name', text)}
                    placeholder="Тағам атауы"
                    placeholderTextColor="#666"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    value={item.price}
                    onChangeText={(text) => updateItem(index, 'price', text)}
                    keyboardType="decimal-pad"
                    placeholder="Бағасы"
                    placeholderTextColor="#666"
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
                <Ionicons name="add" size={20} color="#4ECDC4" />
                <Text style={styles.addItemText}>Тағам қосу</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowNewOrder(false)}>
                <Text style={styles.cancelText}>Болдырмау</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateOrder}>
                <Text style={styles.createText}>Жасау</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={!!showPayment} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Төлем әдісін таңдаңыз</Text>
            
            <TouchableOpacity
              style={[styles.paymentMethod, { backgroundColor: '#4ECDC4' }]}
              onPress={() => handlePayment('Қолма-қол')}
            >
              <Ionicons name="cash" size={32} color="#FFF" />
              <Text style={styles.paymentMethodText}>Қолма-қол</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentMethod, { backgroundColor: '#95E1D3' }]}
              onPress={() => handlePayment('Карта')}
            >
              <Ionicons name="card" size={32} color="#FFF" />
              <Text style={styles.paymentMethodText}>Карта</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPayment(null)}>
              <Text style={styles.cancelText}>Болдырмау</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#16213E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  cardContent: {
    marginBottom: 12,
  },
  totalText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#16213E',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  formScroll: {
    maxHeight: 400,
  },
  label: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1A1A2E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  addItemText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
  },
  createText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  paymentMethodText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});