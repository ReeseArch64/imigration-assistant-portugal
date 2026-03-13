"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Item } from "@/types";
import { toast } from "@/hooks/use-toast";

interface CancelDialogProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CancelDialog({ item, open, onOpenChange, onSuccess }: CancelDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel item");
      }
      toast({ title: "Item cancelled", description: `${item.name} has been cancelled.` });
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast({ title: "Cancellation failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Cancel Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel <strong>{item.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Keep Item
          </Button>
          <Button type="button" variant="destructive" onClick={handleCancel} disabled={loading}>
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
