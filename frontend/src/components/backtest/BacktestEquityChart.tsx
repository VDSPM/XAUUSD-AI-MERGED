import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EquityPoint } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils/format";

export function BacktestEquityChart({ data }: { data: EquityPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A227" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis
            width={64}
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{ background: "#161A20", border: "1px solid #232932", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#A7ADB8" }}
            labelFormatter={(v: string) => formatDateTime(v)}
            formatter={(v: number) => [formatCurrency(v), "Balance"]}
          />
          <Area type="monotone" dataKey="balance" stroke="#C9A227" strokeWidth={2} fill="url(#equityFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
