"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Category, Status } from "@/types";
import { X } from "lucide-react";

interface FiltersBarProps {
  category: Category | "ALL";
  status: Status | "ALL";
  onCategoryChange: (value: Category | "ALL") => void;
  onStatusChange: (value: Status | "ALL") => void;
  onClear: () => void;
}

const CATEGORIES: { value: Category | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Categories" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "DOCUMENTATION", label: "Documentation" },
  { value: "TRAVEL", label: "Travel" },
];

const STATUSES: { value: Status | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "PAID", label: "Paid" },
  { value: "PURCHASED", label: "Purchased" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "PAYING", label: "Paying" },
];

export function FiltersBar({
  category,
  status,
  onCategoryChange,
  onStatusChange,
  onClear,
}: FiltersBarProps) {
  const hasFilters = category !== "ALL" || status !== "ALL";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
      <Select value={category} onValueChange={(v) => onCategoryChange(v as Category | "ALL")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={(v) => onStatusChange(v as Status | "ALL")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
