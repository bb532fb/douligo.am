import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white border-brand-dark hover:bg-[#61d406]",
  secondary: "bg-paper-raised text-teal border-teal hover:bg-teal-soft",
  ghost: "bg-transparent text-ink-soft border-transparent hover:bg-paper-raised hover:text-ink",
  danger: "bg-rose text-white border-rose-dark hover:bg-[#ff5c5c]",
};

export function Button({
  className,
  variant = "primary",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isGhost = variant === "ghost";

  return (
    <button
      className={cn(
        "tap-target inline-flex items-center justify-center rounded-2xl px-6 text-base font-extrabold tracking-wide",
        !isGhost && "pressable border-2",
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "..." : children}
    </button>
  );
}
