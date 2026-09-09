"use client";

import { useVoicePrefs } from "@/components/voice/use-voice-prefs";
import { useI18n } from "@/components/i18n/i18n-provider";

export function VoiceToggles() {
  const { dict } = useI18n();
  const { prefs, update } = useVoicePrefs();

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-extrabold text-ink-soft">{dict.voice.enabled}</legend>
      <Toggle
        checked={prefs.enabled}
        label={dict.voice.enabled}
        onChange={(enabled) => update({ enabled })}
      />
      <Toggle
        checked={prefs.autoplay}
        label={dict.voice.autoplay}
        onChange={(autoplay) => update({ autoplay })}
      />
    </fieldset>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border-2 border-b-4 border-line bg-paper px-4 py-3 font-extrabold">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-[var(--brand)]"
      />
    </label>
  );
}
