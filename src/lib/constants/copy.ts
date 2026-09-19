export const AUTH_ERRORS = {
  invalidEmail: "invalidEmail",
  passwordMin: "passwordMin",
  passwordMismatch: "passwordMismatch",
  nameMin: "nameMin",
  emailTaken: "emailTaken",
  invalidCredentials: "invalidCredentials",
  required: "required",
} as const;

export const APP_ERRORS = {
  unauthorized: "unauthorized",
  notFound: "notFound",
  lessonLocked: "lessonLocked",
  noHearts: "noHearts",
  alreadyAnswered: "alreadyAnswered",
  invalidAttempt: "invalidAttempt",
  generic: "generic",
  validation: "validation",
  forbidden: "forbidden",
  accountSuspended: "accountSuspended",
} as const;
