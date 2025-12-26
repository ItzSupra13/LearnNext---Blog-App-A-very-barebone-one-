"use client";

import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

type SearchInputProps = {
  limit?: number;
};

export function SearchInput({ limit = 10 }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isPending, startTransition] = useTransition();

  // debounce typing (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(() => setDebounced(query.trim()));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const results = useQuery(
  api.posts.searchPosts,
  debounced.length > 0
    ? { searching: debounced, limit }
    : {searching: "", limit}
);

  const loading = isPending || query !== debounced;

  return (
    <div className="space-y-3 mb-8">
      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search blog posts…"
          className="pl-10 rounded-2xl"
        />
      </div>

      {/* Loading indicator */}
      {loading && debounced && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching…
        </div>
      )}

      {/* Results */}
      {results && debounced && (
        <Card className="rounded-2xl border">
          <div className="p-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              Found {results.length} result{results.length !== 1 && "s"}
            </p>

            <Separator />

            <div className="space-y-2">
              {results.map(post => (
                <Link
                  key={post._id}
                  href={`/blog/${post._id}`}
                  className="group block"
                >
                  <div className="p-2 rounded-xl hover:bg-accent transition flex justify-between gap-3">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </Link>
              ))}
            </div>

            {results.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No matches.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
