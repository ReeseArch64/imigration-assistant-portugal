"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/types";
import { Eye, Edit2, Ban, CreditCard } from "lucide-react";

interface ItemsTableProps {
  items: Item[];
  onPay: (item: Item) => void;
  onEdit: (item: Item) => void;
  onCancel: (item: Item) => void;
  onView: (item: Item) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  PURCHASED: { label: "Purchased", className: "bg-blue-100 text-blue-800 border-blue-200" },
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  PAYING: { label: "Paying", className: "bg-purple-100 text-purple-800 border-purple-200" },
};

const categoryLabels: Record<string, string> = {
  CLOTHING: "Clothing",
  ACCESSORIES: "Accessories",
  DOCUMENTATION: "Documentation",
  TRAVEL: "Travel",
};

export function ItemsTable({ items, onPay, onEdit, onCancel, onView }: ItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm">Add an item or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Paid</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const status = statusConfig[item.status] ?? { label: item.status, className: "" };
            const isCancelled = item.status === "CANCELLED";
            const isPaid = item.status === "PAID";

            return (
              <TableRow key={item.id} className={isCancelled ? "opacity-60" : ""}>
                <TableCell>
                  {item.imageUrl ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded border">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">€{item.unitPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">€{item.totalValue.toFixed(2)}</TableCell>
                <TableCell className="text-right text-green-600">€{item.amountPaid.toFixed(2)}</TableCell>
                <TableCell className="text-right text-orange-600">€{item.remainingValue.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {categoryLabels[item.category] ?? item.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={status.className}>{status.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(item)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(item)}
                      disabled={isCancelled}
                      title="Edit item"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary"
                      onClick={() => onPay(item)}
                      disabled={isCancelled || isPaid || item.remainingValue <= 0}
                      title="Register payment"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onCancel(item)}
                      disabled={isCancelled}
                      title="Cancel item"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
