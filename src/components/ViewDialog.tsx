"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/types";
import Image from "next/image";

interface ViewDialogProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels: Record<string, string> = {
  CLOTHING: "Clothing",
  ACCESSORIES: "Accessories",
  DOCUMENTATION: "Documentation",
  TRAVEL: "Travel",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  PURCHASED: { label: "Purchased", className: "bg-blue-100 text-blue-800 border-blue-200" },
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  PAYING: { label: "Paying", className: "bg-purple-100 text-purple-800 border-purple-200" },
};

export function ViewDialog({ item, open, onOpenChange }: ViewDialogProps) {
  if (!item) return null;

  const status = statusConfig[item.status] ?? { label: item.status, className: "" };
  const paidPercent = item.totalValue > 0
    ? Math.round((item.amountPaid / item.totalValue) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>Expense item details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {item.imageUrl && (
            <div className="flex justify-center">
              <div className="relative h-40 w-full overflow-hidden rounded-md border">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{categoryLabels[item.category] ?? item.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge className={status.className}>{status.label}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Quantity</p>
              <p className="font-medium">{item.quantity}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Unit Price</p>
              <p className="font-medium">€{item.unitPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Value</p>
              <p className="font-medium">€{item.totalValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Amount Paid</p>
              <p className="font-medium text-green-600">€{item.amountPaid.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <p className="font-medium text-orange-600">€{item.remainingValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Progress</p>
              <p className="font-medium">{paidPercent}%</p>
            </div>
          </div>
          {item.totalValue > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Paid</span>
                <span>{paidPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            <p>Added: {new Date(item.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(item.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
