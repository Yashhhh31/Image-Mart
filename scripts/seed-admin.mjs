/**
 * Admin Seed Script (ESM version)
 * 
 * Run: node scripts/seed-admin.mjs
 * 
 * Make sure .env file exists with MONGODB_URI defined.
 * Creates admin user:
 *   Email: admin@imagemart.com
 *   Password: admin123
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

// Load .env from project root
config({ path: "../.env" });

async function seedAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in environment variables.");
    console.error("   Make sure you have a .env file with MONGODB_URI set.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: "admin@imagemart.com" });
    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists");
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create admin user
    await usersCollection.insertOne({
      email: "admin@imagemart.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin user created successfully!");
    console.log("   Email:    admin@imagemart.com");
    console.log("   Password: admin123");
    console.log("   Role:     admin");
    console.log("");
i added     console.log("👉 Login at http://localhost:3000/login");
    console.log("👉 Admin panel: http://localhost:3000/admin/products");

    await mongoose.disconnect();
    console.log("✅ Done");
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();