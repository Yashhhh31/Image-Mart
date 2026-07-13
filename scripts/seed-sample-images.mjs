/**
 * Seed Sample Images Script
 * 
 * Run: node scripts/seed-sample-images.mjs
 * 
 * This adds sample images with random prices to your MongoDB.
 * These are random placeholder images from ImageKit.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Reads MONGODB_URI from .env (Next.js loads .env automatically)
// Run from project root: node scripts/seed-sample-images.mjs
const MONGODB_URI = process.env.MONGODB_URI;

const sampleImages = [
  {
    name: "Mountain Sunrise",
    description: "Beautiful sunrise over snow-capped mountains with golden light",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/mountain_sunset_AYzRdYdlH.jpg",
    variants: [
      { type: "SQUARE", price: 12.99, license: "PERSONAL" },
      { type: "LANDSCAPE", price: 19.99, license: "COMMERCIAL" },
      { type: "PORTRAIT", price: 14.99, license: "PERSONAL" },
    ],
  },
  {
    name: "Ocean Waves",
    description: "Crystal clear ocean waves crashing on tropical beach shore",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/beach_sunset_gkAd9SzRs.jpg",
    variants: [
      { type: "SQUARE", price: 9.99, license: "PERSONAL" },
      { type: "LANDSCAPE", price: 15.99, license: "COMMERCIAL" },
    ],
  },
  {
    name: "City Night Lights",
    description: "Vibrant city skyline at night with neon lights and reflections",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/city_night_lights_y8WNao39J.jpg",
    variants: [
      { type: "SQUARE", price: 8.99, license: "PERSONAL" },
      { type: "LANDSCAPE", price: 16.99, license: "COMMERCIAL" },
      { type: "PORTRAIT", price: 11.99, license: "PERSONAL" },
    ],
  },
  {
    name: "Forest Path",
    description: "Mystical forest path with sunbeams filtering through trees",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/forest_trees_Bb5WCWlYm.jpg",
    variants: [
      { type: "SQUARE", price: 7.99, license: "PERSONAL" },
      { type: "LANDSCAPE", price: 13.99, license: "COMMERCIAL" },
    ],
  },
  {
    name: "Abstract Art",
    description: "Colorful abstract painting with vibrant patterns and textures",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/abstract_art_L_0tzlJX4.jpg",
    variants: [
      { type: "SQUARE", price: 10.99, license: "PERSONAL" },
      { type: "PORTRAIT", price: 14.99, license: "COMMERCIAL" },
    ],
  },
  {
    name: "Wildlife Portrait",
    description: "Majestic wildlife portrait with stunning detail and natural lighting",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/wildlife_animal_vG9bEUjF2.jpg",
    variants: [
      { type: "SQUARE", price: 11.99, license: "COMMERCIAL" },
      { type: "LANDSCAPE", price: 18.99, license: "COMMERCIAL" },
      { type: "PORTRAIT", price: 13.99, license: "PERSONAL" },
    ],
  },
  {
    name: "Aerial Beach View",
    description: "Drone shot of tropical beach with turquoise water from above",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/aerial_beach_H4H4o-UIw.jpg",
    variants: [
      { type: "SQUARE", price: 9.99, license: "PERSONAL" },
      { type: "LANDSCAPE", price: 17.99, license: "COMMERCIAL" },
    ],
  },
  {
    name: "Tech Workspace",
    description: "Modern minimalist workspace with sleek technology setup",
    imageUrl: "https://ik.imagekit.io/o3yagqjfzs/tech_workspace_F9L6FfBWL.jpg",
    variants: [
      { type: "SQUARE", price: 6.99, license: "PERSONAL" },
      { type: "LANDSCAPE", price: 12.99, license: "COMMERCIAL" },
    ],
  },
];

async function seedSampleImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const productsCollection = db.collection("products");
    const usersCollection = db.collection("users");

    // Find or create a seller user
    let seller = await usersCollection.findOne({ email: "admin@imagemart.com" });
    if (!seller) {
      // Create a default seller
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const result = await usersCollection.insertOne({
        email: "admin@imagemart.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      seller = { _id: result.insertedId };
      console.log("✅ Created admin user: admin@imagemart.com / admin123");
    }

    let created = 0;
    for (const image of sampleImages) {
      const existing = await productsCollection.findOne({ name: image.name });
      if (!existing) {
        await productsCollection.insertOne({
          ...image,
          sellerId: seller._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        created++;
      }
    }

    console.log(`✅ Added ${created} sample images with random prices!`);
    console.log("   Total products now available for browsing & purchasing.");

    await mongoose.disconnect();
    console.log("✅ Done");
  } catch (error) {
    console.error("❌ Error seeding sample images:", error.message);
    process.exit(1);
  }
}

seedSampleImages();