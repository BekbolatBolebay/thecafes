import { getPayments, getReceipt, Payment, Receipt } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await getPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Қате:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const viewReceipt = async (orderId: string) => {
    try {
      const response = await getReceipt(orderId);
      setSelectedReceipt(response.data);
    } catch (error) {
      console.error('Қате:', error);
    }
  };

  const shareReceipt = async () => {
    if (!selectedReceipt) return;

    const items = selectedReceipt.items
      .map((item: any, idx: number) => `${idx + 1}. ${item.name} - ₸${item.price}`)
      .join('\n');

    const receiptText = `
ЧЕК
--------------------
Үстел #${selectedReceipt.tableNumber}
--------------------
${items}
--------------------
Жалпы: ₸${selectedReceipt.total}
Төлем: ${selectedReceipt.paymentMethod}
Күні: ${new Date(selectedReceipt.timestamp).toLocaleString('kk-KZ')}
--------------------
Рақмет!
    `;

    try {
      await Share.share({ message: receiptText });
    } catch (error) {
      console.error('Қате:', error);
    }
  };

  const renderPayment = ({ item }: { item: Payment }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.orderInfo}>
          <Ionicons name="receipt" size={24} color="#FFD700" />
          <View style={styles.orderDetails}>
            <Text style={styles.tableText}>Үстел #{item.tableNumber}</Text>
            <Text style={styles.dateText}>
              {new Date(item.timestamp).toLocaleString('kk-KZ')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.amountText}>₸{item.amount.toFixed(2)}</Text>
        <View style={styles.methodContainer}>
          <Ionicons 
            name={item.method === 'Карта' ? 'card' : 'cash'} 
            size={20} 
            color="#4ECDC4" 
          />
          <Text style={styles.methodText}>{item.method}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.receiptButton}
        onPress={() => viewReceipt(item.orderId)}
      >
        <Ionicons name="document-text" size={20} color="#FFF" />
        <Text style={styles.receiptButtonText}>Чекті көру</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Төлемдер</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Жалпы:</Text>
          <Text style={styles.totalAmount}>
            ₸{payments.reduce((sum: number, p: any) => sum + p.amount, 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <FlatList
        data={payments}
        renderItem={renderPayment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}
        ListEmptyComponent={<Text style={styles.emptyText}>Төлемдер жоқ</Text>}
      />

      {/* Receipt Modal */}
      <Modal visible={!!selectedReceipt} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.receiptHeader}>
              <Ionicons name="receipt" size={40} color="#FFD700" />
              <Text style={styles.receiptTitle}>ЧЕК</Text>
            </View>

            {selectedReceipt && (
              <ScrollView style={styles.receiptScroll}>
                <View style={styles.receiptSection}>
                  <Text style={styles.receiptLabel}>Үстел нөмірі:</Text>
                  <Text style={styles.receiptValue}>#{selectedReceipt.tableNumber}</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.itemsTitle}>Тағамдар:</Text>
                {selectedReceipt.items.map((item: any, index: number) => (
                  <View key={index} style={styles.receiptItem}>
                    <Text style={styles.itemName}>{index + 1}. {item.name}</Text>
                    <Text style={styles.itemPrice}>₸{item.price}</Text>
                  </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.receiptSection}>
                  <Text style={styles.receiptLabel}>Жалпы сома:</Text>
                  <Text style={styles.receiptTotal}>₸{selectedReceipt.total.toFixed(2)}</Text>
                </View>

                <View style={styles.receiptSection}>
                  <Text style={styles.receiptLabel}>Төлем әдісі:</Text>
                  <Text style={styles.receiptValue}>{selectedReceipt.paymentMethod}</Text>
                </View>

                <View style={styles.receiptSection}>
                  <Text style={styles.receiptLabel}>Күні:</Text>
                  <Text style={styles.receiptValue}>
                    {new Date(selectedReceipt.timestamp).toLocaleString('kk-KZ')}
                  </Text>
                </View>

                <Text style={styles.thankYou}>Рақмет!</Text>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.shareButton} onPress={shareReceipt}>
                <Ionicons name="share-social" size={20} color="#FFF" />
                <Text style={styles.shareText}>Бөлісу</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedReceipt(null)}>
                <Text style={styles.closeText}>Жабу</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
    backgroundColor: '#16213E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  totalAmount: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetails: {
    marginLeft: 12,
  },
  tableText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  cardContent: {
    marginBottom: 12,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#95E1D3',
    marginBottom: 8,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
    gap: 6,
  },
  receiptButtonText: {
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
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#16213E',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  receiptTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  receiptScroll: {
    maxHeight: 400,
  },
  receiptSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptLabel: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  receiptValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A3F5F',
    marginVertical: 16,
  },
  itemsTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  itemPrice: {
    color: '#95E1D3',
    fontSize: 14,
    fontWeight: '600',
  },
  receiptTotal: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  thankYou: {
    textAlign: 'center',
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
    gap: 8,
  },
  shareText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
