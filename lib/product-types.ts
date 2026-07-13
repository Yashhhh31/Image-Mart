import type { Types } from "mongoose";

export const IMAGE_VARIANT_TYPES = {
  SQUARE: {
    type: "SQUARE",
    dimensions: { width: 1200, height: 1200 },
    label: "Square (1:1)",
    aspectRatio: "1:1",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: { width: 1080, height: 1440 },
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
  LANDSCAPE: {
    type: "LANDSCAPE",
    dimensions: { width: 1920, height: 1080 },
    label: "Landscape (16:9)",
    aspectRatio: "16:9",
  },
} as const;

export type ImageVariantType = keyof typeof IMAGE_VARIANT_TYPES;

export interface ImageVariant {
  type: ImageVariantType;
  price: number;
  license: "PERSONAL" | "COMMERCIAL";
}

export interface IProduct {
  name: string;
  description: string;
  imageUrl: string;
  variants: ImageVariant[];
  _id?: Types.ObjectId | string;
  sellerId?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}
