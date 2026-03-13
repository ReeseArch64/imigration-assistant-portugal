"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Item, Category, Status } from "@/types";
import { toast } from "@/hooks/use-toast";

interface EditDialogProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "CLOTHING", label: "Clothing" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "DOCUMENTATION", label: "Documentation" },
  { value: "TRAVEL", label: "Travel" },
];

const STATUSES: { value: Status; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PURCHASED", label: "Purchased" },
  { value: "PAYING", label: "Paying" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function EditDialog({ item, open, onOpenChange, onSuccess }: EditDialogProps) {
  const [form, setForm] = useState({
    imageUrl: "",
    name: "",
    quantity: "1",
    unitPrice: "0",
    amountPaid: "0",
    category: "DOCUMENTATION" as Category,
    status: "PENDING" as Status,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        imageUrl: item.imageUrl ?? "",
        name: item.name,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
        amountPaid: String(item.amountPaid),
        category: item.category,
        status: item.status,
      });
    }
  }, [item]);

  if (!item) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: form.imageUrl || null,
          name: form.name,
          quantity: Number(form.quantity),
          unitPrice: Number(form.unitPrice),
          amountPaid: Number(form.amountPaid),
          category: form.category,
          status: form.status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update item");
      }
      toast({ title: "Item updated", description: `${form.name} has been updated successfully.` });
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast({ title: "Update failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Update the details for this expense item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unitPrice">Unit Price (€) *</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.unitPrice}
                  onChange={(e) => handleChange("unitPrice", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amountPaid">Amount Paid (€)</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0"
                value={form.amountPaid}
                onChange={(e) => handleChange("amountPaid", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
