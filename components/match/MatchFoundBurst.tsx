import { Avatar } from "@/components/shared/Avatar";
import { getAvatar } from "@/lib/avatars";

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
      <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-brand via-brand-cyan to-brand-pink flex items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-background flex items-center justify-center">
          <Avatar id={partnerId} size={72} />
        </div>
      </div>
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold">{label}</h2>
        <p className="mt-1 text-sm text-muted">{partner.name}</p>
        {sharedTags.length > 0 && (
          <p className="mt-1 text-xs text-muted">{sharedTags.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
