/**
 * API Route Template
 *
 * Copy this file to: src/app/api/[resource]/route.ts
 * Replace [resource] with your resource name (e.g., projects, posts, products)
 *
 * Usage:
 * 1. Copy to appropriate directory
 * 2. Update ResourceSchema with your fields
 * 3. Update Prisma model name
 * 4. Customize as needed
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

// Schema for creating a resource
const createResourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  // Add more fields as needed
});

// Schema for updating a resource
const updateResourceSchema = createResourceSchema.partial();

// =============================================================================
// GET - List Resources
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    // Build where clause
    const where = {
      userId: session.user.id,
      ...(search && {
        title: { contains: search, mode: "insensitive" as const },
      }),
    };

    // Fetch resources with pagination
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.resource.count({ where }),
    ]);

    return NextResponse.json({
      data: resources,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + resources.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Create Resource
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = createResourceSchema.parse(body);

    // Generate unique slug from title
    let slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for existing slug
    const existing = await prisma.resource.findFirst({
      where: { userId: session.user.id, slug },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create the resource
    const resource = await prisma.resource.create({
      data: {
        ...validated,
        slug,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ data: resource }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// =============================================================================
// Note: For individual resource operations (GET/:id, PATCH/:id, DELETE/:id),
// create a [id]/route.ts file in the same directory.
// =============================================================================
