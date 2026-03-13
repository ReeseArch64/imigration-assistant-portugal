import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item } from "@/types";
import { DollarSign, CreditCard, TrendingDown, ShoppingCart } from "lucide-react";

interface MetricsCardsProps {
  items: Item[];
}

export function MetricsCards({ items }: MetricsCardsProps) {
  const activeItems = items.filter((i) => i.status !== "CANCELLED");

  const totalPaid = activeItems.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalDue = activeItems.reduce((sum, i) => sum + i.remainingValue, 0);
  const totalValue = activeItems.reduce((sum, i) => sum + i.totalValue, 0);
  const totalItems = activeItems.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{totalItems} active items</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">€{totalPaid.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">€{totalDue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {totalValue > 0 ? Math.round((totalDue / totalValue) * 100) : 0}% remaining
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Progress</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0}%
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{
                width: `${totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
