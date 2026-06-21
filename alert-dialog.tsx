import { CalendarDays } from "lucide-react";
import { useSim } from "@/lib/sim-store";

// Backwards-compat re-export for any older consumers
export { useSim as useSimHook };

// Static initial values kept for any non-reactive references (kept for safety).
export const SIM = {
  name: "Juniper",
  day: 6,
  rank: "Tiny Sprout",
  level: 3,
  xp: 80,
  xpMax: 200,
  streak: 5,
  longestStreak: 5,
  gems: 40,
  vitality: 5,
  plant: { name: "Maple Sapling", stage: 1, stageMax: 5, growth: 12 },
  focus: { active: true, timeLeft: "23:14", progress: 18 },
};

export function DayBanner() {
  const sim = useSim();
  return (
    <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-border bg-[color:var(--accent)] px-3 py-2">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card text-[color:var(--primary)]">
        <CalendarDays size={16} strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Simulation · Day {sim.day} · fresh start
        </p>
        <p className="truncate text-xs font-bold text-accent-foreground">
          Lvl {sim.level} {sim.rank} · 🔥 {sim.streak}d streak · 💎 {sim.gems}
        </p>
      </div>
    </div>
  );
}
