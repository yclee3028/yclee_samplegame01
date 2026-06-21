import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useSim, setSim, AVATARS } from "@/lib/sim-store";

export const Route = createFileRoute("/customize")({
  head: () => ({
    meta: [
      { title: "Customize · Sprout Quest" },
      { name: "description", content: "Choose the animal companion that represents you." },
    ],
  }),
  component: Customize,
});

function Customize() {
  const sim = useSim();
  const current = AVATARS.find((a) => a.key === sim.avatar) ?? AVATARS[0];

  return (
    <div className="pb-4">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">
          <ChevronLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-black">Choose your avatar</h1>
          <p className="truncate text-[11px] font-bold text-muted-foreground">
            Switch to any animal companion, any time
          </p>
        </div>
      </header>

      <div className="px-4 pt-4">
        {/* Preview */}
        <div className="cute-card relative h-44 overflow-hidden p-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 100%, oklch(0.93 0.06 130) 0%, oklch(0.96 0.03 90) 55%, oklch(0.985 0.012 70) 100%)",
            }}
          />
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[120px] leading-none"
            style={{ filter: "drop-shadow(0 4px 0 oklch(0.4 0.08 40 / 0.18))" }}
          >
            {current.emoji}
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2 py-0.5 text-[11px] font-bold backdrop-blur">
            {current.label}
          </span>
        </div>

        <p className="mt-4 px-1 text-[11px] font-black uppercase tracking-wide text-muted-foreground">
          Avatars
        </p>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {AVATARS.map((a) => {
            const on = sim.avatar === a.key;
            return (
              <button
                key={a.key}
                onClick={() => setSim({ avatar: a.key })}
                className="cute-card flex flex-col items-center gap-1 p-4"
                style={{
                  outline: on ? "3px solid var(--primary)" : "none",
                  outlineOffset: "-2px",
                }}
              >
                <span className="text-4xl">{a.emoji}</span>
                <span className="text-[11px] font-bold">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
