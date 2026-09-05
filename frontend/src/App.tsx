import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";

import Dashboard from "@/pages/Dashboard";
import LiveAnalysis from "@/pages/LiveAnalysis";
import MarketStructure from "@/pages/MarketStructure";
import SmcAnalysis from "@/pages/SmcAnalysis";
import AiDecision from "@/pages/AiDecision";
import Backtesting from "@/pages/Backtesting";
import AnalysisHistory from "@/pages/AnalysisHistory";
import Settings from "@/pages/Settings";
import SystemStatus from "@/pages/SystemStatus";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/live-analysis" element={<LiveAnalysis />} />
        <Route path="/market-structure" element={<MarketStructure />} />
        <Route path="/smc-analysis" element={<SmcAnalysis />} />
        <Route path="/ai-decision" element={<AiDecision />} />
        <Route path="/backtesting" element={<Backtesting />} />
        <Route path="/analysis-history" element={<AnalysisHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/system-status" element={<SystemStatus />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
