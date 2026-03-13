import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category, Status } from "@prisma/client";

function computeFields(item: {
  quantity: number;
  unitPrice: number;
  amountPaid: number;
}) {
  const totalValue = item.quantity * item.unitPrice;
  const remainingValue = Math.max(0, totalValue - item.amountPaid);
  return { totalValue, remainingValue };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ ...item, ...computeFields(item) });
  } catch (error) {
    console.error("[GET /api/items/:id]", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (existing.status === "CANCELLED" && body.status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Cannot update a cancelled item" },
        { status: 400 }
      );
    }

    const { imageUrl, name, quantity, unitPrice, amountPaid, category, status, paymentAmount } =
      body;

    const updateData: {
      imageUrl?: string | null;
      name?: string;
      quantity?: number;
      unitPrice?: number;
      amountPaid?: number;
      category?: Category;
      status?: Status;
    } = {};

    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (name !== undefined) updateData.name = name;
    if (quantity !== undefined) updateData.quantity = Number(quantity);
    if (unitPrice !== undefined) updateData.unitPrice = Number(unitPrice);
    if (amountPaid !== undefined) updateData.amountPaid = Number(amountPaid);
    if (category !== undefined) updateData.category = category as Category;
    if (status !== undefined) updateData.status = status as Status;

    // Handle partial payment: add paymentAmount to existing amountPaid
    if (paymentAmount !== undefined) {
      const newAmountPaid = existing.amountPaid + Number(paymentAmount);
      const totalValue = existing.quantity * existing.unitPrice;
      updateData.amountPaid = Math.min(newAmountPaid, totalValue);

      // Auto-update status based on payment
      if (updateData.amountPaid >= totalValue) {
        updateData.status = "PAID";
      } else if (updateData.amountPaid > 0) {
        updateData.status = "PAYING";
      }
    }

    const updated = await prisma.item.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ ...updated, ...computeFields(updated) });
  } catch (error) {
    console.error("[PATCH /api/items/:id]", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
