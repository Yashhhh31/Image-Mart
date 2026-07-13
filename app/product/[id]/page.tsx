"use client";

import { IKImage } from "imagekitio-react";
import {
  IProduct,
  ImageVariant,
  IMAGE_VARIANT_TYPES,
  ImageVariantType,
} from "@/lib/product-types";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  Check,
  ShoppingCart,
  Shield,
  ArrowLeft,
  Image as ImageIcon,
  Download,
  Lock,
} from "lucide-react";
import { useNotification } from "@/app/components/Notification";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(
    null
  );
  const [purchasing, setPurchasing] = useState(false);
  const { showNotification } = useNotification();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      const id = params?.id;

      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await apiClient.getProduct(id.toString());
        setProduct(data);
        if (data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handlePurchase = async (variant: ImageVariant) => {
    if (!session) {
      showNotification("Please login to make a purchase", "error");
      router.push("/login");
      return;
    }

    if (!product?._id) {
      showNotification("Invalid product", "error");
      return;
    }

    setPurchasing(true);
    try {
      const { orderId, amount } = await apiClient.createOrder({
        productId: product._id,
        variant,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "USD",
        name: "ImageMart",
        description: `${product.name} - ${variant.type} Version`,
        order_id: orderId,
        handler: function () {
          showNotification("Payment successful! You can now download your image.", "success");
          router.push("/orders");
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      showNotification(
        error instanceof Error ? error.message : "Payment failed",
        "error"
      );
    } finally {
      setPurchasing(false);
    }
  };

  const getTransformation = (variantType: ImageVariantType) => {
    const variant = IMAGE_VARIANT_TYPES[variantType];
    return [
      {
        width: variant.dimensions.width,
        height: variant.dimensions.height,
        cropMode: "extract" as const,
        focus: "center",
        quality: 80,
      },
    ];
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "This product doesn't exist or has been removed."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Gallery
          </Link>
        </div>
      </div>
    );

  const mainVariant = selectedVariant || product.variants[0];
  const variantInfo = mainVariant ? IMAGE_VARIANT_TYPES[mainVariant.type] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              style={{
                aspectRatio: variantInfo
                  ? `${variantInfo.dimensions.width} / ${variantInfo.dimensions.height}`
                  : "1 / 1",
              }}
            >
              <IKImage
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                path={product.imageUrl}
                alt={product.name}
                transformation={mainVariant ? getTransformation(mainVariant.type) : getTransformation("SQUARE")}
                className="w-full h-full object-cover"
              />
              {/* Watermark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Variant Preview Thumbnails */}
            {product.variants.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.variants.map((variant) => {
                  const vInfo = IMAGE_VARIANT_TYPES[variant.type];
                  return (
                    <button
                      key={variant.type}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedVariant?.type === variant.type
                          ? "border-blue-500 shadow-md ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="relative w-full h-full bg-gray-100">
                        <IKImage
                          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                          path={product.imageUrl}
                          alt={variant.type}
                          transformation={[
                            { width: 100, height: 100, cropMode: "extract", focus: "center", quality: 40 },
                          ]}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Image Dimensions Info */}
            {mainVariant && variantInfo && (
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500 bg-white rounded-xl px-4 py-3 border border-gray-100">
                <ImageIcon className="w-4 h-4" />
                <span>
                  Preview: {variantInfo.dimensions.width} x {variantInfo.dimensions.height}px
                </span>
                <span className="text-gray-300">|</span>
                <span>{variantInfo.label}</span>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Selected Variant Details */}
            {mainVariant && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Selected Size</span>
                  <span className="text-sm font-medium text-blue-600">
                    {mainVariant.license} LICENSE
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">
                      {variantInfo?.label} ({variantInfo?.dimensions.width}x{variantInfo?.dimensions.height})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {mainVariant.license === "COMMERCIAL" ? "✓ Commercial use allowed" : "✓ Personal use only"}
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    ${mainVariant.price.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Variants Selection Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Your Version
              </h2>
              <div className="grid gap-3">
                {product.variants.map((variant) => {
                  const vInfo = IMAGE_VARIANT_TYPES[variant.type];
                  const isSelected = selectedVariant?.type === variant.type;
                  return (
                    <div
                      key={variant.type}
                      className={`relative rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isSelected ? "bg-blue-500" : "bg-gray-100"
                            }`}>
                              <ImageIcon className={`w-5 h-5 ${
                                isSelected ? "text-white" : "text-gray-500"
                              }`} />
                            </div>
                            <div>
                              <h3 className={`font-semibold ${
                                isSelected ? "text-blue-700" : "text-gray-900"
                              }`}>
                                {vInfo?.label}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {vInfo?.dimensions.width} x {vInfo?.dimensions.height}px • {variant.license} license
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-gray-900">
                              ${variant.price.toFixed(2)}
                            </span>
                            {isSelected && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchase Button */}
            {mainVariant && (
              <button
                onClick={() => handlePurchase(mainVariant)}
                disabled={purchasing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchasing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Purchase for ${mainVariant.price.toFixed(2)}
                  </>
                )}
              </button>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100">
                <Download className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 font-medium">Instant Download</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600 font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100">
                <Lock className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600 font-medium">SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100">
                <Check className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-gray-600 font-medium">High Quality</span>
              </div>
            </div>

            {/* License Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">License Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Personal Use</p>
                    <p className="text-sm text-gray-500">Use in personal projects, portfolios, and presentations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Commercial Use</p>
                    <p className="text-sm text-gray-500">Use in commercial projects, websites, and marketing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}