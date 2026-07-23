export function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="flex items-center gap-1 rounded-bubble rounded-bl-md bg-surface2 px-4 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-muted animate-dot-pulse [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted animate-dot-pulse [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted animate-dot-pulse [animation-delay:300ms]" />
      </div>
    </div>
  );
}
