export type Category = "CLOTHING" | "ACCESSORIES" | "DOCUMENTATION" | "TRAVEL";
export type Status = "PAID" | "PURCHASED" | "PENDING" | "CANCELLED" | "PAYING";

export interface Item {
  id: string;
  imageUrl: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  amountPaid: number;
  category: Category;
  status: Status;
  createdAt: string;
  updatedAt: string;
  // Computed fields
  totalValue: number;
  remainingValue: number;
}

export interface CreateItemInput {
  imageUrl?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  amountPaid?: number;
  category: Category;
  status?: Status;
}

export interface UpdateItemInput {
  imageUrl?: string | null;
  name?: string;
  quantity?: number;
  unitPrice?: number;
  amountPaid?: number;
  category?: Category;
  status?: Status;
}

export interface PaymentInput {
  amount: number;
}
