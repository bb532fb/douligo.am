"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MicButton } from "@/components/voice/mic-button";
import { SpeakButton } from "@/components/voice/speak-button";
import { useI18n } from "@/components/i18n/i18n-provider";
import { interpolate } from "@/i18n/interpolate";
import { cn } from "@/lib/utils/cn";
import { speechLangFromCode } from "@/lib/voice/locale";
import { matchSpokenOption, pickTokensFromSpeech } from "@/lib/voice/spoken-match";
import type { AnswerPayload, PublicQuestion } from "@/types/learning";

type QuestionPromptProps = {
  question: PublicQuestion;
  disabled: boolean;
  onSubmit: (answer: AnswerPayload) => void;
};

export function QuestionPrompt({ question, disabled, onSubmit }: QuestionPromptProps) {
  const { dict } = useI18n();
  const [text, setText] = useState("");
  const [optionId, setOptionId] = useState<string | null>(null);
  const [bank, setBank] = useState(question.tokens);
  const [picked, setPicked] = useState<string[]>([]);
  const [heard, setHeard] = useState<string | null>(null);
  const promptLang = speechLangFromCode(question.sourceLanguage);
  const answerLang = speechLangFromCode(question.targetLanguage);

  function submitFromState(nextOption = optionId, nextPicked = picked, nextText = text) {
    if (question.type === "MULTIPLE_CHOICE" && nextOption) {
      onSubmit({ kind: "option", optionId: nextOption });
      return;
    }
    if (question.type === "WORD_ORDER" && nextPicked.length > 0) {
      onSubmit({ kind: "order", tokens: nextPicked });
      return;
    }
    if (nextText.trim()) {
      onSubmit({ kind: "text", value: nextText });
    }
  }

  function onTranscripts(transcripts: string[]) {
    const spoken = transcripts[0] ?? "";
    setHeard(spoken);
    applySpeech(question, transcripts, { setOptionId, setPicked, setBank, setText, submitFromState });
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-start gap-3">
        <SpeakButton text={question.prompt} lang={promptLang} autoPlay />
        <p className="text-xl font-black leading-relaxed">{question.prompt}</p>
      </div>
      {question.type === "MULTIPLE_CHOICE" ? (
        <ChoiceList
          options={question.options}
          selected={optionId}
          disabled={disabled}
          lang={answerLang}
          onSelect={setOptionId}
        />
      ) : null}
      {question.type === "WORD_ORDER" ? (
        <WordOrder
          bank={bank}
          picked={picked}
          disabled={disabled}
          lang={answerLang}
          onPick={(token, index) => {
            setBank((items) => items.filter((_, itemIndex) => itemIndex !== index));
            setPicked((items) => [...items, token]);
          }}
          onUnpick={(token, index) => {
            setPicked((items) => items.filter((_, itemIndex) => itemIndex !== index));
            setBank((items) => [...items, token]);
          }}
        />
      ) : null}
      {question.type === "TRANSLATE" || question.type === "TYPE_ANSWER" ? (
        <label className="block space-y-2">
          <span className="sr-only">{dict.lesson.answer}</span>
          <input
            value={text}
            disabled={disabled}
            onChange={(event) => setText(event.target.value)}
            className="tap-target w-full rounded-2xl border-2 border-b-4 border-line bg-paper px-4 font-bold"
          />
        </label>
      ) : null}
      {heard ? <p className="text-sm font-bold text-ink-soft">{interpolate(dict.voice.heard, { text: heard })}</p> : null}
      {!disabled ? (
        <>
          <MicButton lang={answerLang} onTranscript={onTranscripts} />
          <Button className="w-full" onClick={() => submitFromState()}>
            {dict.common.check}
          </Button>
        </>
      ) : null}
    </Card>
  );
}

function applySpeech(
  question: PublicQuestion,
  transcripts: string[],
  actions: {
    setOptionId: (id: string) => void;
    setPicked: (tokens: string[]) => void;
    setBank: (tokens: string[]) => void;
    setText: (value: string) => void;
    submitFromState: (optionId?: string | null, picked?: string[], text?: string) => void;
  },
) {
  if (question.type === "MULTIPLE_CHOICE") {
    const match = transcripts.map((item) => matchSpokenOption(item, question.options)).find(Boolean);
    if (match) {
      actions.setOptionId(match.id);
      actions.submitFromState(match.id);
    }
    return;
  }
  if (question.type === "WORD_ORDER") {
    const spoken = transcripts[0] ?? "";
    const result = pickTokensFromSpeech(spoken, question.tokens);
    actions.setPicked(result.picked);
    actions.setBank(result.remaining);
    if (result.remaining.length === 0 && result.picked.length > 0) {
      actions.submitFromState(null, result.picked);
    }
    return;
  }
  const spoken = transcripts[0] ?? "";
  actions.setText(spoken);
  actions.submitFromState(null, [], spoken);
}

function ChoiceList({
  options,
  selected,
  disabled,
  lang,
  onSelect,
}: {
  options: PublicQuestion["options"];
  selected: string | null;
  disabled: boolean;
  lang: ReturnType<typeof speechLangFromCode>;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {options.map((option) => (
        <li key={option.id} className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className={cn(
              "pressable tap-target min-w-0 flex-1 rounded-2xl border-2 px-4 text-left font-extrabold",
              selected === option.id
                ? "border-teal bg-teal-soft text-teal-dark"
                : "border-line bg-paper-raised",
            )}
          >
            {option.text}
          </button>
          <SpeakButton text={option.text} lang={lang} size="sm" />
        </li>
      ))}
    </ul>
  );
}

function WordOrder({
  bank,
  picked,
  disabled,
  lang,
  onPick,
  onUnpick,
}: {
  bank: string[];
  picked: string[];
  disabled: boolean;
  lang: ReturnType<typeof speechLangFromCode>;
  onPick: (token: string, index: number) => void;
  onUnpick: (token: string, index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex min-h-16 flex-wrap gap-2 rounded-2xl border-2 border-dashed border-line bg-paper p-3">
        {picked.map((token, index) => (
          <button
            key={`${token}-${index}`}
            type="button"
            disabled={disabled}
            className="pressable rounded-2xl border-2 border-teal bg-teal-soft px-3 py-2 font-extrabold text-teal-dark"
            onClick={() => onUnpick(token, index)}
          >
            {token}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {bank.map((token, index) => (
          <button
            key={`${token}-bank-${index}`}
            type="button"
            disabled={disabled}
            className="pressable rounded-2xl border-2 border-line bg-paper-raised px-3 py-2 font-extrabold"
            onClick={() => onPick(token, index)}
          >
            {token}
          </button>
        ))}
        {picked.length > 0 ? <SpeakButton text={picked.join(" ")} lang={lang} size="sm" /> : null}
      </div>
    </div>
  );
}
