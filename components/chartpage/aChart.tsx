'use client';

import { CSSProperties, useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";

// ── Config ─────────────────────────────────────────────────────────────────
const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6"];

function safeId(str: string) {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}

function shortTs(ts: string) {
  return ts.includes("T") ? ts.split("T")[1].slice(0, 8) : ts;
}

// ── Transform ──────────────────────────────────────────────────────────────
// Thêm tham số metrics vào hàm
function transformData(raw: any[], deviceSuffixes: string[], metrics: string[]): Record<string, any[]> {
  const suffixOf = (hd: string) => hd.split("#")[1] || hd

  const tsMap = new Map<string, any>()

  for (const row of raw) {
    const rawTs = row.timestamp as string
    const ts = rawTs.slice(0, 16)
    const suf = suffixOf(row.house_device)
    if (!tsMap.has(ts)) {
      tsMap.set(ts, { timestamp: shortTs(ts) })
    }
    const point = tsMap.get(ts)
    for (const metric of metrics) {
      if (point[metric] == null) point[metric] = {}
      if (row[metric] != null) {
        point[metric][suf] = row[metric] as number
      }
    }
  }

  const sorted = [...tsMap.entries()].sort(([a], [b]) => a.localeCompare(b))

  const result: Record<string, any[]> = {}
  for (const metric of metrics) {
    result[metric] = sorted.map(([_, point]) => {
      const entry: any = { timestamp: point.timestamp }
      for (const suf of deviceSuffixes) {
        entry[suf] = point[metric]?.[suf] ?? null
      }
      return entry
    })
  }

  return result
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tt.box}>
      <div style={tt.label}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={tt.row}>
          <span style={{ ...tt.dot, backgroundColor: p.color }} />
          <span style={tt.key}>#{p.dataKey}</span>
          <span style={tt.val}>
            {p.value != null ? Number(p.value).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
const tt: { [k: string]: CSSProperties } = {
  box: { backgroundColor: "#0F172A", borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", minWidth: 180 },
  label: { fontSize: 11, color: "#94A3B8", marginBottom: 8, fontWeight: 600 },
  row: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  key: { flex: 1, fontSize: 12, color: "#CBD5E1" },
  val: { fontSize: 13, fontWeight: 700, color: "#F1F5F9" },
};

// ── Stat Badge ─────────────────────────────────────────────────────────────
function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ ...sb.wrap, borderColor: color + "44", backgroundColor: color + "11" }}>
      <span style={{ ...sb.label, color }}>{label}</span>
      <span style={sb.val}>{value}</span>
    </div>
  );
}
const sb: { [k: string]: CSSProperties } = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 10px", borderRadius: 10, border: "1px solid" },
  label: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 },
  val: { fontSize: 13, fontWeight: 700, color: "#0F172A", marginTop: 1 },
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function MultiDeviceChart({ raw }: { raw: any[] }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const metrics = useMemo(() => {
  if (!raw?.length) return []
  const exclude = new Set(["house_device", "timestamp"])
  const keys = new Set<string>()
  for (const row of raw) {
    for (const k of Object.keys(row)) {
      if (!exclude.has(k)) keys.add(k)
    }
  }
  return [...keys]
}, [raw])

  const devices = useMemo(() => {
    if (!raw?.length) return [];
    return [...new Set(raw.map((r) => (r.house_device as string).split("#")[1] || r.house_device))];
  }, [raw]);

  const grouped = useMemo(() => {
  if (!raw?.length) return {}
  return transformData(raw, devices, metrics)  // ← truyền metrics vào
}, [raw, devices, metrics])

  if (!raw || raw.length === 0) return (
    <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>Không có dữ liệu</div>
  );

  return (
    <div style={s.wrapper}>
      {metrics.map((metric) => {
        const chartData = grouped[metric] || [];
        const isCollapsed = collapsed[metric];

        const allVals = chartData.flatMap((row) =>
          devices.map((d) => row[d]).filter((v) => v != null && !isNaN(v))
        );
        const minVal = allVals.length ? Math.min(...allVals) : 0;
        const maxVal = allVals.length ? Math.max(...allVals) : 0;
        const avgVal = allVals.length ? allVals.reduce((a: number, b: number) => a + b, 0) / allVals.length : 0;
        const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 2 });

        let yWidth = 36;
        if (Math.abs(maxVal) > 1000) yWidth = 44;
        if (Math.abs(maxVal) > 10000) yWidth = 58;

        return (
          <div key={metric} style={s.card}>

            {/* Header */}
            <div style={s.cardHeader}>
              <div style={s.leftHeader}>
                <span style={s.metricTitle}>{metric}</span>
                <div style={s.pills}>
                  {devices.map((dev, i) => (
                    <span key={dev} style={{ ...s.pill, backgroundColor: COLORS[i % COLORS.length] + "22", color: COLORS[i % COLORS.length], borderColor: COLORS[i % COLORS.length] + "55" }}>
                      <span style={{ ...s.pillDot, backgroundColor: COLORS[i % COLORS.length] }} />
                      #{dev}
                    </span>
                  ))}
                </div>
              </div>

              <div style={s.rightHeader}>
                <div style={s.stats}>
                  <StatBadge label="Min" value={fmt(minVal)} color="#10B981" />
                  <StatBadge label="Avg" value={fmt(avgVal)} color="#6366F1" />
                  <StatBadge label="Max" value={fmt(maxVal)} color="#EF4444" />
                </div>
                <button style={s.collapseBtn} onClick={() => setCollapsed((p) => ({ ...p, [metric]: !p[metric] }))}>
                  {isCollapsed ? "▶" : "▼"}
                </button>
              </div>
            </div>

            {/* Chart */}
            {!isCollapsed && (
              <div style={s.chartBox}>
                <ResponsiveContainer width="99%" height={300}>
                  <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>

                    <defs>
                      {devices.map((dev, i) => (
                        <linearGradient key={dev} id={`g_${safeId(metric)}_${safeId(dev)}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />

                    <XAxis
                      dataKey="timestamp"
                      tick={{ fontSize: 10, fill: "#94A3B8" }}
                      axisLine={false} tickLine={false} tickMargin={8}
                      interval={Math.max(0, Math.floor(chartData.length / 6))}
                    />

                    <YAxis
                      width={yWidth}
                      tick={{ fontSize: 10, fill: "#94A3B8" }}
                      axisLine={false} tickLine={false}
                      tickFormatter={(v) => Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                    />

                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ stroke: "#94A3B8", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />

                    <ReferenceLine y={avgVal} stroke="#94A3B8" strokeDasharray="5 3" strokeOpacity={0.4} strokeWidth={1} />

                    {devices.map((dev, i) => (
                      <Area
                        key={dev}
                        type="linear"
                        dataKey={dev}
                        stroke={COLORS[i % COLORS.length]}
                        strokeWidth={2}
                        fill={`url(#g_${safeId(metric)}_${safeId(dev)})`}
                        dot={false}
                        activeDot={{ r: 5, fill: COLORS[i % COLORS.length], stroke: "#fff", strokeWidth: 2 }}
                        connectNulls={true}
                        isAnimationActive={false}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s: { [k: string]: CSSProperties } = {
  wrapper: { padding: 12, display: "flex", flexDirection: "column", gap: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "14px 16px 10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  cardHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" },
  leftHeader: { display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  rightHeader: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  metricTitle: { fontSize: 15, fontWeight: 700, color: "#0F172A", letterSpacing: 0.2 },
  pills: { display: "flex", gap: 6, flexWrap: "wrap" },
  pill: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, border: "1px solid" },
  pillDot: { width: 6, height: 6, borderRadius: "50%" },
  stats: { display: "flex", gap: 5 },
  collapseBtn: { background: "#F1F5F9", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 11, color: "#64748B" },
  chartBox: { width: "100%", height: 300, minWidth: 300, },
};
