"use client";

import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface CategoryFilterProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    color: string;
    _count?: { posts: number };
  }[];
  selected: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selected === "" ? "default" : "secondary"}
        className="cursor-pointer transition-colors text-sm py-1.5 px-3"
        onClick={() => onSelect("")}
      >
        الكل
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat.id}
          variant={selected === cat.slug ? "default" : "secondary"}
          className="cursor-pointer transition-colors text-sm py-1.5 px-3"
          style={
            selected === cat.slug
              ? { backgroundColor: cat.color, color: "#fff" }
              : {
                  backgroundColor: cat.color + "15",
                  color: cat.color,
                  borderColor: cat.color + "40",
                }
          }
          onClick={() => onSelect(cat.slug)}
        >
          <Tag className="h-3 w-3 ml-1" />
          {cat.name}
          {cat._count && (
            <span className="mr-1 text-xs opacity-70">({cat._count.posts})</span>
          )}
        </Badge>
      ))}
    </div>
  );
}
