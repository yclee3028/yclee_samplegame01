import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { DayBanner } from "@/components/DayBanner";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { useSim, setSim, AVATARS, recommendationsFor } from "@/lib/sim-store";
import {
  Droplets,
  Moon,
  Footprints,
  Wand2,
  X,
  HeartPulse,
  Pill,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home · Sprout Quest" },
      { name: "description", content: "Your avatar, mood, and grove — all in one cozy place." },
      { property: "og:title", content: "Home · Sprout Quest" },
      { property: "og:description", content: "Your avatar, mood, and grove — all in one cozy place." },
    ],
  }),
  component: Home,
});

function Home() {
  const sim = useSim();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newCondition, setNewCondition] = useState("");

  useEffect(() => {
    if (!sim.onboarded) {
      navigate({ to: "/welcome" });
    }
  }, [sim.onboarded, navigate]);

  if (!sim.onboarded) return null;

  const avatar = AVATARS.find((a) => a.key === sim.avatar) ?? AVATARS[0];
  const recs = recommendationsFor(sim.familyHistory);

  return (
    <div>
      <AppHeader title={`Hey, ${sim.name}!`} subtitle={`Day ${sim.day} · let's check in 🌱`} />
      <DayBanner />

      <div className="space-y-3 px-4 pt-4">
        {/* Avatar stage — sunny forest clearing */}
        <section className="cute-card relative overflow-hidden p-0">
          <div
            className="relative h-60"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.88 0.07 220) 0%, oklch(0.93 0.06 200) 35%, oklch(0.92 0.10 130) 65%, oklch(0.82 0.13 125) 100%)",
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-6 flex items-end justify-between px-1 text-[34px] leading-none opacity-80" aria-hidden>
              <span>🌳</span><span className="text-[28px]">🌲</span><span className="text-[30px]">🌳</span>
              <span className="text-[26px]">🌲</span><span className="text-[32px]">🌳</span><span>🌲</span>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-[88%] -translate-x-1/2 rounded-[50%]"
              style={{ background: "radial-gradient(60% 100% at 50% 30%, oklch(0.86 0.14 130) 0%, oklch(0.72 0.13 125) 70%, transparent 100%)" }}
              aria-hidden
            />
            <span className="pointer-events-none absolute bottom-3 left-6 text-base" aria-hidden>🌼</span>
            <span className="pointer-events-none absolute bottom-2 right-8 text-base" aria-hidden>🌸</span>
            <span className="pointer-events-none absolute bottom-5 right-16 text-sm" aria-hidden>🍄</span>
            <div className="absolute right-5 top-4 h-9 w-9 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.95 0.16 90), oklch(0.85 0.18 70) 70%)" }} />

            {/* Big friendly avatar — Animal-Crossing-style villager feel */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 select-none"
              style={{ filter: "drop-shadow(0 6px 0 oklch(0.4 0.08 40 / 0.18))" }}
              aria-label={`${sim.name}'s avatar`}
            >
              <div className="relative">
                {/* soft villager-style body shadow */}
                <div
                  className="absolute -inset-3 -z-10 rounded-full"
                  style={{ background: "radial-gradient(60% 60% at 50% 60%, oklch(1 0 0 / 0.7), transparent 70%)" }}
                />
                <span className="block text-[150px] leading-none">{avatar.emoji}</span>
              </div>
            </div>

            <button
              onClick={() => setDrawerOpen((o) => !o)}
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--primary)] px-3 py-1.5 text-[11px] font-bold text-[color:var(--primary-foreground)] shadow-md"
            >
              <Wand2 size={12} /> {drawerOpen ? "Close" : "Swap"}
            </button>

            {/* Inline avatar swap drawer */}
            {drawerOpen && (
              <div className="absolute inset-x-2 bottom-2 rounded-2xl border-2 border-border bg-card/95 p-2 backdrop-blur">
                <p className="mb-1 px-1 text-[10px] font-black uppercase text-muted-foreground">
                  Choose avatar
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {AVATARS.map((a) => {
                    const on = sim.avatar === a.key;
                    return (
                      <button
                        key={a.key}
                        onClick={() => setSim({ avatar: a.key })}
                        className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl border-2 bg-secondary px-2.5 py-1.5"
                        style={{ borderColor: on ? "var(--primary)" : "var(--border)" }}
                      >
                        <span className="text-2xl">{a.emoji}</span>
                        <span className="text-[9px] font-bold">{a.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="text-base font-bold">{sim.name} the Brave</h2>
            <p className="text-[11px] font-bold text-muted-foreground">
              A curious {avatar.label.toLowerCase()} exploring the grove.
            </p>
          </div>
        </section>

        {/* Health profile + family history → recommended quests */}
        <CollapsibleSection
          title="Health profile"
          hint={sim.familyHistory.length ? `${sim.familyHistory.length} condition${sim.familyHistory.length > 1 ? "s" : ""} tracked` : "Add family history"}
          icon={<HeartPulse size={14} />}
        >
          <p className="text-[11px] font-bold uppercase text-muted-foreground">Family history</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {sim.familyHistory.length === 0 && (
              <span className="text-[11px] font-bold text-muted-foreground">None added yet.</span>
            )}
            {sim.familyHistory.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-[color:var(--accent)] px-2 py-0.5 text-[11px] font-bold">
                {c}
                <button
                  onClick={() => setSim({ familyHistory: sim.familyHistory.filter((_, j) => j !== i) })}
                  aria-label="Remove condition"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">
            <input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="e.g. High blood pressure (mom)"
              className="flex-1 rounded-xl border-2 border-border bg-secondary px-2 py-1 text-xs font-bold outline-none focus:border-[color:var(--primary)]"
            />
            <button
              onClick={() => {
                if (newCondition.trim()) {
                  setSim({ familyHistory: [...sim.familyHistory, newCondition.trim()] });
                  setNewCondition("");
                }
              }}
              className="grid h-8 w-8 place-items-center rounded-xl bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
              aria-label="Add condition"
            >
              <Plus size={14} />
            </button>
          </div>

          {recs && (
            <div className="mt-3 rounded-2xl bg-[color:var(--leaf)] p-2.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Recommended for you</p>
              <p className="text-[10px] font-bold text-muted-foreground">Based on {recs.tag}</p>
              <ul className="mt-1 space-y-1 text-[11px] font-bold">
                {recs.items.map((r, i) => (
                  <li key={i}>{r.e} {r.t}</li>
                ))}
              </ul>
              <Link to="/quests" className="mt-2 inline-block text-[10px] font-black text-[color:var(--primary-dark)]">
                See in quests →
              </Link>
            </div>
          )}

          <p className="mt-3 flex items-center gap-1 text-[11px] font-bold uppercase text-muted-foreground">
            <Pill size={11} /> Prescription reminders
          </p>
          <div className="mt-1.5 space-y-1.5">
            {sim.reminders.length === 0 && (
              <p className="text-[11px] font-bold text-muted-foreground">
                No reminders set. You can add them in onboarding.
              </p>
            )}
            {sim.reminders.map((r) => (
              <ReminderRow
                key={r.id}
                name={r.name}
                time={r.time}
                taken={r.taken}
                onToggle={() =>
                  setSim({
                    reminders: sim.reminders.map((x) =>
                      x.id === r.id ? { ...x, taken: !x.taken } : x,
                    ),
                  })
                }
              />
            ))}
          </div>
        </CollapsibleSection>

        {/* Today's stats — blank slate */}
        <CollapsibleSection
          title="Today's body stats"
          hint="Connect Fitbit or log manually"
          icon={<span>📊</span>}
        >
          <div className="grid grid-cols-3 gap-2">
            <StatTile icon={<Droplets size={18} />} value="0/8" label="Water" tint="sky" />
            <StatTile icon={<Footprints size={18} />} value="0" label="Steps" tint="leaf" />
            <StatTile icon={<Moon size={18} />} value="—" label="Sleep" tint="berry" />
          </div>
        </CollapsibleSection>

        <Link to="/quests" className="cute-button block text-center">
          See today's 3 quests
        </Link>
        <div className="h-2" />
      </div>
    </div>
  );
}

function ReminderRow({
  name, time, taken, onToggle,
}: { name: string; time: string; taken: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-xs font-bold">{name}</p>
        <p className="text-[10px] font-bold text-muted-foreground">{time}</p>
      </div>
      <button
        onClick={onToggle}
        className="rounded-full px-2.5 py-1 text-[10px] font-black"
        style={{
          background: taken ? "var(--primary)" : "var(--card)",
          color: taken ? "var(--primary-foreground)" : "var(--foreground)",
          border: "2px solid var(--border)",
        }}
      >
        {taken ? "Done ✓" : "Mark done"}
      </button>
    </div>
  );
}

function StatTile({
  icon, value, label, tint,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint: "sky" | "leaf" | "berry";
}) {
  const bg = { sky: "var(--sky)", leaf: "var(--leaf)", berry: "var(--berry)" }[tint];
  const fg = {
    sky: "var(--sky-foreground)",
    leaf: "var(--leaf-foreground)",
    berry: "var(--berry-foreground)",
  }[tint];
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl p-3"
      style={{ background: bg, color: fg }}
    >
      {icon}
      <p className="text-sm font-bold">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">{label}</p>
    </div>
  );
}
