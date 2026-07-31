import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";

const CONFETTI = [
  { angle: -70, dist: 92, size: 7, color: "bg-brand", delay: 0 },
  { angle: -35, dist: 108, size: 5, color: "bg-brand-cyan", delay: 40 },
  { angle: -10, dist: 84, size: 6, color: "bg-brand-pink", delay: 90 },
  { angle: 18, dist: 100, size: 5, color: "bg-brand", delay: 20 },
  { angle: 50, dist: 90, size: 7, color: "bg-brand-cyan", delay: 70 },
  { angle: 82, dist: 104, size: 5, color: "bg-brand-pink", delay: 110 },
  { angle: 120, dist: 96, size: 6, color: "bg-brand", delay: 30 },
  { angle: 155, dist: 88, size: 5, color: "bg-brand-cyan", delay: 80 },
  { angle: -110, dist: 100, size: 6, color: "bg-brand-pink", delay: 50 },
  { angle: -145, dist: 90, size: 5, color: "bg-brand", delay: 100 },
] as const;

export function MatchFoundBurst({
  partnerId,
  sharedTags,
  label,
}: {
  partnerId: string;
  sharedTags: string[];
  label: string;
}) {
  const partner = getAvatar(partnerId);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 animate-match-burst">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute h-28 w-28 rounded-full border-2 border-brand/60 animate-match-shock motion-reduce:hidden" />
        <span className="absolute h-28 w-28 rounded-full border-2 border-brand-cyan/50 animate-match-shock motion-reduce:hidden [animation-delay:120ms]" />
        <span className="absolute h-28 w-28 rounded-full border-2 border-brand-pink/40 animate-match-shock motion-reduce:hidden [animation-delay:240ms]" />

        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className={`absolute left-1/2 top-1/2 rounded-full ${c.color} animate-match-confetti motion-reduce:hidden`}
            style={
              {
                width: c.size,
                height: c.size,
                animationDelay: `${c.delay}ms`,
                "--tx": `${Math.cos((c.angle * Math.PI) / 180) * c.dist}px`,
                "--ty": `${Math.sin((c.angle * Math.PI) / 180) * c.dist}px`,
              } as React.CSSProperties
            }
          />
        ))}

        <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-brand via-brand-cyan to-brand-pink p-1 shadow-[0_0_40px_rgba(124,92,255,0.35)] animate-match-avatar">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
            <Avatar id={partnerId} size={72} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <h2 className="animate-match-text-in font-display text-2xl font-semibold [animation-delay:180ms]">
          {label}
        </h2>
        <p className="animate-match-text-in mt-1 text-sm text-muted [animation-delay:260ms]">
          {partner.name}
        </p>

        {sharedTags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            {sharedTags.map((tag, i) => (
              <span
                key={tag}
                className="animate-match-tag-in rounded-full border border-border bg-surface1/80 px-2.5 py-1 text-xs text-muted backdrop-blur-xl"
                style={{ animationDelay: `${340 + i * 70}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
