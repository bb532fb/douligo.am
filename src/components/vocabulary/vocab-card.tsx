"use client";

import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SpeakButton } from "@/components/voice/speak-button";
import { speechLangFromText } from "@/lib/voice/locale";

type VocabCardProps = {
  targetText: string;
  sourceText: string;
  pronunciation: string;
  exampleSentence: string;
  mastery: number;
};

export function VocabCard({
  targetText,
  sourceText,
  pronunciation,
  exampleSentence,
  mastery,
}: VocabCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <SpeakButton text={targetText} lang={speechLangFromText(targetText)} />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-black">{targetText}</p>
          <p className="font-semibold text-ink-soft">{sourceText}</p>
          <p className="mt-1 text-sm font-bold text-teal">{pronunciation}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <SpeakButton text={exampleSentence} lang={speechLangFromText(exampleSentence)} size="sm" />
        <p className="text-sm font-semibold">{exampleSentence}</p>
      </div>
      <ProgressBar className="mt-3" label="⭐" value={mastery} />
    </Card>
  );
}
