"use client";

import { Input } from "@repo/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search institutions..."
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          handleSearch(value);
        }}
        className="pl-9"
      />
    </div>
  );
};
