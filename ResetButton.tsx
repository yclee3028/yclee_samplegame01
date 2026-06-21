import { Flame, Gem, Heart, Info, MoonStar, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSim } from "@/lib/sim-store";

function useBedtimeCountdown(bedtime: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const [bh, bm] = bedtime.split(":").map(Number);
  const target = new Date(now);
  target.setHours(bh, bm, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  const diff = target.getTime() - now.getTime();
  const totalMin = Math.round(diff / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return { h, m, label: h > 0 ? `${h}h ${m}m` : `${m}m` };
}

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const sim = useSim();
  const [open, setOpen] = useState(false);
  const bed = useBedtimeCountdown(sim.bedtime);

  return (
    <header className="sticky top-0 z-20 border-b-2 border-border bg-background/95 px-4 pb-3 pt-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-black text-foreground">{title}</h1>
          {subtitle && (
            <p className="truncate text-xs font-bold text-muted-foreground">{subtitle}</p>
          )}
          {bed && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-[color:var(--primary-dark)]">
              <MoonStar size={10} /> app closes in {bed.label} (bedtime {sim.bedtime})
            </p>
          )}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 items-center gap-1.5"
          aria-label="What do these mean?"
        >
          <span
            title="Streak: consecutive days you logged a check-in"
            className="cute-pill bg-[color:var(--sun)] text-[color:var(--sun-foreground)] border-2 border-[color:var(--sun-foreground)]/20"
          >
            <Flame size={12} strokeWidth={3} /> {sim.streak}
          </span>
          <span
            title="Gems: earned by finishing quests, spend in Shop"
            className="cute-pill bg-[color:var(--sky)] text-[color:var(--sky-foreground)] border-2 border-[color:var(--sky-foreground)]/20"
          >
            <Gem size={12} strokeWidth={3} /> {sim.gems}
          </span>
          <span
            title="Hearts: vitality — lose one if you miss a daily check-in"
            className="cute-pill bg-[color:var(--berry)] text-[color:var(--berry-foreground)] border-2 border-[color:var(--berry-foreground)]/20"
          >
            <Heart size={12} strokeWidth={3} fill="currentColor" /> {sim.vitality}
          </span>
          <Info size={14} className="text-muted-foreground" />
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-2 rounded-2xl border-2 border-border bg-card p-3 text-[11px] font-bold">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-black uppercase text-muted-foreground">
              What's at the top?
            </p>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X size={14} />
            </button>
          </div>
          <Legend
            icon={<Flame size={12} className="text-[color:var(--sun-foreground)]" />}
            tint="var(--sun)"
            title="Streak"
            body="One per day you check in. Skip a day and it resets."
          />
          <Legend
            icon={<Gem size={12} className="text-[color:var(--sky-foreground)]" />}
            tint="var(--sky)"
            title="Gems"
            body="Earn by finishing quests & focus sessions. Spend in the Shop on seeds, outfits, and boosts."
          />
          <Legend
            icon={<Heart size={12} fill="currentColor" className="text-[color:var(--berry-foreground)]" />}
            tint="var(--berry)"
            title="Hearts (vitality)"
            body="Max 5. Lose one if you miss a daily check-in; regrow by logging mood 3 days in a row."
          />
        </div>
      )}
    </header>
  );
}

function Legend({
  icon,
  tint,
  title,
  body,
}: {
  icon: React.ReactNode;
  tint: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
        style={{ background: tint }}
      >
        {icon}
      </span>
      <div>
        <p className="text-[12px] font-black">{title}</p>
        <p className="text-[11px] font-bold text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
