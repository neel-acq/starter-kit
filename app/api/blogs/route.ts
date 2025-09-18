import { NextRequest, NextResponse } from "next/server";
import { getBlogs, createBlog } from "@/lib/db/queries";

export async function GET() {
  try {
    const blogs = await getBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      coverImage,
      author,
      tags,
      categoryId,
      status,
    } = body;

    if (!title || !slug || !content || !author || !categoryId || !status) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const newBlog = await createBlog({
      title,
      slug,
      content,
      coverImage,
      author,
      tags: JSON.stringify(tags || []),
      categoryId,
      status,
    });
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
