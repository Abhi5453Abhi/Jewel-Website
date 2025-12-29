"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import { Customer } from "@/lib/types";

interface CustomerWithStats extends Customer {
  orderCount?: number;
  totalSpent?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const response = await fetch(`/api/customers?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      
      // Fetch order stats for each customer
      const customersWithStats = await Promise.all(
        data.map(async (customer: Customer) => {
          try {
            const ordersRes = await fetch(
              `/api/orders?search=${encodeURIComponent(customer.email)}`
            );
            if (ordersRes.ok) {
              const orders = await ordersRes.json();
              const customerOrders = orders.filter(
                (o: any) => o.customer_id === customer.id
              );
              const orderCount = customerOrders.length;
              const totalSpent = customerOrders.reduce(
                (sum: number, o: any) => sum + parseFloat(o.amount || 0),
                0
              );
              return { ...customer, orderCount, totalSpent };
            }
          } catch (error) {
            console.error("Error fetching customer stats:", error);
          }
          return { ...customer, orderCount: 0, totalSpent: 0 };
        })
      );
      
      setCustomers(customersWithStats);
    } catch (error) {
      console.error("Error fetching customers:", error);
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

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Customers
          </h1>
          <p className="text-neutral mt-2">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Customers
        </h1>
        <p className="text-neutral mt-2">
          Manage and view all your customer information.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
          <input
            type="text"
            placeholder="Search customers by name, email, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900">
                  {customer.name}
                </h3>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === "active"
                      ? "bg-state-success/10 text-state-success"
                      : "bg-neutral/10 text-neutral"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-neutral">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.location && (
                <div className="flex items-center gap-2 text-sm text-neutral">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.location}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-neutral">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {customer.orderCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral">Total Spent</span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(customer.totalSpent || 0)}
                </span>
              </div>
              <div className="mt-2 text-xs text-neutral">
                Member since {formatDate(customer.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-neutral">No customers found matching your search.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-neutral">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {customers.length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-neutral">Active</p>
          <p className="text-2xl font-bold text-state-success mt-1">
            {customers.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-neutral">Total Orders</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {customers.reduce((sum, c) => sum + (c.orderCount || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-neutral">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(
              customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
