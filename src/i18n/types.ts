import type hy from "@/i18n/messages/hy.json";

export type Dictionary = typeof hy;
export type ErrorKey = keyof Dictionary["errors"];
