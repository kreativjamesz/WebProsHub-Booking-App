"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchFeaturedBusinesses } from "@/lib/stores/features/businesses/businessesSlice";
import { fetchFeaturedPromos } from "@/lib/stores/features/promos/promosSlice";
import { fetchCategories } from "@/lib/stores/features/categories/categoriesSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Building, Tag } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featuredBusinesses, isLoading: businessesLoading } = useAppSelector(
    (state) => state.businesses
  );
  const { featuredPromos, isLoading: promosLoading } = useAppSelector(
    (state) => state.promos
  );
  const { categories, isLoading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchFeaturedBusinesses());
    dispatch(fetchFeaturedPromos());
    dispatch(fetchCategories());
  }, [dispatch]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find & Book Local Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover amazing businesses in your area and book appointments
            instantly
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder="What service are you looking for?"
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/businesses">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
              >
                Browse Businesses
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Start Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600">
              Find services in your favorite categories
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                                              key={category.id}
                            href={`/businesses?category=${category.id}`}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center text-white text-2xl"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Businesses
            </h2>
            <p className="text-lg text-gray-600">
              Top-rated businesses recommended for you
            </p>
          </div>

          {businessesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((business) => (
                                        <Link key={business.id} href={`/businesses/${business.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      {business.logo ? (
                        <Image
                          src={business.logo}
                          alt={business.name}
                          className="w-full h-full object-cover rounded-t-lg"
                          width={300}
                          height={300}
                        />
                      ) : (
                        <Building className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <CardDescription className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {business.city}, {business.state}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">
                            {business.rating}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            ({business.reviewCount} reviews)
                          </span>
                        </div>
                        <Badge variant="secondary">Featured</Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {business.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/businesses">
              <Button size="lg" variant="outline">
                View All Businesses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Promotions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Special Offers
            </h2>
            <p className="text-lg text-gray-600">
              {"Don't miss out on these amazing deals"}
            </p>
          </div>

          {promosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPromos.map((promo) => (
                <Card
                                          key={promo.id}
                  className="border-2 border-orange-200 hover:shadow-lg transition-shadow"
                >
                  <div className="h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-t-lg flex items-center justify-center">
                    <Tag className="h-16 w-16 text-white" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{promo.title}</CardTitle>
                      <Badge variant="destructive" className="text-sm">
                        {promo.discountPercentage}% OFF
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-600">
                      {promo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500 mb-3">
                                              Valid until {promo.endDate instanceof Date ? promo.endDate.toLocaleDateString() : new Date(promo.endDate).toLocaleDateString()}
                    </div>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/promos">
              <Button size="lg" variant="outline">
                View All Promotions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of customers who trust us for their service needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
              >
                Sign Up Now
              </Button>
            </Link>
            <Link href="/businesses">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
