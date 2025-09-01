"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  fetchBusinesses,
  searchBusinesses,
} from "@/stores/slices/public/public.slice";
import { fetchPublicCategories as fetchCategoriesAction } from "@/stores/slices/public/public.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Star, 
  MapPin, 
  Building, 
  Filter, 
  Loader2, 
  X,
  ArrowRight,
  Users,
  Clock
} from "lucide-react";
import Image from "next/image";

export default function BusinessesPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "all");
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useAppDispatch();
  const { businesses, isLoading } = useAppSelector((state) => state.businesses);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (categoryId) {
      dispatch(searchBusinesses({ categoryId }));
    } else {
      dispatch(fetchBusinesses());
    }
    dispatch(fetchCategoriesAction());
  }, [dispatch, categoryId]);

  useEffect(() => {
    setSelectedCategory(categoryId || "all");
  }, [categoryId]);

  const handleSearch = () => {
    if (
      searchQuery.trim() ||
      (selectedCategory && selectedCategory !== "all")
    ) {
      setIsSearching(true);
      dispatch(
        searchBusinesses({
          query: searchQuery.trim() || undefined,
          categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
        })
      ).finally(() => setIsSearching(false));
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value && value !== "all") {
      dispatch(searchBusinesses({ categoryId: value }));
    } else {
      dispatch(fetchBusinesses());
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    dispatch(fetchBusinesses());
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Local Businesses
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing local services and book appointments with trusted businesses in your area
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search businesses or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full lg:w-48 h-11">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="w-full lg:w-auto h-11 px-8"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory !== "all") && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full lg:w-auto h-11"
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {businesses?.length || 0} Businesses Found
            </h2>
            {(searchQuery || selectedCategory !== "all") && (
              <p className="text-sm text-muted-foreground">
                Showing results for &quot;{searchQuery || 'all categories'}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && businesses?.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Business Grid */}
        {!isLoading && businesses && businesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
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
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {business.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="line-clamp-1">
                        {business.city}, {business.state}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{business.reviewCount} reviews</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Open</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      {business.isActive ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
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
    </div>
  );
}
