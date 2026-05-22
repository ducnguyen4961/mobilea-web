'use client';

import { CSSProperties, useState} from "react";

type Props = {
  active: string;
  onBack: () => void;
  onPeriod: (p: string) => void;
  onOpenModal: () => void;
};

const PERIODS = [
  { key: "day",   label: "日" },
  { key: "week",  label: "週" },
  { key: "month", label: "月" },
  { key: "free", label: "自" },
];


export default function Sidebar({ active, onBack, onPeriod, onOpenModal}: Props) {
    return (
    <div style={s.sidebar}>

      {/* Top group — back + change */}
      <div style={s.group}>
        <button style={s.iconBtn} onClick={onBack} title="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        {/* nút bấm thay đổi thiết bị, mở modal */}
        <button style={s.iconBtn} onClick={onOpenModal} title="Change device">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={s.divider} />

      {/* nút bấm chọn đơn vị thời gian ngày/tuần/tháng */}
      <div style={s.group}>
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            disabled={key === "free"}
            style={{
              ...s.periodBtn,
              backgroundColor: active === key ? "#6366F1" : "transparent",
              color: active === key ? "#fff" : "#64748B",
              boxShadow: active === key ? "0 0 12px #6366F166" : "none",
            }}
            onClick={() => {onPeriod(key)}}
            title={key}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const s: { [k: string]: CSSProperties } = {
  sidebar: {
    width: 48,
    flexShrink: 0,
    height: "100vh",
    backgroundColor: "#0F172A",
    borderRight: "1px solid #1E293B",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    gap: 6,
    zIndex: 10,
  },

  group: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    width: "100%",
    paddingLeft: 6,
    paddingRight: 6,
  },

  divider: {
    width: 28,
    height: 1,
    backgroundColor: "#1E293B",
    margin: "6px 0",
  },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "none",
    backgroundColor: "transparent",
    color: "#64748B",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.1s, color 0.1s",
  },

  periodBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.1s",
    letterSpacing: 0.5,
  },
};
