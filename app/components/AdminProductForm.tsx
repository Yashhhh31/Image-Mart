"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload, { IKUploadResponse } from "./FileUpload";
import { Loader2, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useNotification } from "./Notification";
import { IMAGE_VARIANT_TYPES, ImageVariantType } from "@/lib/product-types";
import { apiClient, ProductFormData } from "@/lib/api-client";

export default function AdminProductForm() {
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
    showNotification("Image uploaded successfully!", "success");
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");

      // Reset form after successful submission
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
        error instanceof Error ? error.message : "Failed to create product",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          Product Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            className={`input-field ${errors.name ? "ring-2 ring-red-500/20 border-red-500" : ""}`}
            placeholder="Enter a name for your image"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>
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
            placeholder="Describe what makes this image special..."
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.description.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Product Image
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <FileUpload onSuccess={handleUploadSuccess} />
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Image Variants</h2>
          <span className="text-sm text-gray-500">{fields.length} variant(s)</span>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">
                Variant #{index + 1}
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
                  Size & Aspect Ratio
                </label>
                <select
                  className="input-field"
                  {...register(`variants.${index}.type`)}
                >
                  {Object.entries(IMAGE_VARIANT_TYPES).map(([key, value]) => (
                    <option key={key} value={value.type}>
                      {value.label} ({value.dimensions.width}x{value.dimensions.height})
                    </option>
                  ))}
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
                    errors.variants?.[index]?.price ? "ring-2 ring-red-500/20 border-red-500" : ""
                  }`}
                  {...register(`variants.${index}.price`, {
                    valueAsNumber: true,
                    required: "Price is required",
                    min: { value: 0.01, message: "Price must be greater than 0" },
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
          Add Another Variant
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Product...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Create Product
          </>
        )}
      </button>
    </form>
  );
}