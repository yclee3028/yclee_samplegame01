import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Sparkles, X, Plus, Baby, UserCog, KeyRound } from "lucide-react";
import { setSim, AVATARS, type Reminder, type Role } from "@/lib/sim-store";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome · Sprout Quest" },
      { name: "description", content: "Set up your Sprout Quest profile and grow healthy habits." },
    ],
  }),
  component: Welcome,
});

const COMMON_CONDITIONS = [
  "Type 2 diabetes",
  "Heart disease",
  "High blood pressure",
  "Alzheimer's / dementia",
  "Cancer",
  "Asthma",
];

const REMINDER_OPTIONS: { name: string; time: string }[] = [
  { name: "Drink water", time: "Every 2 hours" },
  { name: "Take a stretch break", time: "Every afternoon" },
  { name: "Vitamin / supplement", time: "8:00 AM · daily" },
  { name: "Wind down for bed", time: "30 min before bedtime" },
  { name: "Quick mindful moment", time: "12:00 PM · daily" },
];

function Welcome() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | "">("");
  const [linkCode, setLinkCode] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("fox");
  const [reminders, setReminders] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [custom, setCustom] = useState("");

  // Flow:
  //  CHILD:  step 0 role -> 1 name+avatar -> 2 gentle reminder
  //  PARENT: step 0 role -> 1 gentle reminder -> 2 reminders -> 3 family history
  const isParent = role === "parent";
  const totalSteps = isParent ? 4 : 3;
  const lastStep = isParent ? 3 : 2;
  const progressIdx = step;

  function toggle(list: string[], setList: (v: string[]) => void, v: string) {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  function finish() {
    const fullReminders: Reminder[] = reminders.map((name, i) => {
      const found = REMINDER_OPTIONS.find((r) => r.name === name);
      return { id: `r${i}`, name, time: found?.time ?? "Daily", taken: false };
    });
    const finalRole: Role = role || "child";
    setSim({
      onboarded: true,
      role: finalRole,
      viewAs: finalRole,
      name: isParent ? (name.trim() || "Parent") : (name.trim() || "Friend"),
      avatar,
      familyHistory: history,
      reminders: fullReminders,
      ...(isParent && linkCode.trim()
        ? { parentLinkCode: linkCode.trim().toUpperCase(), parentLinkCodeIssued: true }
        : {}),
    });
    navigate({ to: "/" });
  }

  const canNext =
    step === 0
      ? role !== "" && (!isParent || linkCode.trim().length >= 4)
      : !isParent && step === 1
      ? name.trim().length > 0 && avatar.length > 0
      : true;

  const screen = isParent
    ? (["role", "reminder", "reminders", "history"] as const)[step]
    : (["role", "name", "reminder"] as const)[step];
  const stepLabel = `Step ${step + 1} of ${totalSteps}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 pb-6 pt-8">
        {/* Progress */}
        <div className="mb-5 flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: i <= progressIdx ? "var(--primary)" : "var(--muted)" }}
            />
          ))}
        </div>

        {screen === "role" && (
          <section className="space-y-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--primary-dark)]">
                {stepLabel}
              </p>
              <h1 className="mt-1 text-2xl font-black">Who's setting this up? 🌱</h1>
              <p className="mt-2 text-sm font-bold text-muted-foreground">
                Sprout Quest has two sides — a playful kid space and a calm parent dashboard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "child" as const, icon: <Baby size={28} />, label: "Child", hint: "I'll do the quests" },
                { key: "parent" as const, icon: <UserCog size={28} />, label: "Parent", hint: "I'll fund rewards" },
              ]).map((opt) => {
                const on = role === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setRole(opt.key)}
                    className="flex flex-col items-center gap-1 rounded-2xl border-2 bg-card p-4"
                    style={{
                      borderColor: on ? "var(--primary)" : "var(--border)",
                      background: on ? "var(--accent)" : "var(--card)",
                    }}
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary text-[color:var(--primary-dark)]">
                      {opt.icon}
                    </span>
                    <span className="text-sm font-black">{opt.label}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{opt.hint}</span>
                  </button>
                );
              })}
            </div>

            {isParent && (
              <div className="cute-card p-4">
                <label className="text-[11px] font-black uppercase text-muted-foreground">
                  Parent link code
                </label>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-border bg-secondary px-3 py-2">
                  <KeyRound size={14} className="text-muted-foreground" />
                  <input
                    value={linkCode}
                    onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                    placeholder="Ask your child for the code"
                    maxLength={8}
                    className="w-full bg-transparent text-sm font-black tracking-[0.3em] outline-none"
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-bold text-muted-foreground">
                  Your child can generate a one-time code from their Shop tab.
                </p>
              </div>
            )}
          </section>
        )}

        {screen === "name" && (
          <section className="space-y-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--primary-dark)]">
                {stepLabel}
              </p>
              <h1 className="mt-1 text-2xl font-black">Welcome to Sprout Quest 🌱</h1>
              <p className="mt-2 text-sm font-bold text-muted-foreground">
                Pick a name and a buddy. {isParent ? "This is how your child shows up in the app." : "Your avatar will live in your grove and grow with you."}
              </p>
            </div>
            <div className="cute-card p-4">
              <label className="text-[11px] font-black uppercase text-muted-foreground">
                Username
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Juniper"
                maxLength={20}
                className="mt-1.5 w-full rounded-xl border-2 border-border bg-secondary px-3 py-2 text-sm font-bold outline-none focus:border-[color:var(--primary)]"
              />
            </div>
            <div className="cute-card p-4">
              <p className="text-[11px] font-black uppercase text-muted-foreground">
                Choose your avatar
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {AVATARS.map((a) => {
                  const on = avatar === a.key;
                  return (
                    <button
                      key={a.key}
                      onClick={() => setAvatar(a.key)}
                      className="flex flex-col items-center gap-1 rounded-2xl border-2 bg-secondary p-2"
                      style={{
                        borderColor: on ? "var(--primary)" : "var(--border)",
                        background: on ? "var(--accent)" : "var(--secondary)",
                      }}
                    >
                      <span className="text-3xl">{a.emoji}</span>
                      <span className="text-[10px] font-bold">{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {screen === "reminder" && (
          <section className="space-y-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--primary-dark)]">
                {stepLabel}
              </p>
              <h1 className="mt-1 text-2xl font-black">A gentle reminder 💚</h1>
            </div>
            <div className="cute-card space-y-3 p-4 text-sm font-bold leading-relaxed">
              <p>
                Sprout Quest is here to help build healthy habits — not to make
                anyone feel behind.
              </p>
              <p className="flex items-start gap-2">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-[color:var(--primary-dark)]" />
                <span>
                  Try setting <span className="text-[color:var(--primary-dark)]">SMART goals</span>:
                  small, measurable, and kind. Tiny consistent wins grow real change.
                </span>
              </p>
              <p className="text-muted-foreground">
                Every check-in helps the grove grow a little. 🌱
              </p>
            </div>
          </section>
        )}

        {screen === "reminders" && (
          <section className="space-y-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--primary-dark)]">
                {stepLabel}
              </p>
              <h1 className="mt-1 text-2xl font-black">Which reminders help?</h1>
              <p className="mt-2 text-sm font-bold text-muted-foreground">
                Pick as many as feel useful. You can change these later.
              </p>
            </div>
            <div className="space-y-2">
              {REMINDER_OPTIONS.map((r) => {
                const on = reminders.includes(r.name);
                return (
                  <button
                    key={r.name}
                    onClick={() => toggle(reminders, setReminders, r.name)}
                    className="flex w-full items-center justify-between rounded-2xl border-2 bg-card px-3 py-2.5 text-left"
                    style={{ borderColor: on ? "var(--primary)" : "var(--border)" }}
                  >
                    <div>
                      <p className="text-sm font-bold">{r.name}</p>
                      <p className="text-[11px] font-bold text-muted-foreground">{r.time}</p>
                    </div>
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full border-2"
                      style={{
                        background: on ? "var(--primary)" : "transparent",
                        color: on ? "var(--primary-foreground)" : "var(--muted-foreground)",
                        borderColor: on ? "var(--primary-dark)" : "var(--border)",
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {screen === "history" && (
          <section className="space-y-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--primary-dark)]">
                {stepLabel}
              </p>
              <h1 className="mt-1 text-2xl font-black">Family health history</h1>
              <p className="mt-2 text-sm font-bold text-muted-foreground">
                Optional — helps us suggest quests that protect what runs in your family.
              </p>
            </div>
            <div className="cute-card space-y-2 p-3">
              {COMMON_CONDITIONS.map((c) => {
                const on = history.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(history, setHistory, c)}
                    className="flex w-full items-center justify-between rounded-xl border-2 bg-secondary px-3 py-2 text-left text-sm font-bold"
                    style={{ borderColor: on ? "var(--primary)" : "var(--border)" }}
                  >
                    {c}
                    {on && <Check size={14} className="text-[color:var(--primary-dark)]" />}
                  </button>
                );
              })}

              <div className="flex gap-1.5 pt-1">
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Add another (optional)"
                  className="flex-1 rounded-xl border-2 border-border bg-card px-3 py-2 text-xs font-bold outline-none focus:border-[color:var(--primary)]"
                />
                <button
                  onClick={() => {
                    if (custom.trim()) {
                      setHistory([...history, custom.trim()]);
                      setCustom("");
                    }
                  }}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                  aria-label="Add"
                >
                  <Plus size={14} />
                </button>
              </div>

              {history.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {history.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-[color:var(--accent)] px-2 py-0.5 text-[11px] font-bold"
                    >
                      {c}
                      <button
                        onClick={() => setHistory(history.filter((_, j) => j !== i))}
                        aria-label="Remove"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <div className="mt-6 flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-2xl border-2 border-border bg-card py-3 text-sm font-black"
            >
              Back
            </button>
          )}
          {step < lastStep ? (
            <button
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="flex flex-[2] items-center justify-center gap-1 rounded-2xl bg-[color:var(--primary)] py-3 text-sm font-black text-[color:var(--primary-foreground)] disabled:opacity-50"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex flex-[2] items-center justify-center gap-1 rounded-2xl bg-[color:var(--primary)] py-3 text-sm font-black text-[color:var(--primary-foreground)]"
            >
              {isParent ? "Enter parent dashboard" : "Plant my grove 🌱"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
