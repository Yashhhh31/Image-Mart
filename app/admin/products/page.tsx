"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminProductForm from "@/app/components/AdminProductForm";

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-bold">
          You don't have permission to access this page. Contact admin.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <AdminProductForm />
    </div>
  );
}
