import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm font-extrabold text-ink-soft">{label}</span>
      <input
        id={inputId}
        className={cn(
          "tap-target w-full rounded-2xl border-2 border-b-4 border-line bg-paper-raised px-4 text-base font-semibold text-ink",
          "focus:border-teal",
          error && "border-rose",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="block text-sm font-bold text-rose" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
