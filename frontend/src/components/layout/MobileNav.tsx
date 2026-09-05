import { NavLink } from "react-router-dom";
import { X, TrendingUp } from "lucide-react";
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

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-72 bg-base-900 border-r border-line flex flex-col">
        <div className="flex items-center justify-between px-4 h-16 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/30">
              <TrendingUp className="h-4 w-4 text-gold" />
            </div>
            <p className="font-display text-sm font-semibold text-ink-primary">XAUUSD AI</p>
          </div>
          <button onClick={onClose} className="text-ink-secondary hover:text-ink-primary" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
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
      </div>
    </div>
  );
}
