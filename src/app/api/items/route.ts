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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as Category | null;
    const status = searchParams.get("status") as Status | null;

    const where: { category?: Category; status?: Status } = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const items = await prisma.item.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const enriched = items.map((item) => ({
      ...item,
      ...computeFields(item),
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[GET /api/items]", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, name, quantity, unitPrice, amountPaid, category, status } =
      body;

    if (!name || quantity == null || unitPrice == null || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, quantity, unitPrice, category" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        imageUrl: imageUrl || null,
        name,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        amountPaid: Number(amountPaid ?? 0),
        category: category as Category,
        status: (status as Status) ?? "PENDING",
      },
    });

    return NextResponse.json({ ...item, ...computeFields(item) }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/items]", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
