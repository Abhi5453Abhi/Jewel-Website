"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  product_name: string;
  amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/recent-orders"),
      ]);

      if (!statsRes.ok || !ordersRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();

      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusColors = {
    completed: "bg-state-success/10 text-state-success",
    processing: "bg-state-info/10 text-state-info",
    pending: "bg-state-warning/10 text-state-warning",
    shipped: "bg-primary/10 text-primary",
    cancelled: "bg-state-error/10 text-state-error",
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-neutral mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-neutral mt-2">Failed to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange.toFixed(1)}% from last month`,
      changeType: stats.revenueChange >= 0 ? ("positive" as const) : ("negative" as const),
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.ordersChange >= 0 ? "+" : ""}${stats.ordersChange.toFixed(1)}% from last month`,
      changeType: stats.ordersChange >= 0 ? ("positive" as const) : ("negative" as const),
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: `${stats.customersChange >= 0 ? "+" : ""}${stats.customersChange.toFixed(1)}% from last month`,
      changeType: stats.customersChange >= 0 ? ("positive" as const) : ("negative" as const),
      icon: Users,
    },
    {
      title: "Products",
      value: stats.totalProducts.toLocaleString(),
      change: "Total products",
      changeType: "neutral" as const,
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-neutral mt-2">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-display font-bold text-gray-900">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    {order.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        statusColors[order.status as keyof typeof statusColors]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentOrders.length === 0 && (
          <div className="text-center py-8 text-neutral">
            No recent orders found.
          </div>
        )}
      </div>
    </div>
  );
}
