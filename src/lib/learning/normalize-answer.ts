const PUNCTUATION = /[.,!?;:։՝«»"'`´\-–—()[\]{}¿¡՜՞]/g;

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("und")
    .replace(/և/g, "եւ")
    .replace(/ё/g, "е")
    .replace(PUNCTUATION, "")
    .replace(/\s+/g, " ");
}

export function answersMatch(userAnswer: string, accepted: readonly string[]): boolean {
  const normalized = normalizeAnswer(userAnswer);
  return accepted.some((item) => normalizeAnswer(item) === normalized);
}

export function serializeOrder(tokens: readonly string[]): string {
  return tokens.map((token) => normalizeAnswer(token)).join(" ");
}
