"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload, { IKUploadResponse } from "../components/FileUpload";
import {
  Loader2,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useNotification } from "../components/Notification";
import { IMAGE_VARIANT_TYPES, ImageVariantType } from "@/lib/product-types";
import { apiClient, ProductFormData } from "@/lib/api-client";
import Link from "next/link";

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      variants: [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "PERSONAL",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("imageUrl", response.filePath);
    showNotification("Image uploaded to ImageKit!", "success");
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Your image is now listed for sale! 🎉", "success");
      setValue("name", "");
      setValue("description", "");
      setValue("imageUrl", "");
      setValue("variants", [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "PERSONAL",
        },
      ]);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to list image",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  if (status === "unauthenticated") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to sell your images.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Sell Image</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sell Your Image
              </h1>
              <p className="text-gray-500 mt-1">
                Upload your image, set a price, and start earning
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              1. Upload Your Image
            </h2>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50/50 hover:bg-gray-50 transition-colors text-center">
              <FileUpload onSuccess={handleUploadSuccess} />
              <p className="text-xs text-gray-400 mt-3">
                Supported: JPEG, PNG, GIF, WebP • Max 5MB
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-500" />
              2. Image Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Image Title
              </label>
              <input
                type="text"
                className={`input-field ${errors.name ? "ring-2 ring-red-500/20 border-red-500" : ""}`}
                placeholder="e.g. Sunset Mountain Landscape"
                {...register("name", { required: "Title is required" })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                className={`input-field h-24 resize-none ${
                  errors.description ? "ring-2 ring-red-500/20 border-red-500" : ""
                }`}
                placeholder="Describe your image..."
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                3. Set Pricing
              </h2>
              <span className="text-sm text-gray-500">
                {fields.length} size(s)
              </span>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-700">
                    Size #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Size
                    </label>
                    <select
                      className="input-field"
                      {...register(`variants.${index}.type`)}
                    >
                      {Object.entries(IMAGE_VARIANT_TYPES).map(
                        ([key, value]) => (
                          <option key={key} value={value.type}>
                            {value.label} ({value.dimensions.width}x
                            {value.dimensions.height})
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      License
                    </label>
                    <select
                      className="input-field"
                      {...register(`variants.${index}.license`)}
                    >
                      <option value="PERSONAL">Personal Use</option>
                      <option value="COMMERCIAL">Commercial Use</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className={`input-field ${
                        errors.variants?.[index]?.price
                          ? "ring-2 ring-red-500/20 border-red-500"
                          : ""
                      }`}
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                        required: "Price is required",
                        min: {
                          value: 0.01,
                          message: "Price must be greater than 0",
                        },
                      })}
                    />
                    {errors.variants?.[index]?.price && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {errors.variants[index]?.price?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  type: "SQUARE" as ImageVariantType,
                  price: 9.99,
                  license: "PERSONAL",
                })
              }
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Size
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Listing Your Image...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                List Image for Sale
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}