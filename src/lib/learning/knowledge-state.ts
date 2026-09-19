import type { KnowledgeState } from "@prisma/client";

export type KnowledgeSnapshot = {
  state: KnowledgeState;
  score: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  successfulReviews: number;
  distinctReviewDays: number;
};

export function nextKnowledgeState(snapshot: KnowledgeSnapshot): KnowledgeState {
  if (shouldDropToWeak(snapshot)) {
    return "WEAK";
  }
  if (snapshot.state === "NEW") {
    return "LEARNING";
  }
  if (snapshot.state === "WEAK" && snapshot.score >= 60 && snapshot.consecutiveCorrect >= 2) {
    return "LEARNING";
  }
  if (canMaster(snapshot)) {
    return "MASTERED";
  }
  if (canLearn(snapshot)) {
    return "LEARNED";
  }
  return snapshot.state === "MASTERED" ? "LEARNED" : snapshot.state;
}

function shouldDropToWeak(snapshot: KnowledgeSnapshot): boolean {
  if (snapshot.state === "NEW" || snapshot.state === "LEARNING") {
    return snapshot.consecutiveWrong >= 3 || (snapshot.score < 40 && snapshot.consecutiveWrong >= 2);
  }
  if (snapshot.state === "MASTERED") {
    return snapshot.score < 70 || snapshot.consecutiveWrong >= 2;
  }
  return snapshot.score < 55 || snapshot.consecutiveWrong >= 3;
}

function canLearn(snapshot: KnowledgeSnapshot): boolean {
  return snapshot.score >= 70 && snapshot.consecutiveCorrect >= 3;
}

function canMaster(snapshot: KnowledgeSnapshot): boolean {
  return (
    snapshot.score >= 90 &&
    snapshot.consecutiveCorrect >= 5 &&
    snapshot.successfulReviews >= 3 &&
    snapshot.distinctReviewDays >= 2
  );
}
