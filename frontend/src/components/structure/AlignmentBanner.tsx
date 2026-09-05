import type { DirectionAlignment } from "@/types";
import { alignmentStyle } from "@/utils/status";
import { Badge } from "@/components/ui/Badge";
import { Lock } from "lucide-react";

export function AlignmentBanner({ alignment }: { alignment: DirectionAlignment }) {
  const style = alignmentStyle(alignment.state);

  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${style.borderClass} ${style.bgClass}`}>
      <Lock className={`h-4 w-4 mt-0.5 shrink-0 ${style.textClass}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className={`text-sm font-semibold ${style.textClass}`}>Direction Alignment</p>
          <Badge status={style} />
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">{alignment.ruleNote}</p>
      </div>
    </div>
  );
}
