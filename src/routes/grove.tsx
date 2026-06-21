import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { useSim, setSim } from "@/lib/sim-store";
import { Phone, Droplets, MoonStar, Plus, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useState } from "react";
import plantMaple from "@/assets/plant-maple.png";

export const Route = createFileRoute("/grove")({
  head: () => ({
    meta: [
      { title: "My Grove · Sprout Quest" },
      { name: "description", content: "Watch your plant grow while you stay off your phone." },
      { property: "og:title", content: "My Grove" },
      { property: "og:description", content: "Watch your plant grow while you stay off your phone." },
    ],
  }),
  component: Grove,
});

const rarityColor: Record<string, string> = {
  Common: "var(--leaf)",
  Uncommon: "var(--leaf)",
  Rare: "var(--sky)",
  Epic: "var(--berry)",
  Legendary: "var(--sun)",
};

// Mood → plant-scene weather mapping
type Scene = { emoji: string; label: string; bg: string; rain?: boolean };
const MOOD_SCENE: Record<string, Scene> = {
  Great: {
    emoji: "☀️", label: "Sunny",
    bg: "radial-gradient(120% 80% at 50% 100%, oklch(0.94 0.12 130) 0%, oklch(0.95 0.10 90) 55%, oklch(0.97 0.05 80) 100%)",
  },
  Good: {
    emoji: "🌤️", label: "Mostly sunny",
    bg: "radial-gradient(120% 80% at 50% 100%, oklch(0.92 0.10 140) 0%, oklch(0.94 0.07 200) 55%, oklch(0.97 0.03 220) 100%)",
  },
  Meh: {
    emoji: "⛅", label: "Partly cloudy",
    bg: "radial-gradient(120% 80% at 50% 100%, oklch(0.90 0.06 160) 0%, oklch(0.90 0.04 220) 55%, oklch(0.93 0.02 240) 100%)",
  },
  Low: {
    emoji: "🌥️", label: "Overcast",
    bg: "radial-gradient(120% 80% at 50% 100%, oklch(0.82 0.05 220) 0%, oklch(0.78 0.04 230) 55%, oklch(0.74 0.05 240) 100%)",
  },
  Sad: {
    emoji: "🌧️", label: "Rainy",
    bg: "radial-gradient(120% 80% at 50% 100%, oklch(0.70 0.07 240) 0%, oklch(0.62 0.08 245) 55%, oklch(0.55 0.09 250) 100%)",
    rain: true,
  },
};
const DEFAULT_SCENE: Scene = {
  emoji: "❓", label: "Log mood",
  bg: "radial-gradient(120% 80% at 50% 100%, oklch(0.92 0.09 150) 0%, oklch(0.95 0.05 200) 55%, oklch(0.99 0.01 240) 100%)",
};

function Grove() {
  const sim = useSim();
  const inventory = sim.inventory;
  const idx = Math.min(Math.max(sim.activePlantIdx, 0), Math.max(0, inventory.length - 1));
  const active = inventory[idx] ?? { e: "🌱", n: "Empty", r: "Common", growth: 0 };
  const [watering, setWatering] = useState(false);
  const scene = sim.todayMood ? MOOD_SCENE[sim.todayMood.label] ?? DEFAULT_SCENE : DEFAULT_SCENE;
  const wateredThis = sim.wateredPlants.includes(active.n);
  const inProgress = active.growth < 100;

  function water() {
    if (wateredThis) return;
    setWatering(true);
    setTimeout(() => {
      setWatering(false);
      setSim({
        wateredToday: true,
        wateredPlants: [...sim.wateredPlants, active.n],
        inventory: inventory.map((p, i) =>
          i === idx ? { ...p, growth: Math.min(100, p.growth + 5) } : p,
        ),
      });
    }, 1400);
  }

  function setIdx(n: number) {
    if (inventory.length === 0) return;
    const next = (n + inventory.length) % inventory.length;
    setSim({ activePlantIdx: next });
  }

  return (
    <div>
      <AppHeader title="My Grove" subtitle="Focus mode is growing your seed 🌱" />

      <div className="space-y-3 px-4 pt-4">
        {/* Hero — active plant + mood weather + watering */}
        <section className="cute-card relative overflow-hidden p-0">
          <div className="relative h-72" style={{ background: scene.bg }}>
            <span className="absolute left-3 top-3 cute-pill bg-card/90 text-foreground shadow-sm">
              {scene.emoji} {scene.label}
            </span>
            {sim.todayMood && (
              <span className="absolute right-3 top-3 cute-pill bg-card/90 text-foreground shadow-sm">
                {sim.todayMood.emoji} {sim.todayMood.label}
              </span>
            )}

            {/* Rain overlay when Sad */}
            {scene.rain &&
              Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="pointer-events-none absolute text-base text-[color:var(--sky-foreground)]"
                  style={{
                    left: `${(i * 7) % 95}%`,
                    top: "-10%",
                    animation: `rainfall 1.6s linear ${i * 0.13}s infinite`,
                  }}
                >
                  💧
                </span>
              ))}

            {/* Plant: seed while in progress, image/emoji at full grown */}
            {!inProgress && active.n === "Maple Sapling" ? (
              <img
                src={plantMaple}
                alt={active.n}
                width={300}
                height={300}
                loading="lazy"
                className="absolute bottom-0 left-1/2 h-[240px] w-auto -translate-x-1/2 drop-shadow-xl"
                style={{ transform: `translateX(-50%) scale(${watering ? 1.04 : 1})`, transition: "transform 300ms" }}
              />
            ) : (
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[120px] leading-none drop-shadow-xl"
                style={{ transform: `translateX(-50%) scale(${watering ? 1.08 : 1})`, transition: "transform 300ms" }}
              >
                {inProgress ? "🌰" : active.e}
              </div>
            )}

            {/* Watering can + drops falling onto the plant */}
            {watering && (
              <>
                <div
                  className="pointer-events-none absolute text-5xl"
                  style={{ left: "44%", top: "18%", transform: "rotate(35deg)", animation: "tilt 1.4s ease-in-out" }}
                >
                  🪣
                </div>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="pointer-events-none absolute text-xl"
                    style={{
                      left: `${46 + i * 3}%`,
                      top: "30%",
                      animation: `drip 0.9s ease-in ${i * 0.1}s forwards`,
                    }}
                  >
                    💧
                  </span>
                ))}
                <style>{`
                  @keyframes drip { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(150px); opacity: 0; } }
                  @keyframes tilt { 0%,100% { transform: rotate(35deg); } 50% { transform: rotate(75deg); } }
                  @keyframes rainfall { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 0.8; } 100% { transform: translateY(320px); opacity: 0; } }
                `}</style>
              </>
            )}

            {/* Water button — lit per-plant */}
            <button
              onClick={water}
              disabled={wateredThis || watering}
              className="absolute bottom-6 right-4 grid h-12 w-12 place-items-center rounded-full border-2 shadow-md active:translate-y-0.5 disabled:cursor-not-allowed"
              style={{
                background: wateredThis ? "var(--muted)" : "var(--sky)",
                borderColor: wateredThis ? "var(--border)" : "var(--primary-dark)",
                color: wateredThis ? "var(--muted-foreground)" : "var(--foreground)",
                boxShadow: wateredThis ? "none" : "0 0 0 4px oklch(0.85 0.12 220 / 0.45)",
              }}
              aria-label={wateredThis ? "Already watered today" : "Water plant"}
              title={wateredThis ? "Watered ✓" : "Water plant"}
            >
              <Droplets size={20} />
            </button>
          </div>
          <div className="p-4 text-center">
            <h2 className="text-base font-bold">{active.n}</h2>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              {wateredThis
                ? "Watered — your plant is sipping happily 💧"
                : inProgress
                  ? "Still a seed — give it water to help it sprout."
                  : "Tap the water button to give your plant a drink."}
            </p>
          </div>
        </section>

        {/* Today's weather log (read-only mirror from Journal) */}
        <section className="cute-card flex items-center justify-between gap-3 p-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Today's weather log</p>
            {sim.todayMood ? (
              <p className="mt-0.5 text-sm font-black">
                {sim.todayMood.emoji} {sim.todayMood.label}
                <span className="ml-1 font-bold text-muted-foreground">· {scene.emoji} {scene.label}</span>
              </p>
            ) : (
              <p className="mt-0.5 text-xs font-bold text-muted-foreground">Not logged yet — your grove sky is foggy.</p>
            )}
          </div>
          <Link
            to="/journal"
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold"
            aria-label="Edit mood in journal"
          >
            <Pencil size={11} /> Edit in Journal
          </Link>
        </section>

        {/* Focus timer */}
        <section className="cute-card p-5">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-[color:var(--primary-dark)]" />
            <p className="text-xs font-bold uppercase text-muted-foreground">Focus mode</p>
          </div>
          <div className="mt-3">
            <p className="text-4xl font-black tabular-nums">{sim.focus.timeLeft}</p>
            <p className="text-xs font-bold text-muted-foreground">until your sapling blooms</p>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[color:var(--primary)]"
              style={{ width: `${sim.focus.progress}%` }}
            />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold italic text-muted-foreground">
            <MoonStar size={11} /> your plant only grows while your device is turned off
          </p>
        </section>

        {/* Plant details */}
        <CollapsibleSection
          title="Plant details"
          hint={`${active.growth}% grown · ${inventory.length ? idx + 1 : 0}/${inventory.length}`}
          icon={<span>🍁</span>}
          defaultOpen
        >
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setIdx(idx - 1)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary" aria-label="Previous plant">
              <ChevronLeft size={16} />
            </button>
            <div className="text-center">
              <p className="text-2xl">{inProgress ? "🌰" : active.e}</p>
              <p className="text-sm font-black" style={{ color: rarityColor[active.r] }}>{active.n}</p>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">{active.r}</p>
            </div>
            <button onClick={() => setIdx(idx + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary" aria-label="Next plant">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="mt-3">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${active.growth}%`, background: rarityColor[active.r] }} />
            </div>
            <p className="mt-1 text-right text-[11px] font-bold text-muted-foreground">{active.growth}% grown</p>
          </div>
          <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">Switch plant</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {inventory.map((it, i) => (
              <button
                key={i}
                onClick={() => setSim({ activePlantIdx: i })}
                className="grid h-11 w-11 place-items-center rounded-full border-2 text-xl"
                style={{
                  background: rarityColor[it.r],
                  borderColor: i === idx ? "var(--primary-dark)" : "var(--border)",
                  outline: i === idx ? "2px solid var(--primary)" : "none",
                  outlineOffset: 2,
                }}
                title={`${it.n} · ${it.r} · ${it.growth}%`}
              >
                {it.growth < 100 ? "🌰" : it.e}
              </button>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Your grove collection"
          hint={`${inventory.length} plant${inventory.length === 1 ? "" : "s"}`}
          icon={<span>🌳</span>}
        >
          <div className="grid grid-cols-4 gap-2">
            {inventory.map((it, i) => (
              <button
                key={i}
                onClick={() => setSim({ activePlantIdx: i })}
                className="flex flex-col items-center gap-1 rounded-xl bg-secondary p-1.5 text-center"
              >
                <div className="grid aspect-square w-full place-items-center rounded-lg text-2xl" style={{ background: rarityColor[it.r] }}>
                  {it.growth < 100 ? "🌰" : it.e}
                </div>
                <span className="line-clamp-1 text-[9px] font-bold leading-tight">{it.n}</span>
              </button>
            ))}
            {Array.from({ length: Math.max(0, 4 - (inventory.length % 4 || 4)) }).map((_, i) => (
              <Link
                key={`empty-${i}`}
                to="/shop"
                className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border bg-secondary text-2xl text-muted-foreground active:translate-y-0.5"
                aria-label="Visit shop to get more seeds"
              >
                <Plus />
              </Link>
            ))}
          </div>
        </CollapsibleSection>
        <div className="h-2" />
      </div>
    </div>
  );
}
