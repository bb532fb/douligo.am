"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_VOICE_PREFS,
  VOICE_PREFS_KEY,
  readVoicePrefs,
  writeVoicePrefs,
  type VoicePrefs,
} from "@/lib/voice/prefs";

const VOICE_EVENT = "lezu-voice";

let snapshot = DEFAULT_VOICE_PREFS;
let snapshotKey = "__unset__";

export function useVoicePrefs() {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback((patch: Partial<VoicePrefs>) => {
    writeVoicePrefs({ ...readVoicePrefs(), ...patch });
    window.dispatchEvent(new Event(VOICE_EVENT));
  }, []);

  return { prefs, update };
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(VOICE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(VOICE_EVENT, onStoreChange);
  };
}

function getSnapshot(): VoicePrefs {
  const key = window.localStorage.getItem(VOICE_PREFS_KEY) ?? "";
  if (key === snapshotKey) {
    return snapshot;
  }
  snapshotKey = key;
  snapshot = readVoicePrefs();
  return snapshot;
}

function getServerSnapshot(): VoicePrefs {
  return DEFAULT_VOICE_PREFS;
}
