"use client";

import { useCallback, useEffect, useState } from "react";
import { MetricsCards } from "@/components/MetricsCards";
import { FiltersBar } from "@/components/FiltersBar";
import { ItemsTable } from "@/components/ItemsTable";
import { PayDialog } from "@/components/PayDialog";
import { EditDialog } from "@/components/EditDialog";
import { ViewDialog } from "@/components/ViewDialog";
import { CancelDialog } from "@/components/CancelDialog";
import { AddItemDialog } from "@/components/AddItemDialog";
import { Button } from "@/components/ui/button";
import { Item, Category, Status } from "@/types";
import { Plus, RefreshCw } from "lucide-react";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<Category | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/items?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openPay = (item: Item) => { setSelectedItem(item); setPayOpen(true); };
  const openEdit = (item: Item) => { setSelectedItem(item); setEditOpen(true); };
  const openView = (item: Item) => { setSelectedItem(item); setViewOpen(true); };
  const openCancel = (item: Item) => { setSelectedItem(item); setCancelOpen(true); };

  const handleClearFilters = () => {
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              🇵🇹 Immigration Assistant Portugal
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your immigration expenses
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchItems} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <MetricsCards items={items} />

        {/* Filters */}
        <div className="rounded-lg border bg-card p-4">
          <FiltersBar
            category={categoryFilter}
            status={statusFilter}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
            onClear={handleClearFilters}
          />
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Expense Items</h2>
            <span className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-12 text-destructive gap-2">
              <p className="font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchItems}>Try again</Button>
            </div>
          ) : (
            <ItemsTable
              items={items}
              onPay={openPay}
              onEdit={openEdit}
              onCancel={openCancel}
              onView={openView}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <PayDialog
        item={selectedItem}
        open={payOpen}
        onOpenChange={setPayOpen}
        onSuccess={fetchItems}
      />
      <EditDialog
        item={selectedItem}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={fetchItems}
      />
      <ViewDialog
        item={selectedItem}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />
      <CancelDialog
        item={selectedItem}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={fetchItems}
      />
      <AddItemDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={fetchItems}
      />
    </main>
  );
}

