import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/dummyjson";
import type { ProductsQuery, ProductsResponse } from "@/lib/types";

const allowedSortFields = new Set(["title", "price", "rating"]);
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawLimit = Number(params.get("limit") ?? 12);
  const rawSkip = Number(params.get("skip") ?? 0);
  const sort = params.get("sortBy") ?? undefined;
  const query: ProductsQuery = {
    limit: Number.isFinite(rawLimit) ? Math.min(Math.max(Math.trunc(rawLimit), 1), 50) : 12,
    skip: Number.isFinite(rawSkip) ? Math.max(Math.trunc(rawSkip), 0) : 0,
    q: params.get("q")?.trim() || undefined,
    category: params.get("category") || undefined,
    sortBy: sort && allowedSortFields.has(sort) ? sort as ProductsQuery["sortBy"] : undefined,
    order: params.get("order") === "desc" ? "desc" : "asc",
  };
  try {
    const data: ProductsResponse = await getProducts(query);
    return NextResponse.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось получить товары.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
