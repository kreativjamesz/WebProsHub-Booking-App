'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { fetchBusinesses, searchBusinesses, fetchCategories } from '@/lib/stores/features/businesses/businessesSlice';
import { fetchCategories as fetchCategoriesAction } from '@/lib/stores/features/categories/categoriesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MapPin, Building, Filter, Loader2 } from 'lucide-react';

export default function BusinessesPage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('category');
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
    const [isSearching, setIsSearching] = useState(false);

    const dispatch = useAppDispatch();
    const { businesses, isLoading } = useAppSelector(state => state.businesses);
    const { categories } = useAppSelector(state => state.categories);

    useEffect(() => {
        if (categoryId) {
            dispatch(searchBusinesses({ categoryId }));
        } else {
            dispatch(fetchBusinesses());
        }
        dispatch(fetchCategoriesAction());
    }, [dispatch, categoryId]);

    useEffect(() => {
        setSelectedCategory(categoryId || '');
    }, [categoryId]);

    const handleSearch = () => {
        if (searchQuery.trim() || selectedCategory) {
            setIsSearching(true);
            dispatch(searchBusinesses({ 
                query: searchQuery.trim() || undefined, 
                categoryId: selectedCategory || undefined 
            })).finally(() => setIsSearching(false));
        }
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        if (value) {
            dispatch(searchBusinesses({ categoryId: value }));
        } else {
            dispatch(fetchBusinesses());
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        dispatch(fetchBusinesses());
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Find Local Businesses
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover and book services from amazing businesses in your area
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Search businesses by name or service..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="w-full lg:w-64">
                            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.$id} value={category.$id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <Button 
                            onClick={handleSearch} 
                            disabled={isSearching}
                            className="w-full lg:w-auto"
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
                        {(searchQuery || selectedCategory) && (
                            <Button 
                                variant="outline" 
                                onClick={clearFilters}
                                className="w-full lg:w-auto"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
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
                ) : businesses.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Found {businesses.length} business{businesses.length !== 1 ? 'es' : ''}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {businesses.map((business) => (
                                <Link key={business.$id} href={`/businesses/${business.$id}`}>
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                        <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                                            {business.logo ? (
                                                <img 
                                                    src={business.logo} 
                                                    alt={business.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Building className="h-16 w-16 text-gray-400" />
                                            )}
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg line-clamp-1">
                                                {business.name}
                                            </CardTitle>
                                            <CardDescription className="flex items-center text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                                <span className="line-clamp-1">
                                                    {business.city}, {business.state}
                                                </span>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                    <span className="text-sm font-medium">
                                                        {business.rating.toFixed(1)}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-1">
                                                        ({business.reviewCount})
                                                    </span>
                                                </div>
                                                {business.isActive && (
                                                    <Badge variant="secondary">Active</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {business.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No businesses found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search criteria or browse all categories
                        </p>
                        <Button onClick={clearFilters} variant="outline">
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
