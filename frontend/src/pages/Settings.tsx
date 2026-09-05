import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/States";
import { useSettings } from "@/hooks/useSettings";
import type { AppSettings } from "@/types";
import { Save, Check } from "lucide-react";

export default function Settings() {
  const { data, loading, saving, saveSettings } = useSettings();
  const [draft, setDraft] = useState<AppSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  if (loading || !draft) {
    return (
      <PageContainer title="Settings" subtitle="Risk, analysis, and notification preferences">
        <Card>
          <CardSkeleton lines={8} />
        </Card>
      </PageContainer>
    );
  }

  const update = <K extends keyof AppSettings>(section: K, patch: Partial<AppSettings[K]>) => {
    setDraft((prev) => (prev ? { ...prev, [section]: { ...prev[section], ...patch } } : prev));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!draft) return;
    await saveSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageContainer
      title="Settings"
      subtitle="Risk, analysis, and notification preferences"
      action={
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gold/15 border border-gold/40 text-gold-bright font-medium text-sm px-4 py-2 hover:bg-gold/20 disabled:opacity-50 transition-colors"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
        </button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Risk Settings" eyebrow="Account">
          <div className="space-y-4">
            <NumberField
              label="Account Balance (USD)"
              value={draft.risk.accountBalance}
              onChange={(v) => update("risk", { accountBalance: v })}
              min={0}
            />
            <NumberField
              label="Risk Per Trade (%)"
              value={draft.risk.riskPerTradePct}
              onChange={(v) => update("risk", { riskPerTradePct: v })}
              min={0.1}
              step={0.1}
            />
            <NumberField
              label="Daily Risk Limit (%)"
              value={draft.risk.dailyRiskLimitPct}
              onChange={(v) => update("risk", { dailyRiskLimitPct: v })}
              min={0.1}
              step={0.1}
            />
            <NumberField
              label="Daily Trade Limit"
              value={draft.risk.dailyTradeLimit}
              onChange={(v) => update("risk", { dailyTradeLimit: v })}
              min={1}
            />
          </div>
        </Card>

        <Card title="Analysis Settings" eyebrow="Behavior">
          <div className="space-y-4">
            <ToggleField
              label="Auto-refresh analysis"
              checked={draft.analysis.autoRefreshEnabled}
              onChange={(v) => update("analysis", { autoRefreshEnabled: v })}
            />
            <NumberField
              label="Auto-refresh Interval (sec)"
              value={draft.analysis.autoRefreshIntervalSec}
              onChange={(v) => update("analysis", { autoRefreshIntervalSec: v })}
              min={5}
              disabled={!draft.analysis.autoRefreshEnabled}
            />
            <NumberField
              label="Minimum Confidence to Display"
              value={draft.analysis.minConfidenceToDisplay}
              onChange={(v) => update("analysis", { minConfidenceToDisplay: v })}
              min={0}
              max={100}
            />
            <ToggleField
              label="Require golden zone fill before signal"
              checked={draft.analysis.requireGoldenZoneFill}
              onChange={(v) => update("analysis", { requireGoldenZoneFill: v })}
            />
          </div>
        </Card>

        <Card title="Notifications" eyebrow="Alerts">
          <div className="space-y-4">
            <ToggleField
              label="Notify on BUY / SELL"
              checked={draft.notifications.notifyOnBuySell}
              onChange={(v) => update("notifications", { notifyOnBuySell: v })}
            />
            <ToggleField
              label="Notify on WAIT"
              checked={draft.notifications.notifyOnWait}
              onChange={(v) => update("notifications", { notifyOnWait: v })}
            />
            <ToggleField
              label="Notify on risk breach"
              checked={draft.notifications.notifyOnRiskBreach}
              onChange={(v) => update("notifications", { notifyOnRiskBreach: v })}
            />
          </div>
        </Card>
      </div>

      <p className="text-[11px] text-ink-muted mt-4">
        These settings are stored client-side for this preview. The backend will later persist them per user account.
      </p>
    </PageContainer>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input-field disabled:opacity-40"
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-sm text-ink-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors ${
          checked ? "bg-gold/25 border-gold/50" : "bg-base-700 border-line"
        }`}
      >
        <span
          className={`absolute top-0.5 rounded-full bg-ink-primary transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
          style={{ height: "18px", width: "18px" }}
        />
      </button>
    </label>
  );
}
