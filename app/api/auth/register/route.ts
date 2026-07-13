import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const newUser = await User.create({ email, password, role: "user" });

    // Verify password was hashed
    console.log(
      "User created. Password hashed:",
      newUser.password.startsWith("$2"),
    );

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during registration:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to register user";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
