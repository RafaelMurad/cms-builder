/**
 * Single Gallery API Routes
 *
 * GET /api/studio/galleries/[id] - Get a single gallery
 * PATCH /api/studio/galleries/[id] - Update a gallery
 * DELETE /api/studio/galleries/[id] - Delete a gallery
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// Validation schema for updating a gallery
const updateGallerySchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  tags: z.array(z.string()).optional(),
  layout: z.enum(["grid", "masonry", "carousel", "fullscreen", "split", "stacked"]).optional(),
  columns: z.number().min(1).max(6).optional(),
  gap: z.number().min(0).max(64).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

interface RouteParams {
  params: { id: string };
}

// GET - Get a single gallery
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const gallery = await prisma.gallery.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
        },
        site: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update a gallery
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check gallery exists and belongs to user
    const existingGallery = await prisma.gallery.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingGallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validated = updateGallerySchema.parse(body);

    // If publishing, set publishedAt
    const publishedAt = validated.isPublished && !existingGallery.isPublished
      ? new Date()
      : existingGallery.publishedAt;

    const gallery = await prisma.gallery.update({
      where: { id: params.id },
      data: {
        ...validated,
        publishedAt,
      },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gallery
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check gallery exists and belongs to user
    const existingGallery = await prisma.gallery.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingGallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      );
    }

    // Delete gallery (cascade deletes items)
    await prisma.gallery.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
