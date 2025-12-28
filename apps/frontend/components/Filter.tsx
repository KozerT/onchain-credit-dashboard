"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Filter as FilterIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PRODUCT_TYPES = ["Mortgage", "Private", "Business"] as const;

export const Filter = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentType} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-full sm:w-[180px] bg-background border-border">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="All Status" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {PRODUCT_TYPES.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
