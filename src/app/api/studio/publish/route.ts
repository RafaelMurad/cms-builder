/**
 * Publish API Routes
 *
 * POST /api/studio/publish - Publish content and trigger ISR revalidation
 *
 * This endpoint handles:
 * - Publishing galleries
 * - Publishing site configuration
 * - Triggering Next.js ISR revalidation for affected pages
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// Validation schema for publish request
const publishSchema = z.object({
  type: z.enum(["gallery", "site", "page", "all"]),
  id: z.string().optional(),
  revalidatePaths: z.array(z.string()).optional(),
});

// POST - Publish content and trigger revalidation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, id, revalidatePaths } = publishSchema.parse(body);

    const results: {
      published: string[];
      revalidated: string[];
      errors: string[];
    } = {
      published: [],
      revalidated: [],
      errors: [],
    };

    // Handle different publish types
    switch (type) {
      case "gallery": {
        if (!id) {
          return NextResponse.json(
            { error: "Gallery ID required" },
            { status: 400 }
          );
        }

        // Verify ownership and publish
        const gallery = await prisma.gallery.findFirst({
          where: { id, userId: session.user.id },
        });

        if (!gallery) {
          return NextResponse.json(
            { error: "Gallery not found" },
            { status: 404 }
          );
        }

        await prisma.gallery.update({
          where: { id },
          data: { isPublished: true, publishedAt: new Date() },
        });

        results.published.push(`gallery:${gallery.slug}`);

        // Revalidate gallery-related paths
        try {
          revalidatePath("/");
          revalidatePath("/work");
          revalidatePath(`/work/${gallery.slug}`);
          revalidateTag("galleries");
          results.revalidated.push("/", "/work", `/work/${gallery.slug}`);
        } catch (e) {
          results.errors.push(`Revalidation error: ${e}`);
        }
        break;
      }

      case "site": {
        if (!id) {
          return NextResponse.json(
            { error: "Site ID required" },
            { status: 400 }
          );
        }

        // Verify ownership and publish
        const site = await prisma.site.findFirst({
          where: { id, userId: session.user.id },
        });

        if (!site) {
          return NextResponse.json(
            { error: "Site not found" },
            { status: 404 }
          );
        }

        await prisma.site.update({
          where: { id },
          data: { isPublished: true, publishedAt: new Date() },
        });

        results.published.push(`site:${site.slug}`);

        // Revalidate all site pages
        try {
          revalidatePath("/");
          revalidatePath("/work");
          revalidatePath("/contact");
          revalidateTag("site-config");
          results.revalidated.push("/", "/work", "/contact");
        } catch (e) {
          results.errors.push(`Revalidation error: ${e}`);
        }
        break;
      }

      case "page": {
        if (!id) {
          return NextResponse.json(
            { error: "Page ID required" },
            { status: 400 }
          );
        }

        // Verify ownership and publish
        const page = await prisma.page.findFirst({
          where: { id, userId: session.user.id },
        });

        if (!page) {
          return NextResponse.json(
            { error: "Page not found" },
            { status: 404 }
          );
        }

        await prisma.page.update({
          where: { id },
          data: { isPublished: true, publishedAt: new Date() },
        });

        results.published.push(`page:${page.slug}`);

        // Revalidate the specific page
        try {
          revalidatePath(`/${page.slug}`);
          revalidateTag("pages");
          results.revalidated.push(`/${page.slug}`);
        } catch (e) {
          results.errors.push(`Revalidation error: ${e}`);
        }
        break;
      }

      case "all": {
        // Publish all unpublished content for this user
        const [galleries, sites, pages] = await Promise.all([
          prisma.gallery.updateMany({
            where: { userId: session.user.id, isPublished: false },
            data: { isPublished: true, publishedAt: new Date() },
          }),
          prisma.site.updateMany({
            where: { userId: session.user.id, isPublished: false },
            data: { isPublished: true, publishedAt: new Date() },
          }),
          prisma.page.updateMany({
            where: { userId: session.user.id, isPublished: false },
            data: { isPublished: true, publishedAt: new Date() },
          }),
        ]);

        results.published.push(
          `${galleries.count} galleries`,
          `${sites.count} sites`,
          `${pages.count} pages`
        );

        // Revalidate all paths
        try {
          revalidatePath("/", "layout");
          revalidateTag("galleries");
          revalidateTag("site-config");
          revalidateTag("pages");
          results.revalidated.push("all paths");
        } catch (e) {
          results.errors.push(`Revalidation error: ${e}`);
        }
        break;
      }
    }

    // Handle custom revalidation paths
    if (revalidatePaths?.length) {
      for (const path of revalidatePaths) {
        try {
          revalidatePath(path);
          results.revalidated.push(path);
        } catch (e) {
          results.errors.push(`Failed to revalidate ${path}: ${e}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error publishing content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Check publish status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (type && id) {
      // Helper to format item response
      const formatItemResponse = (item: {
        id: string;
        slug: string;
        isPublished: boolean;
        publishedAt: Date | null;
        updatedAt: Date;
      }) => {
        const publishedAt = item.publishedAt || new Date(0);
        const needsPublish = item.updatedAt > publishedAt;
        return {
          id: item.id,
          slug: item.slug,
          isPublished: item.isPublished,
          publishedAt: item.publishedAt,
          updatedAt: item.updatedAt,
          needsPublish,
        };
      };

      // Check specific item status based on type
      if (type === "gallery") {
        const gallery = await prisma.gallery.findFirst({
          where: { id, userId: session.user.id },
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            publishedAt: true,
            updatedAt: true,
          },
        });
        if (!gallery) {
          return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
        }
        return NextResponse.json(formatItemResponse(gallery));
      }

      if (type === "site") {
        const site = await prisma.site.findFirst({
          where: { id, userId: session.user.id },
          select: {
            id: true,
            name: true,
            slug: true,
            isPublished: true,
            publishedAt: true,
            updatedAt: true,
          },
        });
        if (!site) {
          return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }
        return NextResponse.json(formatItemResponse(site));
      }

      if (type === "page") {
        const page = await prisma.page.findFirst({
          where: { id, userId: session.user.id },
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            publishedAt: true,
            updatedAt: true,
          },
        });
        if (!page) {
          return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }
        return NextResponse.json(formatItemResponse(page));
      }

      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Return overall publish status
    const [unpublishedGalleries, unpublishedSites, unpublishedPages] =
      await Promise.all([
        prisma.gallery.count({
          where: { userId: session.user.id, isPublished: false },
        }),
        prisma.site.count({
          where: { userId: session.user.id, isPublished: false },
        }),
        prisma.page.count({
          where: { userId: session.user.id, isPublished: false },
        }),
      ]);

    return NextResponse.json({
      unpublished: {
        galleries: unpublishedGalleries,
        sites: unpublishedSites,
        pages: unpublishedPages,
        total: unpublishedGalleries + unpublishedSites + unpublishedPages,
      },
    });
  } catch (error) {
    console.error("Error checking publish status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
