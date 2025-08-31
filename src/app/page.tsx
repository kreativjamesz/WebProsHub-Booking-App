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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/Logo";
import { 
  Search, 
  Star, 
  MapPin, 
  Building, 
  Tag, 
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Sparkles
} from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section with Black & White Animations */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Circles */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-muted-foreground/20 rounded-full animate-float-slow opacity-30"></div>
          <div className="absolute top-40 right-20 w-20 h-20 border border-muted-foreground/30 rounded-full animate-float-medium opacity-40"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-muted-foreground/25 rounded-full animate-float-fast opacity-35"></div>
          
          {/* Floating Squares */}
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-muted-foreground/20 rotate-45 animate-float-medium opacity-30"></div>
          <div className="absolute bottom-1/3 right-10 w-8 h-8 border border-muted-foreground/25 rotate-45 animate-float-slow opacity-40"></div>
          
          {/* Animated Lines */}
          <div className="absolute top-1/4 left-1/3 w-24 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-32 h-px bg-gradient-to-l from-transparent via-muted-foreground/25 to-transparent animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <Logo icon={Building} showSubtitle={true} />
          </div>

          <div className="space-y-4">
            {/* Animated Gradient Text */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent animate-gradient-x">
                Book Local Services
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
              Discover and book amazing local businesses. From beauty to tech, 
              find the perfect service for your needs.
            </p>
          </div>

          {/* Search Bar with Animation */}
          <div className="max-w-xl mx-auto animate-fade-in-up delay-200">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input
                type="text"
                placeholder="What service are you looking for?"
                className="pl-10 h-12 text-base border-2 focus:border-foreground transition-all duration-300 bg-background/80 backdrop-blur-sm"
              />
              <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 transition-all duration-300 hover:scale-105">
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons with Hover Effects */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Button asChild size="lg" className="h-12 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link href="/businesses">
                Browse Businesses
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg border-2">
              <Link href="/auth/register">
                Start Your Business
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="my-16" />

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Popular Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore services by category and find exactly what you need
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-muted rounded-full mx-auto" />
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories?.slice(0, 8).map((category) => (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-2xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="my-16" />

      {/* Featured Businesses Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Businesses
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Top-rated local businesses recommended for you
            </p>
          </div>

          {businessesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-t-lg" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses?.slice(0, 6).map((business) => (
                <Card key={business.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden hover:scale-105">
                  <div className="aspect-video relative overflow-hidden">
                    {business.coverImage ? (
                      <Image
                        src={business.coverImage}
                        alt={business.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Building className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {business.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {business.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {business.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">
                        {business.city}, {business.state}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{business.reviewCount} reviews</span>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/business/${business.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Separator className="my-16" />

      {/* Promotions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Special Offers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t miss out on these limited-time deals from local businesses
            </p>
          </div>

          {promosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPromos?.slice(0, 3).map((promo) => (
                <Card key={promo.id} className="group hover:shadow-lg transition-all duration-200 border-primary/20 hover:scale-105">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {promo.discountPercentage}% OFF
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{promo.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {promo.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Limited Time</span>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/businesses">
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who are already booking services with local businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Link href="/businesses">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg border-2">
              <Link href="/auth/register">
                Sign Up Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
