"use client";

import { IProduct } from "@/lib/product-types";
import ProductCard from "./ProductCard";
import { ImageOff } from "lucide-react";

export default function ImageGallery({ products }: { products: IProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <ImageOff className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Images Available
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Our collection is currently being updated. Check back soon for stunning new images!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <div
          key={product._id?.toString() ?? product.name}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}