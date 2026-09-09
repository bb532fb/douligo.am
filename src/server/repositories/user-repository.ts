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

  create(input: { email: string; name: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        passwordHash: input.passwordHash,
        profile: {
          create: {
            displayName: input.name,
            nativeLanguage: "HY",
          },
        },
        streak: {
          create: {},
        },
      },
    });
  },
};
