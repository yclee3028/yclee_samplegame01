import { useSyncExternalStore } from "react";

export type Sliders = { energy: number; stress: number; sleep: number; body: number };
export type Mood = { emoji: string; label: string } | null;
export type Seedling = { e: string; n: string; r: string; growth: number };
export type JournalLog = { day: number; date: string; mood: string; emoji: string; text: string };

export type Avatar = { key: string; emoji: string; label: string };
export const AVATARS: Avatar[] = [
  { key: "fox", emoji: "🦊", label: "Fox" },
  { key: "bunny", emoji: "🐰", label: "Bunny" },
  { key: "panda", emoji: "🐼", label: "Panda" },
  { key: "frog", emoji: "🐸", label: "Frog" },
  { key: "cat", emoji: "🐱", label: "Cat" },
  { key: "koala", emoji: "🐨", label: "Koala" },
  { key: "bear", emoji: "🐻", label: "Bear" },
  { key: "deer", emoji: "🦌", label: "Deer" },
];

export type Reminder = { id: string; name: string; time: string; taken: boolean };

export type RewardRequest = {
  id: string;
  name: string;
  emoji: string;
  parentPrice: number;
  kidValue: number;
  gemsSpent: number;
  status: "pending" | "approved" | "declined" | "delivered";
  requestedAt: string;
};

export type WishlistItem = {
  id: string;
  name: string;
  emoji: string;
  note: string;
  requestedGems: number;
  status: "pending" | "approved" | "declined";
  createdAt: string;
};

export type Role = "parent" | "child";

export type SimState = {
  onboarded: boolean;
  role: Role;
  viewAs: Role;
  name: string;
  avatar: string; // key
  ageRange: string;
  familyHistory: string[];
  reminders: Reminder[];
  journalLogs: JournalLog[];

  // Parent linking
  parentLinkCode: string;
  parentLinkCodeIssued: boolean; // child must tap to generate before parent can use
  parentLinked: boolean;
  parentEmail: string;
  rewardRequests: RewardRequest[];
  wishlist: WishlistItem[];

  day: number;
  rank: string;
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  longestStreak: number;
  gems: number;
  vitality: number;
  todayMood: Mood;
  sliders: Sliders | null;
  journal: string;
  plant: { name: string; stage: number; stageMax: number; growth: number };
  focus: { active: boolean; timeLeft: string; progress: number };
  inventory: Seedling[];
  activePlantIdx: number;
  wateredToday: boolean;
  wateredPlants: string[];
  bedtime: string;
};


function makeLinkCode() {
  const letters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += letters[Math.floor(Math.random() * letters.length)];
  return s;
}

const INITIAL: SimState = {
  onboarded: false,
  role: "child",
  viewAs: "child",
  name: "",
  avatar: "fox",
  ageRange: "",
  familyHistory: [],
  reminders: [],
  journalLogs: [],

  parentLinkCode: "",
  parentLinkCodeIssued: false,
  parentLinked: false,
  parentEmail: "",
  rewardRequests: [],
  wishlist: [],



  day: 1,
  rank: "Tiny Sprout",
  level: 1,
  xp: 0,
  xpMax: 200,
  streak: 0,
  longestStreak: 0,
  gems: 20,
  vitality: 5,
  todayMood: null,
  sliders: null,
  journal: "",
  plant: { name: "Maple Sapling", stage: 1, stageMax: 5, growth: 0 },
  focus: { active: false, timeLeft: "00:00", progress: 0 },
  inventory: [
    { e: "🌱", n: "Maple Sapling", r: "Common", growth: 0 },
  ],
  activePlantIdx: 0,
  wateredToday: false,
  wateredPlants: [],
  bedtime: "22:00",
};

let state: SimState = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem("sq-sim");
    if (raw) state = { ...INITIAL, ...JSON.parse(raw) };
  } catch {}
  // Code is only created when the child taps "Generate" in the Shop.

}
function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem("sq-sim", JSON.stringify(state)); } catch {}
}
function emit() { listeners.forEach((l) => l()); }

export function setSim(patch: Partial<SimState>) {
  state = { ...state, ...patch };
  persist(); emit();
}
export function addSeed(seed: Seedling) {
  if (state.inventory.some((s) => s.n === seed.n)) return;
  state = { ...state, inventory: [...state.inventory, seed] };
  persist(); emit();
}
export function addJournalLog(log: JournalLog) {
  state = { ...state, journalLogs: [log, ...state.journalLogs].slice(0, 24) };
  persist(); emit();
}
export function requestReward(req: Omit<RewardRequest, "id" | "status" | "requestedAt">) {
  const entry: RewardRequest = {
    ...req,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  state = {
    ...state,
    gems: Math.max(0, state.gems - req.gemsSpent),
    rewardRequests: [entry, ...state.rewardRequests],
  };
  persist(); emit();
  return entry;
}
export function updateRewardStatus(id: string, status: RewardRequest["status"]) {
  state = {
    ...state,
    rewardRequests: state.rewardRequests.map((r) => (r.id === id ? { ...r, status } : r)),
  };
  persist(); emit();
}
export function linkParent(email: string) {
  state = { ...state, parentLinked: true, parentEmail: email };
  persist(); emit();
}
export function issueLinkCode() {
  state = { ...state, parentLinkCode: makeLinkCode(), parentLinkCodeIssued: true };
  persist(); emit();
}
export function toggleViewAs() {
  state = { ...state, viewAs: state.viewAs === "parent" ? "child" : "parent" };
  persist(); emit();
}

export function addGems(n: number) {
  state = { ...state, gems: Math.max(0, state.gems + n) };
  persist(); emit();
}
export function addWishlistItem(item: Omit<WishlistItem, "id" | "status" | "createdAt">) {
  const entry: WishlistItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  state = { ...state, wishlist: [entry, ...state.wishlist] };
  persist(); emit();
  return entry;
}
export function updateWishlistStatus(id: string, status: WishlistItem["status"]) {
  state = {
    ...state,
    wishlist: state.wishlist.map((w) => (w.id === id ? { ...w, status } : w)),
  };
  persist(); emit();
}
export function removeWishlistItem(id: string) {
  state = { ...state, wishlist: state.wishlist.filter((w) => w.id !== id) };
  persist(); emit();
}


export function unlinkParent() {
  state = { ...state, parentLinked: false, parentEmail: "" };
  persist(); emit();
}
export function resetSim() {
  state = { ...INITIAL };
  if (typeof window !== "undefined") {
    try { localStorage.removeItem("sq-sim"); } catch {}
  }
  emit();
}
export function useSim(): SimState {
  ensureLoaded();
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => INITIAL,
  );
}

export function deriveWeather(s: Sliders | null) {
  if (!s) return { emoji: "❓", label: "Unknown", temp: "—", logged: false };
  const avg = (s.energy + s.sleep + s.body) / 3;
  let emoji = "☀️", label = "Sunny";
  if (avg < 20) { emoji = "🌧️"; label = "Rainy"; }
  else if (avg < 40) { emoji = "🌥️"; label = "Cloudy"; }
  else if (avg < 60) { emoji = "⛅"; label = "Partly cloudy"; }
  else if (avg < 80) { emoji = "🌤️"; label = "Mostly sunny"; }
  const temp = `${Math.round(58 + avg * 0.32)}°`;
  return { emoji, label, temp, logged: true };
}

// Recommendations driven by family history
export type Rec = { e: string; t: string };
export function recommendationsFor(history: string[]): { tag: string; items: Rec[] } | null {
  const h = history.join(" ").toLowerCase();
  if (!h.trim()) return null;
  const items: Rec[] = [];
  let tag = "your family history";
  if (/diabet/.test(h)) {
    tag = "diabetes";
    items.push(
      { e: "🚶", t: "15-min walk after meals" },
      { e: "🥗", t: "Add a fiber-rich side at lunch" },
      { e: "🍓", t: "Pick fruit instead of candy today" },
    );
  }
  if (/alzheim|dementia/.test(h)) {
    tag = items.length ? tag + " + memory health" : "memory health";
    items.push(
      { e: "🧩", t: "10-min puzzle or memory game" },
      { e: "📚", t: "Read for 20 minutes" },
      { e: "🐟", t: "Try an omega-3 rich meal" },
    );
  }
  if (/heart|cardio|cholesterol/.test(h)) {
    tag = items.length ? tag + " + heart health" : "heart health";
    items.push(
      { e: "🚴", t: "20 minutes of cardio" },
      { e: "🧂", t: "Skip the salt shaker today" },
    );
  }
  if (/hyperten|blood pressure|bp/.test(h)) {
    tag = items.length ? tag + " + blood pressure" : "blood pressure";
    items.push(
      { e: "🧘", t: "5 minutes of slow breathing" },
      { e: "💧", t: "Drink an extra glass of water" },
    );
  }
  if (/cancer/.test(h)) {
    tag = items.length ? tag + " + cancer prevention" : "cancer prevention";
    items.push(
      { e: "🧴", t: "Sunscreen before going outside" },
      { e: "🥦", t: "Add a green veggie to dinner" },
    );
  }
  if (/asthma|lung/.test(h)) {
    tag = items.length ? tag + " + lung health" : "lung health";
    items.push(
      { e: "🌬️", t: "Practice 4-7-8 breathing" },
      { e: "🌳", t: "Get fresh air outdoors" },
    );
  }
  if (items.length === 0) {
    items.push(
      { e: "🚶", t: "Take a 15-minute walk" },
      { e: "🥗", t: "Eat one extra veggie today" },
      { e: "😴", t: "Aim for 9 hours of sleep" },
    );
  }
  return { tag, items: items.slice(0, 5) };
}
