/**
 * Prisma Client Singleton
 *
 * Prevents multiple Prisma Client instances in development
 * due to hot reloading.
 *
 * Setup:
 * 1. Copy .env.example to .env.local
 * 2. Add your DATABASE_URL
 * 3. Run: npm run db:generate && npm run db:push
 */

// Type for PrismaClient when it's available
type PrismaClientType = {
  user: any;
  account: any;
  session: any;
  gallery: any;
  galleryItem: any;
  page: any;
  mediaFile: any;
  site: any;
  socialLink: any;
  analyticsEvent: any;
  apiKey: any;
  verificationToken: any;
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
};

// Create a mock client for when Prisma isn't available
const createMockClient = (): PrismaClientType => {
  const mockModel = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (data: any) => ({ id: "mock-id", ...data.data }),
    update: async (data: any) => ({ id: data.where.id, ...data.data }),
    delete: async () => ({ success: true }),
    count: async () => 0,
    upsert: async (data: any) => data.create,
  };

  return {
    user: mockModel,
    account: mockModel,
    session: mockModel,
    gallery: mockModel,
    galleryItem: mockModel,
    page: mockModel,
    mediaFile: mockModel,
    site: mockModel,
    socialLink: mockModel,
    analyticsEvent: mockModel,
    apiKey: mockModel,
    verificationToken: mockModel,
    $connect: async () => {},
    $disconnect: async () => {},
  };
};

// Try to import PrismaClient, fallback to mock if not available
let prismaInstance: PrismaClientType;

try {
  // Dynamic import to handle cases where Prisma isn't generated
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as unknown as {
    prisma: typeof PrismaClient | undefined;
  };

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (error) {
  console.warn(
    "Prisma Client not available. Using mock client. Run 'npm run db:generate' to enable database features."
  );
  prismaInstance = createMockClient();
}

export const prisma = prismaInstance;
export default prisma;
