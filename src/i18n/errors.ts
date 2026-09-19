import type { Dictionary, ErrorKey } from "@/i18n/types";
import { AppError } from "@/lib/errors/app-error";

const ERROR_CODES: Record<string, ErrorKey> = {
  EMAIL_TAKEN: "emailTaken",
  NOT_FOUND: "notFound",
  LOCKED: "lessonLocked",
  NO_HEARTS: "noHearts",
  ALREADY_ANSWERED: "alreadyAnswered",
  INVALID_ATTEMPT: "invalidAttempt",
  UNAUTHORIZED: "unauthorized",
  VALIDATION: "validation",
  FORBIDDEN: "forbidden",
  ACCOUNT_SUSPENDED: "accountSuspended",
};

export function isErrorKey(value: string): value is ErrorKey {
  return value in {
    invalidEmail: true,
    passwordMin: true,
    passwordMismatch: true,
    nameMin: true,
    emailTaken: true,
    invalidCredentials: true,
    required: true,
    unauthorized: true,
    notFound: true,
    lessonLocked: true,
    noHearts: true,
    alreadyAnswered: true,
    invalidAttempt: true,
    generic: true,
    validation: true,
    forbidden: true,
    accountSuspended: true,
  };
}

export function translateError(error: unknown, dict: Dictionary, fallback: ErrorKey = "generic"): string {
  if (error instanceof AppError) {
    const fromCode = ERROR_CODES[error.code];
    if (fromCode) {
      return dict.errors[fromCode];
    }
    if (isErrorKey(error.message)) {
      return dict.errors[error.message];
    }
  }

  return dict.errors[fallback];
}

export function translateErrorKey(key: string | undefined, dict: Dictionary, fallback: ErrorKey = "validation"): string {
  if (key && isErrorKey(key)) {
    return dict.errors[key];
  }
  return dict.errors[fallback];
}
