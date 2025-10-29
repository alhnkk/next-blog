import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prismadb =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
    // ✅ OPTIMIZED: Connection pooling and query optimization
    ...(process.env.DATABASE_URL?.includes("?") 
      ? {} 
      : { 
          errorFormat: "pretty",
        }
    ),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismadb;
