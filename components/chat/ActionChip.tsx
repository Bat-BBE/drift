export function ActionChip({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-brand/25 bg-brand/10 px-3 text-xs font-medium text-foreground transition-colors hover:border-brand/50 hover:bg-brand/15 active:scale-95"
    >
      <span aria-hidden className="text-sm leading-none">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
