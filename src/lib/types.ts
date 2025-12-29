export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
  status: "active" | "inactive" | "out_of_stock";
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  product_id: string;
  product_name: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

