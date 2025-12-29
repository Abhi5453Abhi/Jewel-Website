"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";

export default function AnalyticsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock data - in a real app, this would come from an API
  const revenueData = [
    { month: "Jan", revenue: 32000 },
    { month: "Feb", revenue: 28000 },
    { month: "Mar", revenue: 35000 },
    { month: "Apr", revenue: 42000 },
    { month: "May", revenue: 38000 },
    { month: "Jun", revenue: 45231 },
  ];

  const topProducts = [
    { name: "Diamond Rings", sales: 145, revenue: 35525 },
    { name: "Gold Necklaces", sales: 98, revenue: 18522 },
    { name: "Pearl Earrings", sales: 76, revenue: 4940 },
    { name: "Platinum Bracelets", sales: 54, revenue: 17280 },
    { name: "Silver Pendants", sales: 42, revenue: 1764 },
  ];

  const categoryDistribution = [
    { category: "Rings", percentage: 35, color: "bg-primary" },
    { category: "Necklaces", percentage: 25, color: "bg-secondary" },
    { category: "Earrings", percentage: 20, color: "bg-state-info" },
    { category: "Bracelets", percentage: 15, color: "bg-state-success" },
    { category: "Pendants", percentage: 5, color: "bg-state-warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Analytics
        </h1>
        <p className="text-neutral mt-2">
          Track your store's performance and insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm text-state-success font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <p className="text-sm text-neutral mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(210231)}</p>
          <p className="text-xs text-neutral mt-2">Last 6 months</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-state-info/10 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-state-info" />
            </div>
            <span className="text-sm text-state-success font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8.2%
            </span>
          </div>
          <p className="text-sm text-neutral mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">7,234</p>
          <p className="text-xs text-neutral mt-2">Last 6 months</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-state-success/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-state-success" />
            </div>
            <span className="text-sm text-state-success font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +15.3%
            </span>
          </div>
          <p className="text-sm text-neutral mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">5,892</p>
          <p className="text-xs text-neutral mt-2">Last 6 months</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-secondary/10 p-3 rounded-lg">
              <Package className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-sm text-neutral font-medium">—</span>
          </div>
          <p className="text-sm text-neutral mb-1">Average Order Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(29)}</p>
          <p className="text-xs text-neutral mt-2">Last 6 months</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
          Revenue Trend
        </h2>
        <div className="space-y-4">
          {revenueData.map((data, index) => {
            const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
            const percentage = (data.revenue / maxRevenue) * 100;
            return (
              <div key={data.month} className="flex items-center gap-4">
                <div className="w-16 text-sm text-neutral">{data.month}</div>
                <div className="flex-1">
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary rounded-lg transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-medium text-gray-900">
                        {formatCurrency(data.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
            Top Products
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-neutral">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
            Sales by Category
          </h2>
          <div className="space-y-4">
            {categoryDistribution.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {item.category}
                  </span>
                  <span className="text-sm text-neutral">
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
            Conversion Rate
          </h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">3.2%</p>
            <p className="text-sm text-neutral">Website visitors to customers</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
            Customer Retention
          </h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-state-success mb-2">68%</p>
            <p className="text-sm text-neutral">Repeat customers</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-display font-bold text-gray-900 mb-4">
            Cart Abandonment
          </h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-state-warning mb-2">24%</p>
            <p className="text-sm text-neutral">Abandoned carts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

