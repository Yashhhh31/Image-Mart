import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { connect } from "http2";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const signature = req.headers.get("x-razorpay-signature");

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(JSON.stringify(body))
            .digest("hex");

        if (signature !== expectedSignature) {
            return NextResponse.json({error: "Invalid signature"}, {status: 400});
        }

        const event = JSON.parse(body);
        await connectToDatabase();

        if(event.event === "payment.captured") {
            const paymentId = event.payload.payment.entity;
            const amount = event.payload.payment.entity.amount;
            const currency = event.payload.payment.entity.currency;
            const email = event.payload.payment.entity.email;

            const order = await Order.findOneAndUpdate(
                { paymentId: paymentId },
                { status: "completed" },
            ).populate([
                {path: "productId", select: "name"},
                {path: "userId", select: "email"}
            ])

            if(order){
                await sendEmail({
                    to: order.userId.email,
                    subject: "Payment Successful",
                    html: `<p>Dear ${order.userId.name},</p><p>Your payment of ${amount / 100} ${currency} has been received successfully.</p>`
                });
            }

            return NextResponse.json({ message: "Payment captured and order updated successfully Check Your Email" }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
    }
}