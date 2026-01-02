import { cn } from "@repo/ui/lib/utils";

interface DetailRowProps {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
}

export function DetailRow({ label, value, className }: DetailRowProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-3 border-b border-border last:border-0 last:pb-0",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
