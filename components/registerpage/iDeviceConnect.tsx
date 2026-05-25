"use client"

import { useState, CSSProperties } from "react"
import { registercallAPI} from "@/services/callAPI";

// ── Types ──────────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean
  onClose: () => void
  // ví dụ: {"H0001D010":["0000"],"H0001D006":["0000","3005"],...}
}

// ── Component ─────────────────────────────────────────────────────────────
export default function DeviceConnector({ isOpen, onClose }: Props) {
  const map = JSON.parse(localStorage.getItem("deviceId") || "{}");
  const houses = Object.keys(map)
  const [selectedHouse, setSelectedHouse] = useState(houses[0] || "")
  const [houseOpen, setHouseOpen] = useState(false)

  // connected[house] = Set của device ids đã kết nối (trừ 0000)
  const [connected, setConnected] = useState<Record<string, Set<string>>>(() => {
    const init: Record<string, Set<string>> = {}
    for (const house of houses) {
      init[house] = new Set() // ban đầu chưa kết nối cái nào
    }
    return init
  })

  if (!isOpen) return null

  const allDevices = map[selectedHouse] || []
  const center = "0000"
  const peripherals = allDevices.filter((d: string) => d !== center)
  const connectedSet = connected[selectedHouse] || new Set()

  const unconnected = peripherals.filter((d: string) => !connectedSet.has(d))
  const connectedList = peripherals.filter((d: string) => connectedSet.has(d))

  function toggle(deviceId: string) {
    setConnected((prev) => {
      const next = new Set(prev[selectedHouse])
      if (next.has(deviceId)) next.delete(deviceId)
      else next.add(deviceId)
      return { ...prev, [selectedHouse]: next }
    })
  }

  function connectAll() {
    setConnected((prev) => ({
      ...prev,
      [selectedHouse]: new Set(peripherals),
    }))
  }

  function disconnectAll() {
    setConnected((prev) => ({
      ...prev,
      [selectedHouse]: new Set(),
    }))
  }

  // Build output: { "H0001D001#3000": "H0001D001#0000", ... }
  function buildOutput(): Record<string, string> {
    const result: Record<string, string> = {}
    for (const house of houses) {
      const hub = `${house}#0000`
      for (const dev of connected[house] || new Set()) {
        result[`${house}#${dev}`] = hub
      }
    }
    return result
  }
  // Hàm gửi lên API
  async function handleConfirm() {
    const result = buildOutput()
    const formatted = Object.entries(result).map(([key, value]) => ({
      deviceId: key,
      connectedId: value,
    }))
    const response = await registercallAPI(formatted)
    if(response) {
      onClose();
      alert("デバイスの接続に成功しました！")
    }
  }

  const output = buildOutput()
  const outputStr = JSON.stringify(output, null, 2)

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div>
            <div style={s.title}>Kết nối thiết bị</div>
            <div style={s.subtitle}>Chọn thiết bị để kết nối với trung tâm</div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── House selector ── */}
        <div style={{ position: "relative" }}>
          <div style={s.selectBox} onClick={() => setHouseOpen(!houseOpen)}>
            <span> {selectedHouse}</span>
            <span style={{transform: houseOpen? "rotate(180deg)" : "rotate(0deg)",transition: "0.2s",}}>▼</span>
          </div>
          {houseOpen && (
            <div style={s.dropdown}>
              {houses.map((h) => (
                <div
                  key={h}
                  style={{ ...s.option, ...(h === selectedHouse ? s.optionActive : {}) }}
                  onClick={() => { setSelectedHouse(h); setHouseOpen(false) }}
                >
                  {h}
                  <span style={s.optionBadge}>
                    {(connected[h]?.size || 0)}/{(map[h]?.length || 1) - 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Stats bar ── */}
        <div style={s.statsBar}>
          <div style={s.statItem}>
            <span style={s.statNum}>{peripherals.length}</span>
            <span style={s.statLabel}>Tổng thiết bị</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <span style={{ ...s.statNum, color: "#16A34A" }}>{connectedList.length}</span>
            <span style={s.statLabel}>Đã kết nối</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.statItem}>
            <span style={{ ...s.statNum, color: "#DC2626" }}>{unconnected.length}</span>
            <span style={s.statLabel}>Chưa kết nối</span>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div style={s.progressWrap}>
          <div
            style={{
              ...s.progressFill,
              width: peripherals.length
                ? `${(connectedList.length / peripherals.length) * 100}%`
                : "0%",
            }}
          />
        </div>

        {/* ── Two columns ── */}
        <div style={s.columns}>

          {/* Left — chưa kết nối */}
          <div style={s.column}>
            <div style={s.colHeader}>
              <span style={s.colTitle}>⬜ Chưa kết nối</span>
              <button style={s.colAction} onClick={connectAll}>Chọn tất cả</button>
            </div>
            <div style={s.cardList}>
              {unconnected.length === 0 ? (
                <div style={s.empty}>Tất cả đã kết nối 🎉</div>
              ) : (
                unconnected.map((d: string) => (
                  <div key={d} style={s.deviceCard} onClick={() => toggle(d)}>
                    <div style={s.deviceIcon}>📡</div>
                    <div style={s.deviceId}>{d}</div>
                    <div style={s.connectArrow}>→</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Center hub indicator */}
          <div style={s.hubCol}>
            <div style={s.hubNode}>
              <div style={s.hubIcon}>🔌</div>
              <div style={s.hubLabel}>0000</div>
              <div style={s.hubSub}>Hub</div>
            </div>
            <div style={s.hubLine} />
          </div>

          {/* Right — đã kết nối */}
          <div style={s.column}>
            <div style={s.colHeader}>
              <span style={s.colTitle}>✅ Đã kết nối</span>
              <button style={{ ...s.colAction, color: "#DC2626" }} onClick={disconnectAll}>Bỏ tất cả</button>
            </div>
            <div style={s.cardList}>
              {connectedList.length === 0 ? (
                <div style={s.empty}>Chưa có thiết bị</div>
              ) : (
                connectedList.map((d: string) => (
                  <div key={d} style={{ ...s.deviceCard, ...s.deviceCardConnected }} onClick={() => toggle(d)}>
                    <div style={s.deviceIcon}>📡</div>
                    <div style={{ ...s.deviceId, color: "#16A34A" }}>{d}</div>
                    <div style={{ ...s.connectArrow, color: "#DC2626" }}>✕</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ── Output preview ── */}
        <div style={s.outputWrap}>
          <div style={s.outputHeader}>
            <span style={s.outputTitle}>Output JSON</span>
            <button
              style={s.copyBtn}
              onClick={() => navigator.clipboard.writeText(outputStr)}
            >
              Copy
            </button>
          </div>
          <pre style={s.outputPre}>
            {Object.keys(output).length === 0
              ? '{ } // Chưa có kết nối nào'
              : outputStr}
          </pre>
        </div>

        {/* ── Actions ── */}
        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>Huỷ</button>
          <button style={s.confirmBtn} onClick={handleConfirm}>
            Xác nhận ({Object.keys(output).length} kết nối)
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s: { [k: string]: CSSProperties } = {
  overlay: {
    position: "fixed", inset: 0,
    backgroundColor: "rgba(10,20,40,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 16, zIndex: 1000,
  },
  modal: {
    width: "100%", maxWidth: 640,
    maxHeight: "92dvh", overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: 24, padding: 22,
    display: "flex", flexDirection: "column", gap: 14,
    boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
  },

  // Header
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 18, fontWeight: 700, color: "#0F172A" },
  subtitle: { fontSize: 13, color: "#94A3B8", marginTop: 2 },
  closeBtn: {
    background: "#F1F5F9", border: "none", borderRadius: 8,
    width: 32, height: 32, cursor: "pointer", fontSize: 14, color: "#555",
  },

  // House selector
  selectBox: {
    height: 46, borderRadius: 14,
    backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 16px", cursor: "pointer", fontWeight: 600, fontSize: 14,
  },
  dropdown: {
    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 2000,
    marginTop: 4, borderRadius: 14,
    backgroundColor: "#fff", border: "1px solid #E2E8F0",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)", overflow: "hidden",
  },
  option: {
    padding: "12px 16px", cursor: "pointer", fontSize: 14,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderBottom: "1px solid #F1F5F9",
  },
  optionActive: { backgroundColor: "#EFF6FF", fontWeight: 600, color: "#1D4ED8" },
  optionBadge: {
    fontSize: 12, backgroundColor: "#F1F5F9", borderRadius: 20,
    padding: "2px 8px", color: "#64748B",
  },

  // Stats
  statsBar: {
    display: "flex", alignItems: "center",
    backgroundColor: "#F8FAFC", borderRadius: 14,
    border: "1px solid #E2E8F0", padding: "12px 20px",
  },
  statItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  statNum: { fontSize: 22, fontWeight: 700, color: "#0F172A" },
  statLabel: { fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 },
  statDivider: { width: 1, height: 36, backgroundColor: "#E2E8F0", margin: "0 12px" },

  // Progress
  progressWrap: {
    height: 6, borderRadius: 99, backgroundColor: "#F1F5F9", overflow: "hidden",
  },
  progressFill: {
    height: "100%", borderRadius: 99,
    backgroundColor: "#16A34A",
    transition: "width 0.4s ease",
  },

  // Columns
  columns: { display: "flex", gap: 0, alignItems: "flex-start" },
  column: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  colHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 4,
  },
  colTitle: { fontSize: 13, fontWeight: 600, color: "#475569" },
  colAction: {
    fontSize: 11, color: "#3B82F6", background: "none", border: "none",
    cursor: "pointer", fontWeight: 600, padding: 0,
  },
  cardList: { display: "flex", flexDirection: "column", gap: 6, minHeight: 80 },
  deviceCard: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 12px", borderRadius: 12,
    border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC",
    cursor: "pointer", transition: "all 0.15s",
    userSelect: "none",
  },
  deviceCardConnected: {
    backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
  },
  deviceIcon: { fontSize: 16 },
  deviceId: { flex: 1, fontSize: 13, fontWeight: 600, color: "#0F172A" },
  connectArrow: { fontSize: 14, color: "#94A3B8" },
  empty: {
    fontSize: 12, color: "#CBD5E1", textAlign: "center",
    padding: "20px 0",
  },

  // Hub center column
  hubCol: {
    width: 64, display: "flex", flexDirection: "column",
    alignItems: "center", paddingTop: 28, gap: 0,
  },
  hubNode: {
    display: "flex", flexDirection: "column", alignItems: "center",
    backgroundColor: "#0F172A", borderRadius: 16,
    padding: "10px 8px", gap: 2,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  hubIcon: { fontSize: 18 },
  hubLabel: { fontSize: 11, fontWeight: 700, color: "#fff" },
  hubSub: { fontSize: 9, color: "#94A3B8" },
  hubLine: {
    width: 2, flex: 1, minHeight: 20,
    backgroundColor: "#E2E8F0",
  },

  // Output
  outputWrap: {
    borderRadius: 14, border: "1px solid #E2E8F0",
    overflow: "hidden",
  },
  outputHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 14px", backgroundColor: "#F8FAFC",
    borderBottom: "1px solid #E2E8F0",
  },
  outputTitle: { fontSize: 12, fontWeight: 600, color: "#64748B" },
  copyBtn: {
    fontSize: 12, padding: "4px 10px", borderRadius: 6,
    backgroundColor: "#0F172A", color: "#fff",
    border: "none", cursor: "pointer", fontWeight: 600,
  },
  outputPre: {
    margin: 0, padding: "12px 14px",
    fontSize: 11, color: "#334155",
    backgroundColor: "#fff",
    overflowX: "auto", maxHeight: 120,
    fontFamily: "monospace",
  },

  // Actions
  actions: { display: "flex", gap: 10 },
  cancelBtn: {
    flex: 1, height: 46, borderRadius: 12,
    backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0",
    fontSize: 14, fontWeight: 600, color: "#475569", cursor: "pointer",
  },
  confirmBtn: {
    flex: 2, height: 46, borderRadius: 12,
    backgroundColor: "#0F172A", border: "none",
    fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
  },
}
