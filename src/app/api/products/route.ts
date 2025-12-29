import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    let products: Product[];
    
    if (search && category && status) {
      products = await sql`
        SELECT * FROM products 
        WHERE (name ILIKE ${`%${search}%`} OR category ILIKE ${`%${search}%`})
        AND category = ${category}
        AND status = ${status}
        ORDER BY created_at DESC
      ` as Product[];
    } else if (search && category) {
      products = await sql`
        SELECT * FROM products 
        WHERE (name ILIKE ${`%${search}%`} OR category ILIKE ${`%${search}%`})
        AND category = ${category}
        ORDER BY created_at DESC
      ` as Product[];
    } else if (search && status) {
      products = await sql`
        SELECT * FROM products 
        WHERE (name ILIKE ${`%${search}%`} OR category ILIKE ${`%${search}%`})
        AND status = ${status}
        ORDER BY created_at DESC
      ` as Product[];
    } else if (category && status) {
      products = await sql`
        SELECT * FROM products 
        WHERE category = ${category}
        AND status = ${status}
        ORDER BY created_at DESC
      ` as Product[];
    } else if (search) {
      products = await sql`
        SELECT * FROM products 
        WHERE name ILIKE ${`%${search}%`} OR category ILIKE ${`%${search}%`}
        ORDER BY created_at DESC
      ` as Product[];
    } else if (category) {
      products = await sql`
        SELECT * FROM products 
        WHERE category = ${category}
        ORDER BY created_at DESC
      ` as Product[];
    } else if (status) {
      products = await sql`
        SELECT * FROM products 
        WHERE status = ${status}
        ORDER BY created_at DESC
      ` as Product[];
    } else {
      products = await sql`
        SELECT * FROM products 
        ORDER BY created_at DESC
      ` as Product[];
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, price, stock, image_url } = body;

    if (!name || !category || price === undefined || !image_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const status = stock > 0 ? "active" : "out_of_stock";

    const result = await sql`
      INSERT INTO products (name, description, category, price, stock, image_url, status)
      VALUES (${name}, ${description || null}, ${category}, ${price}, ${stock}, ${image_url}, ${status})
      RETURNING *
    ` as Product[];

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

