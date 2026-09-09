import { answersMatch, normalizeAnswer } from "@/lib/learning/normalize-answer";

export function spokenMatches(transcript: string, accepted: readonly string[]): boolean {
  if (answersMatch(transcript, accepted)) {
    return true;
  }

  const spoken = normalizeAnswer(transcript);
  return accepted.some((item) => isCloseSpoken(spoken, normalizeAnswer(item)));
}

export function matchSpokenOption<T extends { id: string; text: string }>(
  transcript: string,
  options: readonly T[],
): T | null {
  return options.find((option) => spokenMatches(transcript, [option.text])) ?? null;
}

export function pickTokensFromSpeech(
  transcript: string,
  bank: readonly string[],
): { picked: string[]; remaining: string[] } {
  const remaining = [...bank];
  const picked: string[] = [];
  const words = normalizeAnswer(transcript).split(" ").filter(Boolean);

  for (const word of words) {
    const index = remaining.findIndex((token) => normalizeAnswer(token) === word);
    if (index < 0) {
      continue;
    }
    const token = remaining[index];
    if (!token) {
      continue;
    }
    picked.push(token);
    remaining.splice(index, 1);
  }

  return { picked, remaining };
}

function isCloseSpoken(spoken: string, target: string): boolean {
  if (!spoken || !target || spoken === target) {
    return Boolean(spoken) && spoken === target;
  }

  const spokenWords = spoken.split(" ").filter(Boolean);
  const targetWords = target.split(" ").filter(Boolean);
  if (spokenWords.includes(target) || containsSequence(spokenWords, targetWords)) {
    return true;
  }
  if (!spoken.includes(target) && !target.includes(spoken)) {
    return false;
  }

  const shorter = Math.min(spoken.length, target.length);
  const longer = Math.max(spoken.length, target.length);
  return shorter / longer >= 0.6;
}

function containsSequence(haystack: string[], needle: string[]): boolean {
  if (needle.length === 0 || needle.length > haystack.length) {
    return false;
  }
  return haystack.some((_, index) => needle.every((word, offset) => haystack[index + offset] === word));
}
