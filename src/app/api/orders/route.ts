import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Order } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    let orders;
    
    if (search && status && status !== "All") {
      orders = await sql<Order[]>`
        SELECT * FROM orders 
        WHERE (id::text ILIKE ${`%${search}%`} OR customer_name ILIKE ${`%${search}%`} OR product_name ILIKE ${`%${search}%`})
        AND status = ${status.toLowerCase()}
        ORDER BY created_at DESC 
        LIMIT 100
      `;
    } else if (search) {
      orders = await sql<Order[]>`
        SELECT * FROM orders 
        WHERE id::text ILIKE ${`%${search}%`} OR customer_name ILIKE ${`%${search}%`} OR product_name ILIKE ${`%${search}%`}
        ORDER BY created_at DESC 
        LIMIT 100
      `;
    } else if (status && status !== "All") {
      orders = await sql<Order[]>`
        SELECT * FROM orders 
        WHERE status = ${status.toLowerCase()}
        ORDER BY created_at DESC 
        LIMIT 100
      `;
    } else {
      orders = await sql<Order[]>`
        SELECT * FROM orders 
        ORDER BY created_at DESC 
        LIMIT 100
      `;
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      customer_name,
      customer_email,
      product_id,
      product_name,
      amount,
      status = "pending",
      payment_status = "pending",
    } = body;

    if (
      !customer_id ||
      !customer_name ||
      !customer_email ||
      !product_id ||
      !product_name ||
      amount === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO orders (
        customer_id, customer_name, customer_email,
        product_id, product_name, amount, status, payment_status
      )
      VALUES (
        ${customer_id}, ${customer_name}, ${customer_email},
        ${product_id}, ${product_name}, ${amount}, ${status}, ${payment_status}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

