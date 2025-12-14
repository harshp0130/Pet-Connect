import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

interface FilterState {
  search: string;
  category: string;
  sortBy: string;
  priceRange: [number, number];
  inStock: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalProducts: number;
}

export const ProductFilters = ({ filters, onFiltersChange, totalProducts }: ProductFiltersProps) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      sortBy: 'featured',
      priceRange: [0, 500],
      inStock: false
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    if (key === 'category') return value !== 'all';
    if (key === 'sortBy') return value !== 'featured';
    if (key === 'priceRange') return value[0] !== 0 || value[1] !== 500;
    if (key === 'inStock') return value === true;
    return false;
  }).length;

  return (
    <div className="space-y-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Results count and active filters */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
        </p>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.id === filters.category)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('category', 'all')}
              />
            </Badge>
          )}

          {filters.inStock && (
            <Badge variant="secondary" className="gap-1">
              In Stock Only
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('inStock', false)}
              />
            </Badge>
          )}

          {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) && (
            <Badge variant="secondary" className="gap-1">
              Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('priceRange', [0, 500])}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value)}
                max={500}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>$500+</span>
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="inStock" className="text-sm font-medium">
                Show only items in stock
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};