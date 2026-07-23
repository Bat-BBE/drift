export function MatchFoundBurst({ sharedTags, label }: { sharedTags: string[]; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 animate-match-burst">
      <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-brand via-brand-cyan to-brand-pink flex items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-background flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-surface2 border border-border" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold">{label}</h2>
        {sharedTags.length > 0 && (
          <p className="mt-2 text-sm text-muted">{sharedTags.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
