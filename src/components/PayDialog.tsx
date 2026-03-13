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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Item } from "@/types";
import { toast } from "@/hooks/use-toast";

interface PayDialogProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PayDialog({ item, open, onOpenChange, onSuccess }: PayDialogProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const remaining = item.remainingValue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid positive amount.", variant: "destructive" });
      return;
    }
    if (parsedAmount > remaining) {
      toast({ title: "Amount exceeds remaining balance", description: `Maximum payment allowed is €${remaining.toFixed(2)}.`, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentAmount: parsedAmount }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process payment");
      }
      toast({ title: "Payment recorded", description: `€${parsedAmount.toFixed(2)} paid successfully.` });
      setAmount("");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast({ title: "Payment failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Payment</DialogTitle>
          <DialogDescription>
            Record a payment for <strong>{item.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Total Value</span>
              <span className="font-medium">€{item.totalValue.toFixed(2)}</span>
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-medium text-green-600">€{item.amountPaid.toFixed(2)}</span>
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium text-orange-600">€{remaining.toFixed(2)}</span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Payment Amount (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={remaining}
                placeholder={`Max: €${remaining.toFixed(2)}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || remaining <= 0}>
              {loading ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
