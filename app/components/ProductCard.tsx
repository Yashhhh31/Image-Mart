"use client";

import { IKImage } from "imagekitio-react";
import Link from "next/link";
import { IProduct, IMAGE_VARIANT_TYPES } from "@/lib/product-types";
import { Eye, ShoppingCart, DollarSign, Layers } from "lucide-react";

export default function ProductCard({ product }: { product: IProduct }) {
  const lowestPrice = product.variants.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants[0]?.price || 0,
  );

  const hasCommercial = product.variants.some(
    (v) => v.license === "COMMERCIAL"
  );

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link
          href={`/product/${product._id}`}
          className="block relative w-full"
          style={{
            aspectRatio:
              IMAGE_VARIANT_TYPES.SQUARE.dimensions.width /
              IMAGE_VARIANT_TYPES.SQUARE.dimensions.height,
          }}
        >
          <IKImage
            path={product.imageUrl}
            alt={product.name}
            transformation={[
              {
                height: IMAGE_VARIANT_TYPES.SQUARE.dimensions.height,
                width: IMAGE_VARIANT_TYPES.SQUARE.dimensions.width,
                cropMode: "extract",
                focus: "center",
                quality: 80,
              },
            ]}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md">
            New
          </span>
          {hasCommercial && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md">
              Commercial
            </span>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
          From ${lowestPrice.toFixed(2)}
        </div>

        {/* Quick View Button */}
        <Link
          href={`/product/${product._id}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
        >
          <Eye className="w-4 h-4" />
          Quick View
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <Link
          href={`/product/${product._id}`}
          className="block group-hover:text-blue-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 mt-1.5 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Variants Info */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Layers className="w-3.5 h-3.5" />
            <span>{product.variants.length} sizes</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <DollarSign className="w-3.5 h-3.5" />
            <span>
              ${Math.min(...product.variants.map((v) => v.price)).toFixed(2)} - $
              {Math.max(...product.variants.map((v) => v.price)).toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/product/${product._id}`}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="w-4 h-4" />
          View Options
        </Link>
      </div>
    </div>
  );
}