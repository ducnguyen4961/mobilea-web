'use client';

import { useState, CSSProperties, useEffect } from "react";

type Props = {
  label: string;
  onStatus: boolean
  onOffset: (o: number) => void;
  starttimestamp: string;
  endtimestamp: string;
  diff: number;
};

// Offset hiện tại: 0 = "now", -1 = "1 day ago", +1 = "1 day later"
export default function BottomBar({ label, onStatus, onOffset, starttimestamp, endtimestamp, diff }: Props) {
  const [offset, setOffset] = useState(0);

  // Viết hàm useEffect để xử lý việc khi thay đổi đơn vị 
  useEffect(() => {
    setOffset(0);

  },[label])

  // Map chuyển sang tiếng nhật
  const unitMap = {
    day: "日",
    week: "週",
    month: "月",
    free: "自"
  }as const;

  const unit = label as "day" | "week" | "month"| "free"; 

  // Hàm xử lý UI thời gian
  function offsetLabel() {
    if(unit !== "free") {
      if (offset === 0) return (
      <span> 
        <span style={{ fontSize: "19px", fontWeight: "bold" }}>(今{unitMap[unit]})</span>
        <span> {starttimestamp.replace("T"," ")}</span>
        <span> － </span>
        <span> {endtimestamp.replace("T"," ")}</span>
      </span>
      )
      if (offset < 0) return (
      <span>
        <span style={{ fontSize: "19px", fontWeight: "bold" }}>({Math.abs(offset)}{unitMap[unit]}前)</span>
        <span> {starttimestamp.replace("T"," ")}</span>
        <span> － </span>
        <span> {endtimestamp.replace("T"," ")}</span>
      </span>
      )
    } else {
      return (
        <span> 
          <span style={{ fontSize: "19px", fontWeight: "bold" }}>({diff}日間)</span>
          <span> {starttimestamp.replace("T"," ")}</span>
          <span> － </span>
          <span> {endtimestamp.replace("T"," ")}</span>
        </span>
      )
    }
  }

  return (
    <div style={s.bar}>
      <button style={{ ...s.arrowBtn, opacity: onStatus? 0.3 : 1 }} 
      onClick={() => {setOffset((o) => o - 1); onOffset(offset)}} disabled={onStatus}
      
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <span style={s.timeLabel}>{offsetLabel()}</span>

      <button
        style={{ ...s.arrowBtn, opacity: onStatus? 0.3 :(offset >= 0 ? 0.3 : 1)}}
        onClick={() => setOffset((o) => Math.min(o + 1, 0))}
        disabled={offset >= 0 || onStatus}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

const s: { [k: string]: CSSProperties } = {
  bar: {
    position: "fixed",
    bottom: 0,
    // Offset bằng sidebar width
    left: 61,
    right: 12,
    height: 44,
    backgroundColor: "#0F172A",
    borderTop: "1px solid #1E293B",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16,
    zIndex: 50,
  },

  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid #1E293B",
    backgroundColor: "#1E293B",
    color: "#94A3B8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  },

  timeLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
};
