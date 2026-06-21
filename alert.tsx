import { RotateCcw } from "lucide-react";
import { resetSim } from "@/lib/sim-store";

export function ResetButton() {
  return (
    <button
      onClick={() => {
        if (confirm("Restart the Day 6 simulation? Today's check-in and journal will clear.")) {
          resetSim();
        }
      }}
      title="Reset simulation"
      className="fixed bottom-20 left-3 z-30 inline-flex items-center gap-1 rounded-full border-2 border-border bg-card/95 px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground shadow-md backdrop-blur active:translate-y-0.5"
    >
      <RotateCcw size={11} strokeWidth={3} />
      Reset sim
    </button>
  );
}
