import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Gift, Check, X, Mail, KeyRound, Heart, Flame, Gem } from "lucide-react";
import { useSim, linkParent, unlinkParent, updateRewardStatus, AVATARS } from "@/lib/sim-store";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [
      { title: "Parent portal · Sprout Quest" },
      { name: "description", content: "Sign in as a parent to approve and fund your child's habit rewards." },
    ],
  }),
  component: ParentPortal,
});

function ParentPortal() {
  const sim = useSim();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const avatar = AVATARS.find((a) => a.key === sim.avatar)?.emoji ?? "🦊";

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (code.trim().toUpperCase() !== sim.parentLinkCode) {
      return setError("That link code doesn't match your child's account.");
    }
    setError("");
    linkParent(email.trim());
  };

  const pending = sim.rewardRequests.filter((r) => r.status === "pending");
  const history = sim.rewardRequests.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-20 border-b-2 border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
            <ArrowLeft size={14} /> Back to kid view
          </Link>
          <span className="cute-pill bg-[color:var(--sky)]">
            <ShieldCheck size={11} /> Parent portal
          </span>
        </div>
        <h1 className="mt-1 text-xl font-black">
          {sim.parentLinked ? `${sim.name || "Your child"}'s rewards` : "Parent sign-in"}
        </h1>
      </header>

      <div className="space-y-4 px-4 pt-4">
        {!sim.parentLinked ? (
          <>
            <section className="cute-card bg-[color:var(--sky)]/30 p-4">
              <p className="text-[12px] font-bold text-muted-foreground">
                Sprout Quest keeps parents and kids on separate sign-ins. Ask your child to open
                <span className="font-black text-foreground"> Shop → Parent portal </span>
                to read you their <span className="font-black text-foreground">6-letter link code</span>.
                Enter it below to connect to their account.
              </p>
            </section>

            <form onSubmit={handleSignIn} className="cute-card space-y-3 p-4">
              <label className="block">
                <span className="text-[11px] font-black uppercase text-muted-foreground">Parent email</span>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm font-bold outline-none"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-[11px] font-black uppercase text-muted-foreground">Child's link code</span>
                <div className="mt-1 flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-2">
                  <KeyRound size={14} className="text-muted-foreground" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. K7P2WQ"
                    maxLength={6}
                    className="w-full bg-transparent text-sm font-black tracking-[0.3em] outline-none"
                  />
                </div>
              </label>
              {error && (
                <p className="text-[11px] font-bold text-[color:var(--berry-foreground)]">{error}</p>
              )}
              <button type="submit" className="cute-button w-full">Connect to my child</button>
              <p className="text-[10px] font-bold text-muted-foreground">
                Codes change each time your child resets the app. We never share your email with your child.
              </p>
            </form>
          </>
        ) : (
          <>
            {/* Linked summary */}
            <section className="cute-card flex items-center gap-3 p-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--leaf)] text-3xl">
                {avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black">{sim.name || "Your child"}</p>
                <p className="text-[11px] font-bold text-muted-foreground">
                  Linked to {sim.parentEmail}
                </p>
              </div>
              <button
                onClick={() => unlinkParent()}
                className="text-[10px] font-bold text-muted-foreground underline"
              >
                Sign out
              </button>
            </section>

            {/* Kid stats */}
            <section className="cute-card grid grid-cols-3 gap-2 p-3 text-center">
              <Stat icon={<Flame size={14} />} label="Streak" value={`${sim.streak}d`} tint="var(--sun)" />
              <Stat icon={<Gem size={14} />} label="Gems" value={`${sim.gems}`} tint="var(--sky)" />
              <Stat icon={<Heart size={14} fill="currentColor" />} label="Vitality" value={`${sim.vitality}/5`} tint="var(--berry)" />
            </section>

            {/* Pending requests */}
            <section className="cute-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-black"><Gift size={14} className="inline -mt-0.5" /> Reward requests</h2>
                <span className="cute-pill bg-[color:var(--sun)]">{pending.length} pending</span>
              </div>
              {pending.length === 0 ? (
                <p className="text-[12px] font-bold text-muted-foreground">
                  No requests right now. When your child earns enough habit gems and picks a reward,
                  it will show up here for you to approve and fund.
                </p>
              ) : (
                <ul className="space-y-2">
                  {pending.map((r) => (
                    <li key={r.id} className="rounded-2xl border-2 border-border bg-card p-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-2xl">
                          {r.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black">{r.name}</p>
                          <p className="text-[11px] font-bold text-muted-foreground">
                            Earned with {r.gemsSpent} gems · Reward value ${r.kidValue} + service fee = ${r.parentPrice} total
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => updateRewardStatus(r.id, "approved")}
                          className="cute-button flex-1 py-1.5 text-[11px]"
                        >
                          <Check size={12} /> Fund ${r.parentPrice}
                        </button>
                        <button
                          onClick={() => updateRewardStatus(r.id, "declined")}
                          className="cute-button flex-1 py-1.5 text-[11px]"
                          style={{ background: "var(--muted)", color: "var(--muted-foreground)", borderColor: "var(--border)", boxShadow: "none" }}
                        >
                          <X size={12} /> Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* History */}
            {history.length > 0 && (
              <section className="cute-card p-3">
                <h2 className="mb-2 text-sm font-black">History</h2>
                <ul className="space-y-1.5">
                  {history.map((r) => (
                    <li key={r.id} className="flex items-center justify-between text-[12px] font-bold">
                      <span>{r.emoji} {r.name}</span>
                      <span
                        className="cute-pill"
                        style={{
                          background:
                            r.status === "approved" || r.status === "delivered"
                              ? "var(--leaf)"
                              : "var(--muted)",
                        }}
                      >
                        {r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string; tint: string }) {
  return (
    <div className="rounded-2xl p-2" style={{ background: tint }}>
      <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase">
        {icon} {label}
      </div>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
}
