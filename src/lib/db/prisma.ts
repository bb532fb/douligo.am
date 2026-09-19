import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function pgConnectionString(url: string): string {
  return url.replace(
    /([?&]sslmode=)(require|prefer|verify-ca)\b/i,
    "$1verify-full",
  );
}

function createPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({
    connectionString: pgConnectionString(connectionString),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
  });

  return new PrismaClient({
    adapter,
    transactionOptions: {
      maxWait: 15_000,
      timeout: 20_000,
    },
  });
}

function getClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (cached?.appSettings) {
    return cached;
  }
  if (cached) {
    void cached.$disconnect();
  }
  const client = createPrisma();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getClient();
