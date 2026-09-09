import { AUTH_ERRORS } from "@/lib/constants/copy";
import { hashPassword } from "@/lib/auth/password";
import { AppError } from "@/lib/errors/app-error";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { userRepository } from "@/server/repositories/user-repository";

export const authService = {
  async register(input: RegisterInput) {
    const parsed = registerSchema.parse(input);
    const existing = await userRepository.findByEmail(parsed.email);
    if (existing) {
      throw new AppError("EMAIL_TAKEN", AUTH_ERRORS.emailTaken, 409);
    }

    const passwordHash = await hashPassword(parsed.password);
    return userRepository.create({
      email: parsed.email,
      name: parsed.name,
      passwordHash,
    });
  },
};
