"use client";

import { Button } from "@/components/ui/Button";

export function ReportSheet({
  onReport,
  onCancel,
  title,
  subtitle,
  reasons,
  cancelLabel,
}: {
  onReport: (reason: string) => void;
  onCancel: () => void;
  title: string;
  subtitle: string;
  reasons: readonly string[];
  cancelLabel: string;
}) {
  return (
    <div className="w-full max-w-md rounded-lg bg-surface1/95 backdrop-blur-xl border border-border p-6">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      <div className="mt-5 flex flex-col gap-2">
        {reasons.map((reason) => (
          <button
            key={reason}
            onClick={() => onReport(reason)}
            className="rounded-sm border border-border bg-surface2 px-4 py-3 text-left text-sm transition-colors duration-fast hover:bg-danger/10 hover:text-danger"
          >
            {reason}
          </button>
        ))}
      </div>

      <Button variant="ghost" size="lg" className="mt-4 w-full" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}
