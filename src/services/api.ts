const API_BASE_URL = 'http://localhost:5000/api';

export interface Table {
  id: string;
  name: string;
  seats: number;
  category: string;
  status: "available" | "occupied";
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  category: string;
  department: string;
  quantity: number;
  sentToKitchen?: boolean;
}

export interface TableOrder {
  tableId: string;
  tableName: string;
  items: OrderItem[];
  startTime: string;
}

export interface Invoice {
  id: string;
  billNumber: string;
  orderType: "dine-in" | "takeaway";
  tableName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  timestamp: string;
}

export interface KOTConfig {
  printByDepartment: boolean;
  numberOfCopies: number;
}

export interface BillConfig {
  autoPrintDineIn: boolean;
  autoPrintTakeaway: boolean;
}

// Table API
export const getTables = async (): Promise<Table[]> => {
  const response = await fetch(`${API_BASE_URL}/tables`);
  return response.json();
};

export const createTable = async (table: Omit<Table, 'id'>): Promise<Table> => {
  const response = await fetch(`${API_BASE_URL}/tables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: table.name,
      seats: table.seats,
      category: table.category,
      status: table.status,
    }),
  });
  return response.json();
};

export const updateTable = async (tableId: string, table: Partial<Table>): Promise<Table> => {
  const response = await fetch(`${API_BASE_URL}/tables/${tableId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(table),
  });
  return response.json();
};

export const deleteTable = async (tableId: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/tables/${tableId}`, {
    method: 'DELETE',
  });
};

// Order API
export const getTableOrder = async (tableId: string): Promise<TableOrder | null> => {
  const response = await fetch(`${API_BASE_URL}/orders/table/${tableId}`);
  return response.json();
};

export const addItemsToTable = async (tableId: string, tableName: string, items: OrderItem[]): Promise<TableOrder> => {
  const response = await fetch(`${API_BASE_URL}/orders/table/${tableId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      table_name: tableName,
      items,
    }),
  });
  return response.json();
};

export const markItemsAsSent = async (tableId: string): Promise<TableOrder> => {
  const response = await fetch(`${API_BASE_URL}/orders/table/${tableId}/sent`, {
    method: 'POST',
  });
  return response.json();
};

export const completeTableOrder = async (tableId: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/orders/table/${tableId}/complete`, {
    method: 'POST',
  });
};

// Invoice API
export const getInvoices = async (): Promise<Invoice[]> => {
  const response = await fetch(`${API_BASE_URL}/invoices`);
  return response.json();
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      billNumber: invoice.billNumber,
      orderType: invoice.orderType,
      tableName: invoice.tableName,
      items: invoice.items,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      timestamp: invoice.timestamp,
    }),
  });
  return response.json();
};

// Config API
export const getKOTConfig = async (): Promise<KOTConfig> => {
  const response = await fetch(`${API_BASE_URL}/config/kot`);
  return response.json();
};

export const updateKOTConfig = async (config: KOTConfig): Promise<KOTConfig> => {
  const response = await fetch(`${API_BASE_URL}/config/kot`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      printByDepartment: config.printByDepartment,
      numberOfCopies: config.numberOfCopies,
    }),
  });
  return response.json();
};

export const getBillConfig = async (): Promise<BillConfig> => {
  const response = await fetch(`${API_BASE_URL}/config/bill`);
  return response.json();
};

export const updateBillConfig = async (config: BillConfig): Promise<BillConfig> => {
  const response = await fetch(`${API_BASE_URL}/config/bill`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      autoPrintDineIn: config.autoPrintDineIn,
      autoPrintTakeaway: config.autoPrintTakeaway,
    }),
  });
  return response.json();
};

// Auth API
export const login = async (email: string, password: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return response.ok;
};