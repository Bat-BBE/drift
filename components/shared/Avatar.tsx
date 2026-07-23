import { getAvatar } from "@/lib/avatars";

export function Avatar({ id, size = 32 }: { id: string; size?: number }) {
  const a = getAvatar(id);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full leading-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.55,
        background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
      }}
      aria-hidden
    >
      {a.emoji}
    </span>
  );
}
