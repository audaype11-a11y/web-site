"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { SearchBar } from "@/components/blog/search-bar";
import { CategoryFilter } from "@/components/blog/category-filter";
import { Badge } from "@/components/ui/badge";

interface ArticlesClientProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    color: string;
    _count: { posts: number };
  }[];
  initialCategory: string;
  initialSearch: string;
  postsCount: number;
}

export function ArticlesClient({
  categories,
  initialCategory,
  initialSearch,
  postsCount,
}: ArticlesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const updateParams = useCallback(
    (newSearch: string, newCategory: string) => {
      const params = new URLSearchParams();
      if (newSearch) params.set("search", newSearch);
      if (newCategory) params.set("category", newCategory);
      router.push(`/articles?${params.toString()}`);
    },
    [router]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    updateParams(value, category);
  };

  const handleCategory = (slug: string) => {
    setCategory(slug);
    updateParams(search, slug);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar value={search} onChange={handleSearch} />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {postsCount} مقال
          </Badge>
        </div>
      </div>
      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={handleCategory}
      />
    </div>
  );
}
