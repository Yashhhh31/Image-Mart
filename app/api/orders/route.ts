import Razorpay from "razorpay";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { productId, variant } = await req.json();

    if (!productId || !variant) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    await connectToDatabase();

    //create rezorPay order
    const order = await razorpay.orders.create({
      amount: Math.round(variant.price * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId: productId.toString(),
      },
    });

    const newOrder = await Order.create({
      userId: session.user.id,
      productId,
      variant,
      razorpayOrderId: order.id,
      amount: Math.round(variant.price * 100),
      status: "PENDING",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      newOrderId: newOrder._id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 },
    );
  }
}
