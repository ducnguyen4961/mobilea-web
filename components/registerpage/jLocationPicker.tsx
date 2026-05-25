"use client"

import { useState, useEffect, useRef, CSSProperties } from "react"
import dynamic from "next/dynamic"

// ── Types ──────────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (lat: number, lng: number) => void
}

interface Coord {
  lat: number
  lng: number
}

// ── Inner map (loaded client-only) ────────────────────────────────────────
function MapInner({ coord, onMapClick }: { coord: Coord; onMapClick: (c: Coord) => void }) {
  const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = require("react-leaflet")
  const L = require("leaflet")

  // Fix icon
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }, [])

  // ── Component con để điều khiển map bay đến vị trí mới ──
  function FlyToCoord() {
    const map = useMap()
    useEffect(() => {
      map.flyTo([coord.lat, coord.lng], 15, { duration: 1.2 }) // ← bay mượt đến vị trí, zoom 15
    }, [coord.lat, coord.lng])
    return null
  }

  function ClickHandler() {
    useMapEvents({
      click(e: any) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
      },
    })
    return null
  }

  return (
    <MapContainer
      center={[coord.lat, coord.lng]}
      zoom={13}
      style={{ width: "100%", height: "100%", borderRadius: 18 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToCoord />       {/* ← thêm vào đây */}
      <ClickHandler />
      <Marker position={[coord.lat, coord.lng]} />
    </MapContainer>
  )
}

// Dynamic import — tắt SSR vì Leaflet cần window
const DynamicMap = dynamic(() => Promise.resolve(MapInner), { ssr: false })

// ── Main Component ────────────────────────────────────────────────────────
export default function LocationPicker({ isOpen, onClose, onConfirm }: Props) {
  const DEFAULT: Coord = { lat: 35.6762, lng: 139.6503 } // Tokyo mặc định

  const [coord, setCoord] = useState<Coord>(DEFAULT)
  const [address, setAddress] = useState("")
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "success" | "denied">("idle")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")

  // Lấy vị trí hiện tại
  function handleGetLocation() {
    if (!navigator.geolocation) {
      setGpsStatus("denied")
      return
    }
    setGpsStatus("loading")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGpsStatus("success")
      },
      () => setGpsStatus("denied")
    )
  }

  // Tìm địa chỉ bằng Nominatim (OpenStreetMap geocoding — free)
  async function handleSearchAddress() {
    if (!address.trim()) return
    setSearchLoading(true)
    setSearchError("")
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { "Accept-Language": "jp,en" } }
      )
      const data = await res.json()
      if (data.length === 0) {
        setSearchError("住所が見つかりません。別のキーワードをお試しください。")
      } else {
        setCoord({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      }
    } catch {
      setSearchError("Lỗi kết nối, thử lại sau")
    } finally {
      setSearchLoading(false)
    }
  }

  function handleClose() {
    setGpsStatus("idle")
    setSearchError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Inject Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      <div style={s.overlay} onClick={handleClose}>
        <div style={s.modal} onClick={(e) => e.stopPropagation()}>

          {/* ── Header ── */}
          <div style={s.header}>
            <span style={s.title}>📍 位置を選択</span>
            <button style={s.closeBtn} onClick={handleClose}>✕</button>
          </div>

          {/* ── Map ── */}
          <div style={s.mapWrap}>
            <DynamicMap coord={coord} onMapClick={setCoord} />
            <div style={s.hint}>地図をクリックして位置を指定</div>
          </div>

          {/* ── GPS button ── */}
          <button
            style={{ ...s.gpsBtn, ...(gpsStatus === "loading" ? s.gpsBtnLoading : {}) }}
            onClick={handleGetLocation}
            disabled={gpsStatus === "loading"}
          >
            {gpsStatus === "loading" && <span style={s.spinner} />}
            {gpsStatus === "idle" && "🎯 現在位置を取得"}
            {gpsStatus === "loading" && "位置情報を取得中"}
            {gpsStatus === "success" && "✅ 位置情報を取得済み"}
            {gpsStatus === "denied" && "⚠️ 拒否されました — 下の住所を入力してください "}
          </button>

          {/* ── Address search (backup) ── */}
          <div style={s.searchRow}>
            <input
              style={s.input}
              placeholder="住所を入力（例：東京…）"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchAddress()}
            />
            <button
              style={s.searchBtn}
              onClick={handleSearchAddress}
              disabled={searchLoading}
            >
              {searchLoading ? "..." : "検索"}
            </button>
          </div>
          {searchError && <p style={s.error}>{searchError}</p>}

          {/* ── Coordinates display ── */}
          <div style={s.coordBox}>
            <div style={s.coordItem}>
              <span style={s.coordLabel}>緯度 (Lat)</span>
              <span style={s.coordValue}>{coord.lat.toFixed(6)}</span>
            </div>
            <div style={s.divider} />
            <div style={s.coordItem}>
              <span style={s.coordLabel}>経度 (Lng)</span>
              <span style={s.coordValue}>{coord.lng.toFixed(6)}</span>
            </div>
          </div>

          {/* ── Actions ── */}
          <div style={s.actions}>
            <button style={s.cancelBtn} onClick={handleClose}>キャンセル</button>
            <button style={s.confirmBtn} onClick={() => { onConfirm(coord.lat, coord.lng); handleClose() }}>
              確認
            </button>
          </div>

        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────
const s: { [k: string]: CSSProperties } = {
  overlay: {
    position: "fixed", inset: 0,
    backgroundColor: "rgba(10,20,40,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 16, zIndex: 1000,
  },
  modal: {
    width: "100%", maxWidth: 520,
    maxHeight: "92dvh", overflowY: "auto",
    backgroundColor: "#fff",
    borderRadius: 24, padding: 20,
    display: "flex", flexDirection: "column", gap: 14,
    boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  title: {
    fontSize: 18, fontWeight: 700, color: "#111",
  },
  closeBtn: {
    background: "#F1F5F9", border: "none", borderRadius: 8,
    width: 32, height: 32, cursor: "pointer",
    fontSize: 14, color: "#555",
  },
  mapWrap: {
    position: "relative",
    height: 300, borderRadius: 18,
    overflow: "hidden",
    border: "1px solid #E2E8F0",
    cursor: "crosshair",
  },
  hint: {
    position: "absolute", bottom: 10, left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0,0,0,0.55)",
    color: "#fff", fontSize: 12, borderRadius: 20,
    padding: "4px 12px", pointerEvents: "none", zIndex: 999,
    whiteSpace: "nowrap",
  },
  gpsBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    height: 44, borderRadius: 12,
    backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE",
    color: "#1D4ED8", fontWeight: 600, fontSize: 14,
    cursor: "pointer",
  },
  gpsBtnLoading: {
    opacity: 0.7, cursor: "not-allowed",
  },
  spinner: {
    width: 14, height: 14,
    border: "2px solid #93C5FD",
    borderTopColor: "#1D4ED8",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  searchRow: {
    display: "flex", gap: 8,
  },
  input: {
    flex: 1, height: 44, borderRadius: 12,
    border: "1px solid #D0D5DD",
    padding: "0 14px", fontSize: 14, outline: "none",
    color: "#111",
  },
  searchBtn: {
    height: 44, padding: "0 18px", borderRadius: 12,
    backgroundColor: "#111", color: "#fff",
    border: "none", fontSize: 14, fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#DC2626", fontSize: 13, margin: 0,
  },
  coordBox: {
    display: "flex", alignItems: "center",
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: 16, padding: "14px 20px",
  },
  coordItem: {
    flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center",
  },
  coordLabel: {
    fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8,
  },
  coordValue: {
    fontSize: 18, fontWeight: 700, color: "#0F172A", fontVariantNumeric: "tabular-nums",
  },
  divider: {
    width: 1, height: 40, backgroundColor: "#E2E8F0", margin: "0 16px",
  },
  actions: {
    display: "flex", gap: 10,
  },
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
