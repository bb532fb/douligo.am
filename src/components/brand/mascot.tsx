import { APP_NAME } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";

export type MascotMood = "happy" | "wow" | "sad" | "celebrate" | "think";

type MascotProps = {
  mood?: MascotMood;
  size?: number;
  animated?: boolean;
  className?: string;
};

export function Mascot({ mood = "happy", size = 160, animated = true, className }: MascotProps) {
  const motionClass = animated ? (mood === "celebrate" ? "mascot-wiggle" : "mascot-float") : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn(motionClass, className)}
      role="img"
      aria-label={`${APP_NAME} mascot`}
    >
      <ellipse cx="100" cy="182" rx="46" ry="9" fill="rgba(60,60,60,0.12)" />
      {mood === "celebrate" ? <Sparkles /> : null}
      <ellipse cx="58" cy="54" rx="20" ry="24" fill="#46A302" />
      <ellipse cx="142" cy="54" rx="20" ry="24" fill="#46A302" />
      <ellipse cx="58" cy="58" rx="9" ry="11" fill="#FFB4C8" />
      <ellipse cx="142" cy="58" rx="9" ry="11" fill="#FFB4C8" />
      <circle cx="100" cy="112" r="72" fill="#58CC02" />
      <ellipse cx="100" cy="134" rx="46" ry="38" fill="#89E219" />
      <Eyes mood={mood} />
      <ellipse cx="52" cy="124" rx="13" ry="8" fill="#FF8FAB" opacity="0.75" />
      <ellipse cx="148" cy="124" rx="13" ry="8" fill="#FF8FAB" opacity="0.75" />
      <Mouth mood={mood} />
    </svg>
  );
}

function Eyes({ mood }: { mood: MascotMood }) {
  const lookY = mood === "think" ? 96 : 104;
  const open = mood === "wow" || mood === "celebrate";

  return (
    <>
      <ellipse cx="78" cy="100" rx={open ? 18 : 16} ry={open ? 22 : 20} fill="white" />
      <ellipse cx="122" cy="100" rx={open ? 18 : 16} ry={open ? 22 : 20} fill="white" />
      {mood === "sad" ? (
        <>
          <path d="M64 84 Q78 92 92 84" stroke="#3C3C3C" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M108 84 Q122 92 136 84" stroke="#3C3C3C" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : null}
      <circle cx="80" cy={lookY} r={open ? 9 : 8} fill="#3C3C3C" />
      <circle cx="124" cy={lookY} r={open ? 9 : 8} fill="#3C3C3C" />
      <circle cx="76" cy={lookY - 6} r="3" fill="white" />
      <circle cx="120" cy={lookY - 6} r="3" fill="white" />
    </>
  );
}

function Mouth({ mood }: { mood: MascotMood }) {
  if (mood === "wow") {
    return <ellipse cx="100" cy="144" rx="12" ry="16" fill="#3C3C3C" />;
  }
  if (mood === "sad") {
    return (
      <>
        <path d="M82 150 Q100 138 118 150" stroke="#3C3C3C" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="54" cy="138" rx="5" ry="8" fill="#1CB0F6" />
      </>
    );
  }
  if (mood === "think") {
    return <path d="M88 144 Q100 148 112 144" stroke="#3C3C3C" strokeWidth="6" fill="none" strokeLinecap="round" />;
  }
  return (
    <>
      <path d="M76 136 Q100 160 124 136" stroke="#3C3C3C" strokeWidth="7" fill="none" strokeLinecap="round" />
      {mood === "celebrate" ? (
        <path d="M88 144 Q100 154 112 144" fill="#FF4B4B" />
      ) : null}
    </>
  );
}

function Sparkles() {
  return (
    <g className="sparkle" fill="#FFC800">
      <polygon points="28,40 32,52 44,56 32,60 28,72 24,60 12,56 24,52" />
      <polygon points="172,28 176,40 188,44 176,48 172,60 168,48 156,44 168,40" />
      <polygon points="168,150 171,158 180,161 171,164 168,172 165,164 156,161 165,158" />
    </g>
  );
}
