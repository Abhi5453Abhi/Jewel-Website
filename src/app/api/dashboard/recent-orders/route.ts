import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const orders = await sql`
      SELECT 
        o.id,
        o.customer_name,
        o.product_name,
        o.amount,
        o.status,
        o.payment_status,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 5
    `;

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}

