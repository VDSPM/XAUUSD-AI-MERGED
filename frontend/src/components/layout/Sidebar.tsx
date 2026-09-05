import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  GitBranch,
  Layers,
  BrainCircuit,
  History,
  FlaskConical,
  Settings as SettingsIcon,
  HeartPulse,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live-analysis", label: "Live Analysis", icon: Activity },
  { to: "/market-structure", label: "Market Structure", icon: GitBranch },
  { to: "/smc-analysis", label: "SMC Analysis", icon: Layers },
  { to: "/ai-decision", label: "AI Decision", icon: BrainCircuit },
  { to: "/backtesting", label: "Backtesting", icon: FlaskConical },
  { to: "/analysis-history", label: "Analysis History", icon: History },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/system-status", label: "System Status", icon: HeartPulse },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 shrink-0 flex-col border-r border-line bg-base-900">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-line">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/30">
          <TrendingUp className="h-4 w-4 text-gold" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ink-primary leading-tight">XAUUSD AI</p>
          <p className="text-[10px] uppercase tracking-wider text-ink-muted leading-tight">Analysis Terminal</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-gold/10 text-gold-bright border border-gold/20"
                  : "text-ink-secondary border border-transparent hover:bg-base-800 hover:text-ink-primary"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-line">
        <p className="text-[10px] text-ink-muted leading-relaxed">
          Analysis only. Not financial advice. Live execution is disabled in this version.
        </p>
      </div>
    </aside>
  );
}
