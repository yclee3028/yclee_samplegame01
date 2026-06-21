import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { useSim, recommendationsFor, addGems } from "@/lib/sim-store";
import { useState } from "react";
import {
  Check,
  Flame,
  Trophy,
  Phone,
  TrendingUp,
  Award,
  Pencil,
  Plus,
  X,
  Camera,
  BookOpen,
  Gem,
} from "lucide-react";


export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [
      { title: "Quests · Sprout Quest" },
      { name: "description", content: "Daily quests, long-term sagas, and your healthy-habit streaks." },
      { property: "og:title", content: "Quests" },
      { property: "og:description", content: "Daily quests, long-term sagas, and your healthy-habit streaks." },
    ],
  }),
  component: Quests,
});

type Daily = { t: string; p: number; g: number; e: string; aiHint: string; gemReward: number; awarded?: boolean };


const initialSagas = [
  { t: "Bike to the park 5 times", milestones: 5, done: 2, e: "🚲", checked: false, gemReward: 40, awarded: false },
  { t: "Brush teeth twice a day for a month", milestones: 30, done: 18, e: "🪥", checked: false, gemReward: 80, awarded: false },
  { t: "Bedtime before 10pm × 14 nights", milestones: 14, done: 6, e: "🌙", checked: false, gemReward: 60, awarded: false },
];


const achievements = [
  { e: "🌱", t: "First Sprout", d: "Planted your first seed" },
  { e: "💧", t: "Hydra's Friend", d: "7 day water streak" },
  { e: "🌙", t: "Early Bird", d: "Slept by 10pm × 5" },
  { e: "🦊", t: "Brave Heart", d: "Hit Lvl 10" },
  { e: "🌳", t: "Tree-Mendous", d: "Grew 10 plants" },
  { e: "📵", t: "Off-Grid", d: "2h focus session" },
];

// Quest booklet is built from journal "One little thought" logs now.

function Quests() {
  const sim = useSim();
  const isParent = sim.viewAs === "parent";
  const [tab, setTab] = useState<"today" | "record">("today");
  const [daily, setDaily] = useState<Daily[]>([
    { t: "Drink 8 glasses of water", p: 0, g: 8, e: "💧", aiHint: "a water bottle or glass of water", gemReward: 10 },
    { t: "Walk 5,000 steps", p: 0, g: 5000, e: "👟", aiHint: "outdoor scene, shoes, or step tracker", gemReward: 15 },
    { t: "10 minute stretch", p: 0, g: 1, e: "🧘", aiHint: "person stretching or yoga mat", gemReward: 8 },
  ]);
  const [sagas, setSagas] = useState(initialSagas);
  const [editing, setEditing] = useState(false);
  const [editingHistoric, setEditingHistoric] = useState(false);
  const [goal, setGoal] = useState("1h off-phone daily");
  const [editGoal, setEditGoal] = useState(false);
  const [photoFor, setPhotoFor] = useState<number | null>(null);
  const [phase, setPhase] = useState<"analyzing" | "uncertain" | "done" | null>(null);

  // In parent view, editing is always on for daily + historic quests.
  const isEditing = isParent || editing;
  const isEditingHistoric = isParent || editingHistoric;


  function completeDaily(idx: number) {
    setDaily((d) =>
      d.map((q, i) => {
        if (i !== idx) return q;
        if (!q.awarded && q.gemReward > 0) addGems(q.gemReward);
        return { ...q, p: q.g, awarded: true };
      }),
    );
  }

  function snapPhoto(idx: number) {
    setPhotoFor(idx);
    setPhase("analyzing");
    setTimeout(() => {
      const uncertain = Math.random() < 0.35;
      if (uncertain) {
        setPhase("uncertain");
      } else {
        completeDaily(idx);
        setPhase("done");
        setTimeout(() => { setPhotoFor(null); setPhase(null); }, 900);
      }
    }, 1400);
  }
  function confirmPhoto(yes: boolean) {
    if (photoFor === null) return;
    if (yes) completeDaily(photoFor);
    setPhase("done");
    setTimeout(() => { setPhotoFor(null); setPhase(null); }, 700);
  }


  return (
    <div>
      <AppHeader title="Quests" subtitle="Tiny wins, every day 🏅" />
      <div className="px-4 pt-3">
        <div className="cute-card flex p-1">
          {(["today", "record"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 rounded-xl py-2 text-xs font-bold uppercase tracking-wide transition-colors"
              style={{
                background: tab === t ? "var(--primary)" : "transparent",
                color: tab === t ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              {t === "today" ? "Today & long-term" : "Record"}
            </button>
          ))}
        </div>
      </div>

      {tab === "today" ? (
        <div className="space-y-3 px-4 pt-4">
          {/* off-phone streak hero */}
          <section className="cute-card overflow-hidden bg-gradient-to-r from-[color:var(--sun)] to-[color:var(--leaf)] p-4 text-[color:var(--leaf-foreground)]">
            <div className="flex items-center gap-2">
              <Phone size={16} strokeWidth={3} />
              <p className="text-xs font-bold uppercase">Off-phone streak</p>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-3xl font-black">{sim.streak} days</p>
                {editGoal ? (
                  <div className="mt-1 flex items-center gap-1">
                    <input
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full rounded-lg border-2 border-[color:var(--primary-dark)] bg-white/90 px-2 py-0.5 text-[11px] font-bold text-foreground outline-none"
                    />
                    <button
                      onClick={() => setEditGoal(false)}
                      className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-foreground"
                      aria-label="Save goal"
                    >
                      <Check size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditGoal(true)}
                    className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold opacity-80 hover:opacity-100"
                  >
                    Goal: {goal} <Pencil size={10} />
                  </button>
                )}
              </div>
              <Flame size={44} fill="currentColor" className="text-[color:var(--berry)]" />
            </div>
          </section>

          {/* Daily quests with edit */}
          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-sm font-bold uppercase text-muted-foreground">Daily quests</h3>
              {!isParent && (
                <button
                  onClick={() => setEditing((e) => !e)}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold"
                  style={{ display: "none" }}
                  aria-hidden
                >
                  {editing ? <Check size={12} /> : <Pencil size={12} />}
                  {editing ? "Done" : "Edit"}
                </button>
              )}
            </div>

            <div className="space-y-2">
              {daily.map((q, idx) => {
                const pct = Math.min(100, (q.p / q.g) * 100);
                const done = pct >= 100;
                return (
                  <div key={idx} className="cute-card flex items-center gap-3 p-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[color:var(--accent)] text-2xl">
                      {q.e}
                    </div>
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5">
                          <input
                            value={q.t}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDaily((d) =>
                                d.map((x, i) => (i === idx ? { ...x, t: v } : x))
                              );
                            }}
                            className="w-full rounded-lg border border-border bg-secondary px-2 py-1 text-sm font-bold outline-none focus:border-[color:var(--primary)]"
                          />
                          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                            Goal
                            <input
                              type="number"
                              value={q.g}
                              onChange={(e) => {
                                const v = Number(e.target.value) || 1;
                                setDaily((d) =>
                                  d.map((x, i) => (i === idx ? { ...x, g: v } : x))
                                );
                              }}
                              className="w-20 rounded-lg border border-border bg-secondary px-2 py-0.5 text-xs"
                            />
                            <span className="ml-1 inline-flex items-center gap-1">
                              <Gem size={11} className="text-[color:var(--sky)]" /> Gems
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={q.gemReward}
                              onChange={(e) => {
                                const v = Math.max(0, Number(e.target.value) || 0);
                                setDaily((d) =>
                                  d.map((x, i) => (i === idx ? { ...x, gemReward: v } : x))
                                );
                              }}
                              className="w-16 rounded-lg border border-border bg-secondary px-2 py-0.5 text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-[11px] font-bold text-muted-foreground">
                            <label>What should AI look for in the photo?</label>
                            <textarea
                              rows={2}
                              value={q.aiHint}
                              onChange={(e) => {
                                const v = e.target.value;
                                setDaily((d) =>
                                  d.map((x, i) => (i === idx ? { ...x, aiHint: v } : x))
                                );
                              }}
                              placeholder="e.g. a glass of water on a desk"
                              className="w-full rounded-lg border border-border bg-secondary px-2 py-1 text-[11px] font-bold outline-none focus:border-[color:var(--primary)]"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold">{q.t}</p>
                            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[color:var(--sky)]/30 px-1.5 py-0.5 text-[10px] font-black text-[color:var(--primary-dark)]">
                              <Gem size={10} /> +{q.gemReward}
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-[color:var(--primary)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                            {q.p} / {q.g}
                          </p>
                        </>
                      )}
                    </div>
                    {isEditing ? (
                      isParent && (
                        <button
                          onClick={() => setDaily((d) => d.filter((_, i) => i !== idx))}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground"
                          aria-label="Remove quest"
                        >
                          <X size={16} />
                        </button>
                      )
                    ) : (
                      <div className="flex shrink-0 items-center gap-1.5">
                        {!done && (
                          <button
                            onClick={() => snapPhoto(idx)}
                            className="grid h-9 w-9 place-items-center rounded-full border-2 border-[color:var(--primary-dark)] bg-[color:var(--accent)] text-[color:var(--primary-dark)] active:translate-y-0.5"
                            aria-label="Complete with a photo"
                            title="Verify with a photo"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        )}
                        <div
                          className="grid h-9 w-9 place-items-center rounded-full border-2"
                          style={{
                            background: done ? "var(--primary)" : "transparent",
                            borderColor: done ? "var(--primary-dark)" : "var(--border)",
                            color: done ? "var(--primary-foreground)" : "var(--muted-foreground)",
                          }}
                        >
                          <Check size={18} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {isParent && daily.length < 5 && (
                <button
                  onClick={() =>
                    setDaily((d) => [...d, { t: "New quest", p: 0, g: 1, e: "✨", aiHint: "", gemReward: 10 }])
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[color:var(--primary-dark)] py-3 text-xs font-bold text-[color:var(--primary-dark)]"
                >
                  <Plus size={14} /> Add a daily quest
                </button>
              )}

            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="inline-flex items-center gap-1.5 text-sm font-bold uppercase text-muted-foreground">
                <Trophy size={14} /> Historic quests
              </h3>
              {!isParent && (
                <button
                  onClick={() => setEditingHistoric((e) => !e)}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold"
                  style={{ display: "none" }}
                  aria-hidden
                >
                  {editingHistoric ? <Check size={12} /> : <Pencil size={12} />}
                  {editingHistoric ? "Done" : "Edit"}
                </button>
              )}

            </div>
            <div className="space-y-2">
              {sagas.map((s, idx) => (
                <div key={idx} className="rounded-2xl bg-secondary p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-xl">
                      {s.e}
                    </div>
                    <div className="min-w-0 flex-1">
                      {isEditingHistoric ? (
                        <div className="flex flex-col gap-1.5">
                          <input
                            value={s.t}
                            onChange={(e) => {
                              const v = e.target.value;
                              setSagas((d) =>
                                d.map((x, i) => (i === idx ? { ...x, t: v } : x)),
                              );
                            }}
                            className="w-full rounded-lg border border-border bg-card px-2 py-1 text-sm font-bold outline-none focus:border-[color:var(--primary)]"
                          />
                          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                            Milestones
                            <input
                              type="number"
                              min={1}
                              value={s.milestones}
                              onChange={(e) => {
                                const v = Math.max(1, Number(e.target.value) || 1);
                                setSagas((d) =>
                                  d.map((x, i) =>
                                    i === idx
                                      ? { ...x, milestones: v, done: Math.min(x.done, v) }
                                      : x,
                                  ),
                                );
                              }}
                              className="w-16 rounded-lg border border-border bg-card px-2 py-0.5 text-xs"
                            />
                            <span className="ml-1 inline-flex items-center gap-1">
                              <Gem size={11} className="text-[color:var(--sky)]" /> Gems
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={s.gemReward}
                              onChange={(e) => {
                                const v = Math.max(0, Number(e.target.value) || 0);
                                setSagas((d) =>
                                  d.map((x, i) => (i === idx ? { ...x, gemReward: v } : x)),
                                );
                              }}
                              className="w-16 rounded-lg border border-border bg-card px-2 py-0.5 text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold" style={{ textDecoration: s.checked ? "line-through" : "none" }}>{s.t}</p>
                            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[color:var(--sky)]/30 px-1.5 py-0.5 text-[10px] font-black text-[color:var(--primary-dark)]">
                              <Gem size={10} /> +{s.gemReward}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-muted-foreground">
                            {s.done} of {s.milestones} milestones
                          </p>
                        </>
                      )}
                    </div>
                    {!isEditingHistoric && !isParent && (

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              setSagas((d) =>
                                d.map((x, i) => {
                                  if (i !== idx) return x;
                                  const nextDone = Math.min(x.milestones, x.done + 1);
                                  const completed = nextDone >= x.milestones;
                                  if (completed && !x.awarded && x.gemReward > 0) {
                                    addGems(x.gemReward);
                                    return { ...x, done: nextDone, checked: true, awarded: true };
                                  }
                                  return { ...x, done: nextDone, checked: completed };
                                }),
                              )
                            }
                            className="grid h-7 w-7 place-items-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                            aria-label="Tally yes"
                            title="Mark a milestone done"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button
                            onClick={() =>
                              setSagas((d) =>
                                d.map((x, i) => (i === idx ? { ...x, checked: !x.checked } : x)),
                              )
                            }
                            className="grid h-7 w-7 place-items-center rounded-full border-2 border-border bg-card text-muted-foreground"
                            aria-label="Toggle off"
                            title="Toggle complete"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    )}
                    {isEditingHistoric && isParent && (
                      <button
                        onClick={() => setSagas((d) => d.filter((_, i) => i !== idx))}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-muted-foreground"
                        aria-label="Remove historic quest"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex gap-1" style={{ opacity: s.checked ? 0.4 : 1 }}>
                    {Array.from({ length: s.milestones }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full"
                        style={{ background: i < s.done ? "var(--primary)" : "var(--muted)" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {isEditingHistoric && isParent && (
                <button
                  onClick={() =>
                    setSagas((d) => [
                      ...d,
                      { t: "New long-term quest", milestones: 7, done: 0, e: "✨", checked: false, gemReward: 50, awarded: false },
                    ])
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[color:var(--primary-dark)] py-3 text-xs font-bold text-[color:var(--primary-dark)]"
                >
                  <Plus size={14} /> Add a long-term quest
                </button>

              )}
            </div>
          </section>

          {/* Recommended for you — mirrors the Home health section, no Add buttons */}
          {(() => {
            const recs = recommendationsFor(sim.familyHistory);
            if (!recs) return null;
            return (
              <section className="cute-card p-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Recommended for you</p>
                <p className="mt-0.5 text-[11px] font-bold text-muted-foreground">Based on {recs.tag}</p>
                <ul className="mt-2 space-y-1.5 text-[12px] font-bold">
                  {recs.items.map((r, i) => (
                    <li key={i} className="rounded-xl bg-secondary px-2.5 py-1.5">{r.e} {r.t}</li>
                  ))}
                </ul>
              </section>
            );
          })()}
          <div className="h-2" />
        </div>
      ) : (
        <div className="space-y-3 px-4 pt-4">
          {/* hero stats — compact */}
          <section className="grid grid-cols-4 gap-1.5">
            <BigStat icon={<Flame size={12} />} value="5d" label="Longest" tint="var(--sun)" />
            <BigStat icon={<Trophy size={12} />} value="4" label="Done" tint="var(--leaf)" />
            <BigStat icon={<Award size={12} />} value="1" label="Awards" tint="var(--berry)" />
            <BigStat icon={<TrendingUp size={12} />} value="Walk" label="Top" tint="var(--sky)" />
          </section>

          {/* Photo booklet — entries from "One little thought" in Journal */}
          <CollapsibleSection
            title="Quest booklet"
            hint={`${sim.journalLogs.length} journal entr${sim.journalLogs.length === 1 ? "y" : "ies"}`}
            icon={<BookOpen size={14} />}
            defaultOpen
          >
            {sim.journalLogs.length === 0 ? (
              <p className="rounded-2xl bg-secondary p-4 text-center text-[11px] font-bold text-muted-foreground">
                Your booklet fills up as you save thoughts in the Journal's
                "One little thought" tab.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {sim.journalLogs.map((log, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl bg-secondary">
                    <div
                      className="grid h-20 place-items-center text-3xl"
                      style={{ background: "var(--accent)" }}
                    >
                      {log.emoji}
                    </div>
                    <div className="p-2">
                      <p className="line-clamp-3 text-[11px] font-bold leading-snug">{log.text}</p>
                      <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                        Day {log.day} · {log.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection
            title="Achievements"
            hint={`${achievements.length} unlocked`}
            icon={<Award size={14} />}
          >
            <div className="grid grid-cols-3 gap-2">
              {achievements.map((a) => (
                <div
                  key={a.t}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-secondary p-3 text-center"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-card text-2xl">
                    {a.e}
                  </div>
                  <p className="text-[11px] font-bold leading-tight">{a.t}</p>
                  <p className="text-[9px] font-bold leading-tight text-muted-foreground">
                    {a.d}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
          <div className="h-2" />
        </div>
      )}

      {photoFor !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-6">
          <div className="cute-card w-full max-w-xs p-5 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[color:var(--accent)] text-4xl">
              {phase === "analyzing" ? "📸" : phase === "uncertain" ? "🤔" : "✅"}
            </div>
            <p className="mt-3 text-sm font-black">
              {phase === "analyzing" && "Analyzing your photo…"}
              {phase === "uncertain" && "Hmm, I'm not sure"}
              {phase === "done" && "Nice work — verified!"}
            </p>
            <p className="mt-1 text-[11px] font-bold text-muted-foreground">
              {phase === "analyzing" && `Looking for ${daily[photoFor]?.aiHint || daily[photoFor]?.t}…`}
              {phase === "uncertain" && `I couldn't clearly see "${daily[photoFor]?.aiHint || daily[photoFor]?.t}". Is the photo correct?`}
              {phase === "done" && "Quest marked complete."}
            </p>
            {phase === "analyzing" && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-[color:var(--primary)]" />
              </div>
            )}
            {phase === "uncertain" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => confirmPhoto(false)}
                  className="flex-1 rounded-xl border-2 border-border bg-card py-2 text-xs font-black"
                >
                  Retake
                </button>
                <button
                  onClick={() => confirmPhoto(true)}
                  className="flex-1 rounded-xl bg-[color:var(--primary)] py-2 text-xs font-black text-[color:var(--primary-foreground)]"
                >
                  Yes, it's correct
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BigStat({
  icon,
  value,
  label,
  tint,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint: string;
}) {
  return (
    <div className="cute-card p-2" style={{ background: tint }}>
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase opacity-80">
        {icon}
        {label}
      </div>
      <p className="mt-0.5 text-sm font-black">{value}</p>
    </div>
  );
}
function Legend({ c, l }: { c: string; l: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: c }} />
      {l}
    </span>
  );
}
