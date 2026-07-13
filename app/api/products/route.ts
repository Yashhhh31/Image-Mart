import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { IProduct } from "@/models/Product";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).lean();

    // Return empty array with 200 status, not 404
    return NextResponse.json(products || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();

    if (
      !body.name ||
      !body.description ||
      body.variants.length === 0 ||
      !body.imageUrl
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newProduct = await Product.create({
      ...body,
      sellerId: session.user.id,
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 },
    );
  }
}