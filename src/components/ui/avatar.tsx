const TONES = ["bg-brand", "bg-sky", "bg-violet", "bg-clay", "bg-teal"] as const;

type AvatarProps = {
  name: string;
  size?: "sm" | "md";
};

export function Avatar({ name, size = "md" }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "L";
  const dimension = size === "sm" ? "h-10 w-10 text-base" : "h-16 w-16 text-2xl";
  const tone = TONES[name.length % TONES.length] ?? "bg-brand";

  return (
    <span
      className={`inline-flex ${dimension} items-center justify-center rounded-full border-4 border-white font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.08)] ${tone}`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
