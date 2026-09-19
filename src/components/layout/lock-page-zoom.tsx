"use client";

import { useEffect } from "react";

export function LockPageZoom() {
  useEffect(() => {
    const blockGesture = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("gesturestart", blockGesture);
    document.addEventListener("gesturechange", blockGesture);
    document.addEventListener("gestureend", blockGesture);

    return () => {
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      document.removeEventListener("gestureend", blockGesture);
    };
  }, []);

  return null;
}
