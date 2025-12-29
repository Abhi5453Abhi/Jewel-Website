import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, category, price, stock, image_url, status } = body;

    // First get the current product
    const current = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    if (current.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const currentProduct = current[0];

    // Update with provided values or keep current values
    const result = await sql`
      UPDATE products
      SET 
        name = ${name !== undefined ? name : currentProduct.name},
        description = ${description !== undefined ? description : currentProduct.description},
        category = ${category !== undefined ? category : currentProduct.category},
        price = ${price !== undefined ? price : currentProduct.price},
        stock = ${stock !== undefined ? stock : currentProduct.stock},
        image_url = ${image_url !== undefined ? image_url : currentProduct.image_url},
        status = ${status !== undefined ? status : currentProduct.status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

