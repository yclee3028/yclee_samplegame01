import { Eye } from "lucide-react";
import { useSim, toggleViewAs } from "@/lib/sim-store";

export function ViewToggle() {
  const sim = useSim();
  if (!sim.onboarded) return null;
  const isParent = sim.viewAs === "parent";
  return (
    <button
      onClick={toggleViewAs}
      title="Switch interface"
      className="fixed bottom-20 left-3 z-30 inline-flex items-center gap-1 rounded-full border-2 border-border bg-card/95 px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground shadow-md backdrop-blur active:translate-y-0.5"
    >
      <Eye size={11} strokeWidth={3} />
      You are in the {isParent ? "parent" : "child"} interface
    </button>
  );
}
