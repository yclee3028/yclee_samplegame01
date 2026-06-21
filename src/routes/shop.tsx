import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Gem, Sparkles, Gift, Heart, ShieldCheck, Check, Lock, KeyRound, Plus, X, Pencil, Trash2, Info } from "lucide-react";

import { useState } from "react";
import {
  useSim,
  addSeed,
  requestReward,
  issueLinkCode,
  addWishlistItem,
  updateWishlistStatus,
  removeWishlistItem,
} from "@/lib/sim-store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Rewards · Sprout Quest" },
      { name: "description", content: "Parent-funded rewards that turn good habits into real-world treats." },
      { property: "og:title", content: "Rewards" },
      { property: "og:description", content: "Parent-funded rewards that turn good habits into real-world treats." },
    ],
  }),
  component: Shop,
});

const rarityColor: Record<string, string> = {
  Common: "var(--leaf)",
};

type Category = "Toy" | "Experience" | "Treat" | "Digital" | "Amazon" | "Disney+" | "Other";
const ALL_CATEGORIES: Category[] = ["Toy", "Experience", "Treat", "Digital", "Amazon", "Disney+", "Other"];
const EXTERNAL_CATEGORIES: Category[] = ["Amazon", "Disney+"];

type Reward = {
  e: string;
  n: string;
  desc: string;
  gemsNeeded: number;
  category: Category;
};

const initialRewards: Reward[] = [
  { e: "🦑", n: "Squishy buddy", desc: "Cute squeezy stress toy — shipped to your door.", gemsNeeded: 80, category: "Toy" },
  { e: "🎬", n: "Movie ticket", desc: "One ticket to a kid-friendly film.", gemsNeeded: 200, category: "Experience" },
  { e: "🍦", n: "Ice cream trip", desc: "A trip to a local ice cream shop.", gemsNeeded: 120, category: "Treat" },
  { e: "📚", n: "Pick-a-book", desc: "Bookstore credit — your kid chooses.", gemsNeeded: 180, category: "Treat" },
  { e: "🎮", n: "Game add-on", desc: "Digital store credit (Roblox, Nintendo, etc.).", gemsNeeded: 150, category: "Digital" },
  { e: "🎨", n: "Craft kit", desc: "A small craft kit delivered home.", gemsNeeded: 220, category: "Amazon" },
  { e: "🐭", n: "Disney+ month", desc: "One month of Disney+ streaming.", gemsNeeded: 300, category: "Disney+" },
];

const categoryEmoji: Record<Category, string> = {
  Toy: "🧸",
  Experience: "🎟️",
  Treat: "🍪",
  Digital: "🕹️",
  Amazon: "📦",
  "Disney+": "🐭",
  Other: "✨",
};

function Shop() {
  const sim = useSim();
  const isParent = sim.viewAs === "parent";
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [requested, setRequested] = useState<string[]>([]);
  const [claimedFree, setClaimedFree] = useState(false);
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [topTab, setTopTab] = useState<"shop" | "wishlist">("shop");

  // child wishlist add form
  const [wlName, setWlName] = useState("");
  const [wlEmoji, setWlEmoji] = useState("🎁");
  const [wlNote, setWlNote] = useState("");
  const [wlGems, setWlGems] = useState(100);

  const visible = filter === "All" ? rewards : rewards.filter((r) => r.category === filter);
  const ownsRainbow = sim.inventory.some((s) => s.n === "Rainbow Bloom");

  return (
    <div>
      <AppHeader title="Rewards" subtitle="Real treats for real habits 🎁" />
      <div className="space-y-4 px-4 pt-4">
        {/* Top tabs: Shop / Wishlist */}
        <div className="cute-card flex p-1">
          {(["wishlist", "shop"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTopTab(t)}
              className="flex-1 rounded-xl py-2 text-xs font-bold uppercase tracking-wide transition-colors"
              style={{
                background: topTab === t ? "var(--primary)" : "transparent",
                color: topTab === t ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              {t === "wishlist" ? "Wishlist" : "Shop"}
            </button>
          ))}
        </div>

        {topTab === "wishlist" ? (
          <WishlistView isParent={isParent} sim={sim} state={{ wlName, setWlName, wlEmoji, setWlEmoji, wlNote, setWlNote, wlGems, setWlGems }} />
        ) : (
          <>
            {/* Parent transaction-fee notice */}
            {isParent && (
              <section className="cute-card flex items-start gap-2 bg-[color:var(--sun)]/30 p-3">
                <Info size={14} className="mt-0.5 shrink-0 text-[color:var(--primary-dark)]" />
                <p className="text-[11px] font-bold text-muted-foreground">
                  Heads up: rewards from external companies (Amazon, Disney+, etc.) include a
                  <span className="font-black text-foreground"> 5% transaction fee </span>
                  added to the listed price.
                </p>
              </section>
            )}

            {/* Parent-facing pitch + portal link (kid view only) */}
            {!isParent && (
              <section className="cute-card bg-[color:var(--sky)]/30 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">👨‍👩‍👧</span>
                  <div className="flex-1">
                    <h2 className="text-sm font-black">For parents</h2>
                    <p className="text-[12px] font-bold text-muted-foreground">
                      Your healthy routines turn into real-world rewards your parent picks with you.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="cute-pill bg-white/80"><ShieldCheck size={11} /> No ads to kids</span>
                      <span className="cute-pill bg-white/80"><Heart size={11} /> Habits unlock rewards</span>
                      <span className="cute-pill bg-white/80"><Gift size={11} /> Parent-friendly</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border-2 border-dashed border-border bg-white/70 p-2.5">
                  {sim.parentLinked ? (
                    <p className="text-[11px] font-bold text-muted-foreground">
                      ✅ A parent is linked ({sim.parentEmail || "via link code"}).
                    </p>
                  ) : sim.parentLinkCodeIssued ? (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">One-time parent code</p>
                        <p className="flex items-center gap-1 text-base font-black tracking-[0.3em]">
                          <KeyRound size={12} /> {sim.parentLinkCode}
                        </p>
                      </div>
                      <button onClick={() => issueLinkCode()} className="cute-button px-3 py-2 text-[11px]">
                        New code
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">No parent linked yet</p>
                        <p className="text-[11px] font-bold text-muted-foreground">
                          Tap to create a one-time code your parent can use to join.
                        </p>
                      </div>
                      <button onClick={() => issueLinkCode()} className="cute-button px-3 py-2 text-[11px]">
                        <KeyRound size={12} /> Create code
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Kid balance */}
            <section className="cute-card flex items-center justify-between p-3">
              <div>
                <p className="text-[11px] font-bold uppercase text-muted-foreground">Your habit gems</p>
                <p className="flex items-center gap-1 text-2xl font-black">
                  <Gem size={18} className="text-[color:var(--sky)]" /> {sim.gems}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase text-muted-foreground">Streak</p>
                <p className="text-2xl font-black">{sim.streak}d 🔥</p>
              </div>
            </section>

            {/* Category filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(["All", ...ALL_CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className="cute-pill shrink-0"
                  style={{
                    background: filter === c ? "var(--primary)" : "var(--secondary)",
                    color: filter === c ? "var(--primary-foreground)" : "var(--foreground)",
                  }}
                >
                  {c === "All" ? "✨" : categoryEmoji[c]} {c}
                </button>
              ))}
            </div>

            <CollapsibleSection
              title="Reward catalog"
              hint={isParent ? "Edit, price, or add rewards" : "Kid earns it · parent funds it"}
              icon={<Gift size={14} />}
              defaultOpen
            >
              <div className="grid grid-cols-1 gap-2">
                {visible.map((r) => {
                  const unlocked = sim.gems >= r.gemsNeeded;
                  const isRequested = requested.includes(r.n);
                  const progress = Math.min(100, Math.round((sim.gems / r.gemsNeeded) * 100));
                  const isExternal = EXTERNAL_CATEGORIES.includes(r.category);
                  return (
                    <div key={r.n} className="cute-card flex gap-3 p-3" style={{ opacity: isRequested ? 0.6 : 1 }}>
                      <div
                        className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl"
                        style={{ background: "var(--secondary)" }}
                      >
                        {r.e}
                      </div>
                      <div className="min-w-0 flex-1">
                        {isParent ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                value={r.n}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setRewards((all) => all.map((x) => (x.n === r.n ? { ...x, n: v } : x)));
                                }}
                                className="w-full rounded-lg border-2 border-border bg-secondary px-2 py-1 text-sm font-bold outline-none focus:border-[color:var(--primary)]"
                              />
                              <button
                                onClick={() => setRewards((all) => all.filter((x) => x.n !== r.n))}
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground"
                                aria-label="Remove reward"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <input
                              value={r.desc}
                              onChange={(e) => {
                                const v = e.target.value;
                                setRewards((all) => all.map((x) => (x.n === r.n ? { ...x, desc: v } : x)));
                              }}
                              className="w-full rounded-lg border border-border bg-secondary px-2 py-1 text-[11px] font-bold outline-none focus:border-[color:var(--primary)]"
                            />
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-muted-foreground">
                                <Gem size={11} className="text-[color:var(--sky)]" /> Gems
                              </label>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={r.gemsNeeded}
                                onChange={(e) => {
                                  const v = Math.max(0, Number(e.target.value) || 0);
                                  setRewards((all) => all.map((x) => (x.n === r.n ? { ...x, gemsNeeded: v } : x)));
                                }}
                                className="w-20 rounded-lg border-2 border-border bg-secondary px-2 py-1 text-xs font-bold outline-none focus:border-[color:var(--primary)]"
                              />
                              <select
                                value={r.category}
                                onChange={(e) => {
                                  const v = e.target.value as Category;
                                  setRewards((all) => all.map((x) => (x.n === r.n ? { ...x, category: v } : x)));
                                }}
                                className="rounded-lg border-2 border-border bg-secondary px-2 py-1 text-xs font-bold outline-none focus:border-[color:var(--primary)]"
                              >
                                {ALL_CATEGORIES.map((c) => (
                                  <option key={c} value={c}>{categoryEmoji[c]} {c}</option>
                                ))}
                              </select>
                              {isExternal && (
                                <span className="cute-pill bg-[color:var(--sun)]/40 text-[10px]">+5% fee</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-black">{r.n}</p>
                              <span className="cute-pill bg-[color:var(--secondary)] text-[10px]">
                                {categoryEmoji[r.category]} {r.category}
                              </span>
                            </div>
                            <p className="text-[11px] font-bold text-muted-foreground">{r.desc}</p>
                            <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                              <span className="flex items-center gap-0.5"><Gem size={10} /> {r.gemsNeeded} gems to unlock</span>
                            </div>
                            {!unlocked && (
                              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-[color:var(--primary)]" style={{ width: `${progress}%` }} />
                              </div>
                            )}
                            <button
                              disabled={!unlocked || isRequested}
                              onClick={() => {
                                requestReward({
                                  name: r.n,
                                  emoji: r.e,
                                  parentPrice: r.gemsNeeded,
                                  kidValue: r.gemsNeeded,
                                  gemsSpent: r.gemsNeeded,
                                });
                                setRequested((q) => [...q, r.n]);
                              }}
                              className="cute-button mt-2 w-full py-1.5 text-[11px] disabled:opacity-60"
                              style={
                                !unlocked || isRequested
                                  ? { background: "var(--muted)", color: "var(--muted-foreground)", borderColor: "var(--border)", boxShadow: "none" }
                                  : undefined
                              }
                            >
                              {isRequested ? (<><Check size={12} /> Sent to parent</>)
                                : !unlocked ? (<><Lock size={12} /> {r.gemsNeeded - sim.gems} gems to unlock</>)
                                : sim.parentLinked ? (<>Ask parent to approve</>)
                                : (<>Send request to parent</>)}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isParent && (
                  <button
                    onClick={() =>
                      setRewards((all) => [
                        ...all,
                        { e: "✨", n: "New reward", desc: "Describe this reward.", gemsNeeded: 100, category: "Other" },
                      ])
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[color:var(--primary-dark)] py-3 text-xs font-bold text-[color:var(--primary-dark)]"
                  >
                    <Plus size={14} /> Add a reward
                  </button>
                )}
              </div>
            </CollapsibleSection>

            {/* How it works (kid view) */}
            {!isParent && (
              <CollapsibleSection title="How rewards work" hint="A win-win" icon={<Heart size={14} />}>
                <ol className="space-y-1.5 text-[12px] font-bold text-muted-foreground">
                  <li><span className="font-black text-foreground">1.</span> Build habits → earn habit gems.</li>
                  <li><span className="font-black text-foreground">2.</span> Pick a reward and send a request.</li>
                  <li><span className="font-black text-foreground">3.</span> Parent approves it in one tap.</li>
                  <li><span className="font-black text-foreground">4.</span> Reward shows up (gift card, ticket, or item).</li>
                </ol>
              </CollapsibleSection>
            )}

            {/* Free seed */}
            <section
              className="cute-card flex items-center gap-3 p-3 transition-opacity"
              style={{ opacity: claimedFree ? 0.55 : 1 }}
            >
              <div
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl"
                style={{ background: rarityColor.Common }}
              >
                ☘️
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-black">Clover Sprout</p>
                  <span className="rounded-full bg-[color:var(--leaf)] px-1.5 py-0.5 text-[9px] font-bold uppercase">
                    Free seed
                  </span>
                </div>
                <p className="text-[11px] font-bold text-muted-foreground">
                  {claimedFree ? "Claimed — added to your grove" : "A little gift for your grove — no money needed."}
                </p>
              </div>
              <button
                disabled={claimedFree}
                onClick={() => {
                  addSeed({ e: "☘️", n: "Clover Sprout", r: "Common", growth: 0 });
                  setClaimedFree(true);
                }}
                className="cute-button px-3 py-2 text-xs disabled:opacity-60"
              >
                {claimedFree ? (<><Check size={12} /> Claimed</>) : "Claim"}
              </button>
            </section>

            <section className="cute-card bg-gradient-to-br from-[color:var(--berry)] to-[color:var(--sun)] p-4">
              <span className="cute-pill bg-white/90 text-foreground">
                <Sparkles size={11} /> Optional cosmetic
              </span>
              <p className="mt-2 text-sm font-black text-white drop-shadow">🌈 Rainbow Bloom seed</p>
              <p className="text-[11px] font-black text-white/90">
                Purely cosmetic. Skipping changes nothing about your child's experience.
              </p>
              <button disabled={ownsRainbow} className="cute-button mt-2 disabled:opacity-60">
                {ownsRainbow ? "Owned ✓" : "Parent purchase · $4.99"}
              </button>
            </section>
          </>
        )}

        <div className="h-2" />
      </div>
    </div>
  );
}

type WlState = {
  wlName: string; setWlName: (v: string) => void;
  wlEmoji: string; setWlEmoji: (v: string) => void;
  wlNote: string; setWlNote: (v: string) => void;
  wlGems: number; setWlGems: (v: number) => void;
};

function WishlistView({ isParent, sim, state }: { isParent: boolean; sim: ReturnType<typeof useSim>; state: WlState }) {
  const { wlName, setWlName, wlEmoji, setWlEmoji, wlNote, setWlNote, wlGems, setWlGems } = state;
  const pending = sim.wishlist.filter((w) => w.status === "pending");
  const decided = sim.wishlist.filter((w) => w.status !== "pending");

  return (
    <div className="space-y-3">
      {!isParent && (
        <section className="cute-card p-3">
          <h2 className="text-sm font-black">Add a wish</h2>
          <p className="text-[11px] font-bold text-muted-foreground">
            Tell your parent what you'd like and how many gems you think it's worth.
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={wlEmoji}
              onChange={(e) => setWlEmoji(e.target.value.slice(0, 2) || "🎁")}
              className="w-12 rounded-xl border-2 border-border bg-secondary px-2 py-2 text-center text-lg outline-none focus:border-[color:var(--primary)]"
              aria-label="Emoji"
            />
            <input
              value={wlName}
              onChange={(e) => setWlName(e.target.value)}
              placeholder="What do you want?"
              className="flex-1 rounded-xl border-2 border-border bg-secondary px-3 py-2 text-sm font-bold outline-none focus:border-[color:var(--primary)]"
            />
          </div>
          <textarea
            value={wlNote}
            onChange={(e) => setWlNote(e.target.value)}
            rows={2}
            placeholder="Why this one? (optional)"
            className="mt-2 w-full rounded-xl border-2 border-border bg-secondary px-3 py-2 text-[12px] font-bold outline-none focus:border-[color:var(--primary)]"
          />
          <div className="mt-2 flex items-center gap-2">
            <label className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-muted-foreground">
              <Gem size={12} className="text-[color:var(--sky)]" /> Gem price
            </label>
            <input
              type="number"
              min={1}
              value={wlGems}
              onChange={(e) => setWlGems(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 rounded-lg border-2 border-border bg-secondary px-2 py-1 text-sm font-bold outline-none focus:border-[color:var(--primary)]"
            />
            <button
              onClick={() => {
                if (!wlName.trim()) return;
                addWishlistItem({ name: wlName.trim(), emoji: wlEmoji, note: wlNote.trim(), requestedGems: wlGems });
                setWlName(""); setWlNote(""); setWlGems(100); setWlEmoji("🎁");
              }}
              className="cute-button ml-auto px-3 py-2 text-[11px]"
            >
              <Plus size={12} /> Send to parent
            </button>
          </div>
        </section>
      )}

      <section className="cute-card p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-black">{isParent ? "Wishlist requests" : "Your wishlist"}</h2>
          <span className="cute-pill bg-[color:var(--sun)]">{pending.length} pending</span>
        </div>
        {pending.length === 0 ? (
          <p className="text-[12px] font-bold text-muted-foreground">
            {isParent
              ? "No wishlist requests right now. When your child adds a wish, it'll show up here."
              : "Nothing pending yet. Add a wish above!"}
          </p>
        ) : (
          <ul className="space-y-2">
            {pending.map((w) => (
              <li key={w.id} className="rounded-2xl border-2 border-border bg-card p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-2xl">{w.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black">{w.name}</p>
                    <p className="text-[11px] font-bold text-muted-foreground">
                      <Gem size={10} className="-mt-0.5 inline" /> {w.requestedGems} gems
                      {w.note ? ` · ${w.note}` : ""}
                    </p>
                  </div>
                  {!isParent && (
                    <button
                      onClick={() => removeWishlistItem(w.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground"
                      aria-label="Remove"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {isParent && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => updateWishlistStatus(w.id, "approved")}
                      className="cute-button flex-1 py-1.5 text-[11px]"
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      onClick={() => updateWishlistStatus(w.id, "declined")}
                      className="cute-button flex-1 py-1.5 text-[11px]"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)", borderColor: "var(--border)", boxShadow: "none" }}
                    >
                      <X size={12} /> Decline
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {decided.length > 0 && (
        <section className="cute-card p-3">
          <h2 className="mb-2 text-sm font-black">Decided</h2>
          <ul className="space-y-1.5">
            {decided.map((w) => (
              <li key={w.id} className="flex items-center justify-between text-[12px] font-bold">
                <span>{w.emoji} {w.name} · {w.requestedGems}💎</span>
                <span
                  className="cute-pill"
                  style={{ background: w.status === "approved" ? "var(--leaf)" : "var(--muted)" }}
                >
                  {w.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// Suppress unused warning on Pencil import in case of future use
void Pencil;
