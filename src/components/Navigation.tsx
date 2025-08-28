"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  logoutUser,
  getCurrentUser,
} from "@/lib/stores/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  X,
  User,
  Building,
  Settings,
  LogOut,
} from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only try to get current user ONCE on mount, never retry
    if (!hasCheckedAuth && !isAuthenticated && !isLoading) {
      setHasCheckedAuth(true);
      dispatch(getCurrentUser());
    }
  }, [hasCheckedAuth, isAuthenticated, isLoading, dispatch]);

  const handleLogout = () => {
    try {
      dispatch(logoutUser());
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: just close mobile menu
      setIsMobileMenuOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              BookMyService
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/businesses"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Find Businesses
            </Link>
            <Link
              href="/promos"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Promotions
            </Link>
            <Link
              href="/test-connection"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Test Connection
            </Link>
            {isAuthenticated && user?.role === "business_owner" && (
              <Link
                href="/business/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Business Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search businesses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {getInitials(user?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "business_owner" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/business/dashboard"
                        className="cursor-pointer"
                      >
                        <Building className="mr-2 h-4 w-4" />
                        Business Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/businesses"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Find Businesses
            </Link>
            <Link
              href="/promos"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Promotions
            </Link>
            {isAuthenticated && user?.role === "business_owner" && (
              <Link
                href="/business/dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Business Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
