import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/db/queries";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, status } = body;

    if (!name || !status) {
      return NextResponse.json(
        { error: "Name and status are required" },
        { status: 400 }
      );
    }

    const newCategory = await createCategory({ name, status });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
