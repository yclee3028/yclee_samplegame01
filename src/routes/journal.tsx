import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Sparkles } from "lucide-react";
import { useSim, setSim, addJournalLog, type Sliders } from "@/lib/sim-store";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal · Sprout Quest" },
      { name: "description", content: "Daily mood check-in and a gentle journal." },
      { property: "og:title", content: "Journal" },
      { property: "og:description", content: "Daily mood check-in and a gentle journal." },
    ],
  }),
  component: Journal,
});

const moods = [
  { e: "😄", l: "Great", c: "var(--leaf)" },
  { e: "🙂", l: "Good", c: "oklch(0.88 0.14 130)" },
  { e: "😐", l: "Meh", c: "var(--sun)" },
  { e: "😟", l: "Low", c: "var(--sky)" },
  { e: "😢", l: "Sad", c: "oklch(0.82 0.10 230)" },
];


const SLIDER_DEFS: { key: keyof Sliders; l: string; e: string }[] = [
  { key: "energy", l: "Energy", e: "⚡" },
  { key: "stress", l: "Stress", e: "🌊" },
  { key: "sleep", l: "Sleep quality", e: "🌙" },
  { key: "body", l: "Body", e: "💪" },
];

const week = ["S", "M", "T", "W", "T", "F", "S"];

export function Journal() {
  const sim = useSim();
  const [local, setLocal] = useState<Sliders>(
    sim.sliders ?? { energy: 50, stress: 50, sleep: 50, body: 50 },
  );
  const [note, setNote] = useState(sim.journal);
  useEffect(() => { if (sim.sliders) setLocal(sim.sliders); }, [sim.sliders]);
  useEffect(() => { setNote(sim.journal); }, [sim.journal]);

  // today is day-of-week index 5 (Friday-ish) in the demo
  const todayIdx = 5;

  return (
    <div>
      <AppHeader title="Journal" subtitle={`Day ${sim.day} check-in 🌤️`} />
      <div className="space-y-4 px-4 pt-4">
        <section className="cute-card p-4">
          <p className="text-xs font-black uppercase text-muted-foreground">How are you, really?</p>
          <div className="mt-3 flex justify-between gap-1">
            {moods.map((m) => {
              const active = sim.todayMood?.label === m.l;
              return (
                <button
                  key={m.l}
                  onClick={() => setSim({ todayMood: { emoji: m.e, label: m.l } })}
                  className="flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-2 text-[10px] font-black uppercase active:translate-y-0.5"
                  style={{
                    background: active ? m.c : "var(--secondary)",
                    borderColor: active ? "var(--primary-dark)" : "var(--border)",
                  }}
                >
                  <span className="text-2xl">{m.e}</span>
                  {m.l}
                </button>
              );
            })}
          </div>
          {!sim.todayMood && (
            <p className="mt-2 text-[11px] font-bold text-muted-foreground">
              Pick a mood to start today's entry.
            </p>
          )}
        </section>

        <CollapsibleSection
          title="Tell me more"
          hint={sim.sliders ? "Saved · tap to edit" : "Energy · Stress · Sleep · Body"}
          icon={<span>📊</span>}
          defaultOpen={!sim.sliders}
          done={!!sim.sliders}
        >

          <div className="space-y-3">
            {SLIDER_DEFS.map((s) => (
              <div key={s.key}>
                <div className="mb-1 flex items-center justify-between text-xs font-bold">
                  <span>{s.e} {s.l}</span>
                  <span className="text-muted-foreground">{local[s.key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={local[s.key]}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, [s.key]: Number(e.target.value) }))
                  }
                  className="w-full accent-[color:var(--primary)]"
                />
              </div>
            ))}
            <button
              onClick={() => setSim({ sliders: local })}
              className="cute-button w-full text-xs"
            >
              Save scales
            </button>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="One little thought"
          hint={sim.journal ? "Saved" : "Optional — write a sentence or two"}
          icon={<span>✏️</span>}
          defaultOpen={!sim.journal}
          done={!!sim.journal}
        >

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Today felt like..."
            className="h-24 w-full resize-none rounded-2xl border-2 border-border bg-secondary p-3 text-sm font-bold outline-none focus:border-[color:var(--primary)]"
          />
          <button
            onClick={() => {
              setSim({ journal: note });
              if (note.trim()) {
                const now = new Date();
                addJournalLog({
                  day: sim.day,
                  date: now.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                  mood: sim.todayMood?.label ?? "Logged",
                  emoji: sim.todayMood?.emoji ?? "📝",
                  text: note.trim(),
                });
              }
            }}
            className="cute-button mt-3 w-full"
          >
            Save today's check-in
          </button>
        </CollapsibleSection>

        <CollapsibleSection
          title="This week"
          hint={`${sim.todayMood ? 1 : 0} / 7 days logged`}
          icon={<span>📅</span>}
        >
          <div className="grid grid-cols-7 gap-1 text-center">
            {week.map((d, i) => (
              <div key={i} className="rounded-xl bg-secondary py-2">
                <div className="text-[10px] font-bold text-muted-foreground">{d}</div>
                <div className="text-xl">
                  {i === todayIdx && sim.todayMood ? sim.todayMood.emoji : "·"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-[color:var(--accent)] p-3">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-[color:var(--primary-dark)]" />
            <p className="text-[11px] font-bold text-accent-foreground">
              You're just starting out — a few days of check-ins and the grove will spot patterns. ✨
            </p>
          </div>
        </CollapsibleSection>
        <div className="h-2" />
      </div>
    </div>
  );
}
