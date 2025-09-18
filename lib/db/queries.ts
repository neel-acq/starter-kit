import { desc, and, eq, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import {
  activityLogs,
  teamMembers,
  teams,
  users,
  categories,
  blogs,
} from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.team || null;
}

// Categories queries

export async function getCategories() {
  return await db.select().from(categories).orderBy(categories.createdAt);
}

export async function getCategoryById(id: number) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCategory(data: { name: string; status: string }) {
  const now = new Date();
  const [newCategory] = await db
    .insert(categories)
    .values({
      name: data.name,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return newCategory;
}

export async function updateCategory(
  id: number,
  data: { name: string; status: string }
) {
  const now = new Date();
  await db
    .update(categories)
    .set({
      name: data.name,
      status: data.status,
      updatedAt: now,
    })
    .where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
}

// Blogs queries

export async function getBlogs() {
  return await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      content: blogs.content,
      coverImage: blogs.coverImage,
      author: blogs.author,
      tags: blogs.tags,
      categoryId: blogs.categoryId,
      status: blogs.status,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(blogs)
    .leftJoin(categories, eq(blogs.categoryId, categories.id))
    .orderBy(desc(blogs.createdAt));
}

export async function getBlogById(id: number) {
  const result = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      content: blogs.content,
      coverImage: blogs.coverImage,
      author: blogs.author,
      tags: blogs.tags,
      categoryId: blogs.categoryId,
      status: blogs.status,
      createdAt: blogs.createdAt,
      updatedAt: blogs.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(blogs)
    .leftJoin(categories, eq(blogs.categoryId, categories.id))
    .where(eq(blogs.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createBlog(data: {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string;
  categoryId: number;
  status: string;
}) {
  const now = new Date();
  const [newBlog] = await db
    .insert(blogs)
    .values({
      title: data.title,
      slug: data.slug,
      content: data.content,
      coverImage: data.coverImage,
      author: data.author,
      tags: data.tags,
      categoryId: data.categoryId,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return newBlog;
}

export async function updateBlog(
  id: number,
  data: {
    title: string;
    slug: string;
    content: string;
    coverImage?: string;
    author: string;
    tags: string;
    categoryId: number;
    status: string;
  }
) {
  const now = new Date();
  await db
    .update(blogs)
    .set({
      title: data.title,
      slug: data.slug,
      content: data.content,
      coverImage: data.coverImage,
      author: data.author,
      tags: data.tags,
      categoryId: data.categoryId,
      status: data.status,
      updatedAt: now,
    })
    .where(eq(blogs.id, id));
}

export async function deleteBlog(id: number) {
  await db.delete(blogs).where(eq(blogs.id, id));
}
