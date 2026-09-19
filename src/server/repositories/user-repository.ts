import { prisma } from "@/lib/db/prisma";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  },

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true, streak: true },
    });
  },

  findAccountById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, status: true },
    });
  },

  create(input: { email: string; name: string; passwordHash: string; hearts?: number }) {
    return prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        passwordHash: input.passwordHash,
        profile: {
          create: {
            displayName: input.name,
            nativeLanguage: "HY",
            ...(input.hearts != null ? { hearts: input.hearts } : {}),
          },
        },
        streak: {
          create: {},
        },
      },
    });
  },
};
