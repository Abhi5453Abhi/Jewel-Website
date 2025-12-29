import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Get total revenue
    const revenueResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as total_revenue
      FROM orders
      WHERE status IN ('completed', 'shipped') AND payment_status = 'paid'
    `;
    const totalRevenue = parseFloat(revenueResult[0]?.total_revenue || "0");

    // Get total orders
    const ordersResult = await sql`
      SELECT COUNT(*) as total_orders FROM orders
    `;
    const totalOrders = parseInt(ordersResult[0]?.total_orders || "0");

    // Get total customers
    const customersResult = await sql`
      SELECT COUNT(*) as total_customers FROM customers
    `;
    const totalCustomers = parseInt(customersResult[0]?.total_customers || "0");

    // Get total products
    const productsResult = await sql`
      SELECT COUNT(*) as total_products FROM products
    `;
    const totalProducts = parseInt(productsResult[0]?.total_products || "0");

    // Get revenue from last month for comparison
    const lastMonthRevenueResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as total_revenue
      FROM orders
      WHERE status IN ('completed', 'shipped') 
        AND payment_status = 'paid'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND created_at < CURRENT_DATE - INTERVAL '1 day'
    `;
    const lastMonthRevenue = parseFloat(
      lastMonthRevenueResult[0]?.total_revenue || "0"
    );

    // Get orders from last month
    const lastMonthOrdersResult = await sql`
      SELECT COUNT(*) as total_orders
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND created_at < CURRENT_DATE - INTERVAL '1 day'
    `;
    const lastMonthOrders = parseInt(
      lastMonthOrdersResult[0]?.total_orders || "0"
    );

    // Get customers from last month
    const lastMonthCustomersResult = await sql`
      SELECT COUNT(*) as total_customers
      FROM customers
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        AND created_at < CURRENT_DATE - INTERVAL '1 day'
    `;
    const lastMonthCustomers = parseInt(
      lastMonthCustomersResult[0]?.total_customers || "0"
    );

    // Calculate percentage changes
    const revenueChange =
      lastMonthRevenue > 0
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;
    const ordersChange =
      lastMonthOrders > 0
        ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0;
    const customersChange =
      lastMonthCustomers > 0
        ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
        : 0;

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10,
      customersChange: Math.round(customersChange * 10) / 10,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

