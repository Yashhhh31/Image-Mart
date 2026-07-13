import { IOrder } from "@/models/Order";
import { IProduct, ImageVariant } from "@/lib/product-types";
import { Types } from "mongoose";

export type ProductFormData = Omit<IProduct, "_id">;

export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: ImageVariant;
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error [${response.status}]:`, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async getProducts() {
    return this.fetch<IProduct[]>("/products");
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }

  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/user");
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString(),
    };

    return this.fetch<{ orderId: string; amount: number }>("/orders", {
      method: "POST",
      body: sanitizedOrderData,
    });
  }
}

export const apiClient = new ApiClient();
