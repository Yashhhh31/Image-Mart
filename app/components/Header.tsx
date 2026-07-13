"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  ShoppingBag,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Image as ImageIcon,
  Package,
  DollarSign,
} from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="ImageMart"
            className="w-9 h-9 rounded-lg shadow-md group-hover:shadow-lg transition-all object-cover"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            ImageMart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Home
          </Link>
          {session && (
            <Link
              href="/sell"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium text-sm hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm"
            >
              <DollarSign className="w-4 h-4" />
              Sell Image
            </Link>
          )}
          <Link
            href="/orders"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            Orders
          </Link>

          {session?.user?.role === "admin" && (
            <Link
              href="/admin/products"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-sm"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {session.user?.email?.split("@")[0] || "User"}
                </span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {session.user?.role || "user"}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="btn-secondary text-sm px-5 py-2"
              >
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm px-5 py-2">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-fade-in-up">
          <Link
            href="/"
            className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Package className="w-4 h-4" />
            Orders
          </Link>

          {session?.user?.role === "admin" && (
            <Link
              href="/admin/products"
              className="block px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Admin Panel
            </Link>
          )}

          <div className="border-t border-gray-100 pt-3">
            {session ? (
              <div className="space-y-2">
                <div className="px-4 py-2 flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {session.user?.email}
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {session.user?.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 text-center px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}