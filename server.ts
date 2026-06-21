import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Heart, MessageCircle, UserPlus, X, Lock } from "lucide-react";
import { useState } from "react";
import { useSim } from "@/lib/sim-store";


export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends · Sprout Quest" },
      { name: "description", content: "Cheer on your friends' health quests." },
      { property: "og:title", content: "Friends" },
      { property: "og:description", content: "Cheer on your friends' health quests." },
    ],
  }),
  component: Friends,
});

const feed = [
  { name: "Mika", avatar: "🐼", time: "12m", text: "completed their goal of journaling every morning for 7 days.", art: "📓", likes: 12 },
  { name: "Sol", avatar: "🦁", time: "1h", text: "gained a Rare Sunflower seed from the autumn drop ✨", art: "🌻", likes: 28 },
  { name: "River", avatar: "🐸", time: "3h", text: "completed their goal of drinking 8 glasses of water for 21 days.", art: "💧", likes: 41 },
  { name: "Beans", avatar: "🐰", time: "5h", text: "completed their goal of walking after school all week 🚶", art: "🥾", likes: 9 },
  { name: "Tao", avatar: "🦊", time: "1d", text: "gained an Epic Glow Mushroom seed 🍄", art: "🍄", likes: 17 },
];

function Friends() {
  const sim = useSim();
  const isParent = sim.viewAs === "parent";
  const [inviteOpen, setInviteOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  function sendInvite() {
    const u = username.trim();
    if (!u) return;
    setSent(u);
    setUsername("");
    setTimeout(() => { setSent(null); setInviteOpen(false); }, 1400);
  }

  return (
    <div>
      <AppHeader title="Friends" subtitle="Your little garden of pals 🌷" />

      <div className="space-y-3 px-4 pt-4">
        {isParent && (
          <section className="cute-card flex items-center gap-2 bg-[color:var(--sky)]/30 p-2.5">
            <Lock size={14} className="text-[color:var(--primary-dark)]" />
            <p className="text-[11px] font-bold text-muted-foreground">
              Parent view — Friends is read-only.
            </p>
          </section>
        )}

        {/* invite */}
        {!isParent && (
        <div className="cute-card p-3">

          <button
            onClick={() => setInviteOpen((o) => !o)}
            className="flex w-full items-center gap-3 text-left active:translate-y-0.5"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-dashed border-[color:var(--primary-dark)] text-[color:var(--primary-dark)]">
              <UserPlus size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">Invite a friend</p>
              <p className="text-[11px] font-bold text-muted-foreground">
                {inviteOpen ? "Enter their username below" : "Plant a seed in their grove"}
              </p>
            </div>
            {inviteOpen && <X size={16} className="text-muted-foreground" />}
          </button>

          {inviteOpen && (
            <div className="mt-3 space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Username</label>
              <div className="flex gap-1.5">
                <div className="flex flex-1 items-center rounded-xl border-2 border-border bg-secondary px-2">
                  <span className="text-xs font-bold text-muted-foreground">@</span>
                  <input
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                    placeholder="mossy.fern"
                    className="w-full bg-transparent px-1 py-1.5 text-xs font-bold outline-none"
                  />
                </div>
                <button
                  onClick={sendInvite}
                  className="rounded-xl bg-[color:var(--primary)] px-3 text-xs font-black text-[color:var(--primary-foreground)] disabled:opacity-50"
                  disabled={!username.trim()}
                >
                  Send
                </button>
              </div>
              {sent && (
                <p className="text-[11px] font-bold text-[color:var(--primary-dark)]">
                  Seed sent to @{sent} 🌱
                </p>
              )}
            </div>
          )}
        </div>
        )}


        {/* stories */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {feed.map((f) => (
            <div key={f.name} className="flex w-14 shrink-0 flex-col items-center gap-1">
              <div className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-[color:var(--primary)] bg-[color:var(--accent)] text-2xl">
                {f.avatar}
              </div>
              <span className="text-[10px] font-black">{f.name}</span>
            </div>
          ))}
        </div>

        {feed.map((post, i) => (
          <FeedCard key={i} post={post} readOnly={isParent} />
        ))}

        <div className="h-2" />
      </div>
    </div>
  );
}

function FeedCard({ post, readOnly = false }: { post: (typeof feed)[number]; readOnly?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="cute-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--accent)] text-2xl">
          {post.avatar}
        </div>
        <div className="flex-1">
          <p className="text-sm font-black">{post.name}</p>
          <p className="text-[11px] font-bold text-muted-foreground">{post.time} ago</p>
        </div>
      </div>
      <p className="px-4 pt-2 text-sm font-bold">{post.text}</p>
      <div className="mx-4 mt-2 flex items-center gap-2 rounded-xl bg-gradient-to-br from-[color:var(--sky)] to-[color:var(--leaf)] px-3 py-2">
        <span className="text-2xl">{post.art}</span>
        <span className="text-[11px] font-bold opacity-80">moment captured</span>
      </div>
      <div className="flex items-center gap-4 px-4 py-3">
        <button
          onClick={() => !readOnly && setLiked((l) => !l)}
          disabled={readOnly}
          className="flex items-center gap-1.5 text-xs font-black disabled:cursor-not-allowed disabled:opacity-70"
          style={{ color: liked ? "var(--berry-foreground)" : "var(--muted-foreground)" }}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} strokeWidth={2.5} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button
          disabled={readOnly}
          className="flex items-center gap-1.5 text-xs font-black text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70"
        >
          <MessageCircle size={16} strokeWidth={2.5} /> Cheer
        </button>
      </div>
    </article>
  );
}

