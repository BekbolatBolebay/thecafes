export interface Table {
  id: string;
  number: number;
  status: string;
}

export interface OrderItem {
  name: string;
  price: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  tableNumber: number;
  amount: number;
  method: string;
  date: string;
  timestamp: string;
}

export interface Receipt {
  id: string;
  orderId: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  date: string;
  timestamp: string;
}

// Mock data storage
let mockOrders: Order[] = [
  {
    id: '1',
    tableNumber: 1,
    items: [{ name: 'Кофе', price: 500 }, { name: 'Торт', price: 800 }],
    total: 1300,
    status: 'Жаңа',
    paymentStatus: 'Төленбеді',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    tableNumber: 2,
    items: [{ name: 'Чай', price: 300 }],
    total: 300,
    status: 'Дайын',
    paymentStatus: 'Төленді',
    createdAt: new Date().toISOString(),
  },
];

export const getTables = async (): Promise<{ data: Table[] }> => {
  // Mock data
  const mockTables: Table[] = [
    { id: '1', number: 1, status: 'Бос' },
    { id: '2', number: 2, status: 'Толған' },
    { id: '3', number: 3, status: 'Бос' },
    { id: '4', number: 4, status: 'Бронь' },
    { id: '5', number: 5, status: 'Бос' },
    { id: '6', number: 6, status: 'Толған' },
  ];
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockTables };
};

export const getOrders = async (): Promise<{ data: Order[] }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: [...mockOrders] };
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<void> => {
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  mockOrders.push(newOrder);
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
  }
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const payOrder = async (orderId: string, method: string): Promise<void> => {
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.paymentStatus = 'Төленді';
  }
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const getPayments = async (): Promise<{ data: Payment[] }> => {
  // Mock data
  const mockPayments: Payment[] = [
    {
      id: '1',
      orderId: '1',
      tableNumber: 1,
      amount: 1300,
      method: 'Наличные',
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      orderId: '2',
      tableNumber: 2,
      amount: 300,
      method: 'Карта',
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    },
  ];
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockPayments };
};

export const getReceipt = async (orderId: string): Promise<{ data: Receipt }> => {
  // Mock data
  const mockReceipt: Receipt = {
    id: '1',
    orderId,
    tableNumber: 1,
    items: [{ name: 'Кофе', price: 500 }, { name: 'Торт', price: 800 }],
    total: 1300,
    paymentMethod: 'Наличные',
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
  };
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: mockReceipt };
};

export const initializeData = async (): Promise<void> => {
  // Mock initialization
  await new Promise(resolve => setTimeout(resolve, 500));
};