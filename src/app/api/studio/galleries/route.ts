/**
 * Gallery API Routes
 *
 * GET /api/studio/galleries - List all galleries for user
 * POST /api/studio/galleries - Create a new gallery
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { z } from "zod";
import { checkUsageLimits } from "@/lib/billing/subscription";

// Validation schema for creating a gallery
const createGallerySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  tags: z.array(z.string()).optional(),
  layout: z.enum(["grid", "masonry", "carousel", "fullscreen", "split", "stacked"]).optional(),
  siteId: z.string().optional(),
});

// GET - List all galleries
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where = {
      userId: session.user.id,
      ...(siteId && { siteId }),
      ...(published !== null && { isPublished: published === "true" }),
    };

    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        include: {
          items: {
            take: 1,
            where: { isCover: true },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.gallery.count({ where }),
    ]);

    return NextResponse.json({
      galleries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + galleries.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new gallery
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check usage limits
    const limits = await checkUsageLimits(session.user.id);
    if (!limits.withinLimits && limits.usage.galleries.limit !== -1) {
      return NextResponse.json(
        {
          error: "Gallery limit reached",
          message: `You've reached your limit of ${limits.usage.galleries.limit} galleries. Please upgrade your plan.`,
          upgrade: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = createGallerySchema.parse(body);

    // Generate unique slug
    let slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for existing slug and make unique if needed
    const existingGallery = await prisma.gallery.findFirst({
      where: {
        userId: session.user.id,
        slug,
      },
    });

    if (existingGallery) {
      slug = `${slug}-${Date.now()}`;
    }

    const gallery = await prisma.gallery.create({
      data: {
        ...validated,
        slug,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
