"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "./components/ImageGallery";
import { IProduct } from "@/lib/product-types";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowRight,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Sparkles,
  TrendingUp,
  Camera,
  Palette,
  DollarSign,
} from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const features = [
    {
      icon: Camera,
      title: "Premium Quality",
      description: "High-resolution images perfect for any project",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Palette,
      title: "Multiple Variants",
      description: "Each image comes in various sizes and licenses",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Instant Download",
      description: "Get your purchased images immediately after payment",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Protected by Razorpay with SSL encryption",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Premium Stock Images Marketplace</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Stunning{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-300">
                  Images
                </span>{" "}
                for Your Next Project
              </h1>

              <p className="text-lg md:text-xl text-blue-100 max-w-xl">
                Browse through our curated collection of high-quality images.
                Perfect for personal and commercial use.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#gallery"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
                >
                  Browse Gallery
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {session ? (
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:from-green-300 hover:to-emerald-300 transition-all shadow-xl hover:shadow-2xl"
                  >
                    <DollarSign className="w-5 h-5" />
                    Sell Your Images
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Join Now
                    <TrendingUp className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">{products.length}</div>
                  <div className="text-sm text-blue-200">Images Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">3+</div>
                  <div className="text-sm text-blue-200">Size Variants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-blue-200">Secure</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl transform rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-3xl transform -rotate-3" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <img
                      src="/logo.png"
                      alt="ImageMart"
                      className="w-48 h-48 mx-auto rounded-3xl shadow-2xl object-cover opacity-90"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#f8fafc">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose ImageMart?</h2>
            <p className="section-subtitle mx-auto text-lg">
              We provide the best quality images with flexible licensing options
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-ecommerce p-6 text-center group hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 mx-auto bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="section-title">Available Images</h2>
              <p className="section-subtitle">
                Browse our collection and find the perfect image for your needs
              </p>
            </div>
            <div className="flex gap-3">
              {session && (
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
                >
                  <DollarSign className="w-5 h-5" />
                  Sell Your Images
                </Link>
              )}
              {session?.user?.role === "admin" && (
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
                >
                  <ImageIcon className="w-5 h-5" />
                  Add New Image
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ImageGallery products={products} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Selling Your Images?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join ImageMart today and start buying premium images for your
              projects. Quick registration, instant access.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-xl hover:shadow-2xl text-lg"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}