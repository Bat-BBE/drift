import { getAvatar } from "@/lib/avatars";

type AvatarProps = {
  id: string;
  size?: number;
  minSize?: number;
  className?: string;
};

export function Avatar({
  id,
  size = 32,
  minSize,
  className = "",
}: AvatarProps) {
  const a = getAvatar(id);
  const min = minSize ?? Math.round(size * 0.75);

  return (
    <span
      className={`inline-flex aspect-square shrink-0 select-none items-center justify-center rounded-full leading-none overflow-hidden ${className}`}
      style={{
        width: `clamp(${min}px, ${(size / 16).toFixed(3)}rem, ${size}px)`,
        height: `clamp(${min}px, ${(size / 16).toFixed(3)}rem, ${size}px)`,
        fontSize: `clamp(${(min * 0.55).toFixed(1)}px, ${((size * 0.55) / 16).toFixed(3)}rem, ${(size * 0.55).toFixed(1)}px)`,
        background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
      }}
      aria-hidden
    >
      {a.emoji}
    </span>
  );
}
