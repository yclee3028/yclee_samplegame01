import { useState, type ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";

export function CollapsibleSection({
  title,
  hint,
  icon,
  defaultOpen = false,
  children,
  tone = "default",
  done = false,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  tone?: "default" | "accent";
  done?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section
      className="cute-card overflow-hidden"
      style={done ? { background: "var(--leaf)", borderColor: "var(--primary-dark)" } : undefined}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        style={{
          background: tone === "accent" ? "var(--accent)" : "transparent",
        }}
      >
        {icon && (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color:var(--accent)] text-base">
            {done ? <Check size={16} strokeWidth={3} className="text-[color:var(--primary-dark)]" /> : icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">
            {title}
            {done && (
              <span className="ml-1.5 text-[10px] font-black uppercase text-[color:var(--primary-dark)]">
                · Done
              </span>
            )}
          </p>
          {hint && (
            <p className="truncate text-[11px] font-bold text-muted-foreground">{hint}</p>
          )}
        </div>
        <ChevronDown
          size={18}
          className="shrink-0 transition-transform text-muted-foreground"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && <div className="border-t border-border bg-card px-4 py-3">{children}</div>}
    </section>
  );
}
