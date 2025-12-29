import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Customer } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    let customers: Customer[];
    
    if (search) {
      customers = await sql`
        SELECT * FROM customers 
        WHERE name ILIKE ${`%${search}%`} OR email ILIKE ${`%${search}%`} OR location ILIKE ${`%${search}%`}
        ORDER BY created_at DESC
      ` as Customer[];
    } else {
      customers = await sql`
        SELECT * FROM customers 
        ORDER BY created_at DESC
      ` as Customer[];
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, location, status = "active" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO customers (name, email, phone, location, status)
      VALUES (${name}, ${email}, ${phone || null}, ${location || null}, ${status})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    if (error.code === "23505") {
      // Unique constraint violation
      return NextResponse.json(
        { error: "Customer with this email already exists" },
        { status: 409 }
      );
    }
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

