'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';

import { FaHome, FaChartLine, FaBell, FaEdit, FaBars } from "react-icons/fa";

export default function BottomNav() {
  return (
    <div style={styles.nav}>
      <Link href="/" style={styles.item}>
        <FaHome size={20} />
        <span>ホーム</span>
      </Link>

      <Link href="/select_chart" style={styles.item}>
        <FaChartLine size={20} />
        <span>グラフ</span>
      </Link>

      <Link href="/notification" style={styles.item}>
        <FaBell size={20} />
        <span>通知</span>
      </Link>

      <Link href="/register" style={styles.item}>
        <FaEdit size={20} />
        <span>登録</span>
      </Link>

      <Link href="/menu" style={styles.item}>
        <FaBars size={20} />
        <span>メニュー</span>
      </Link>
    </div>
  );
}


const styles:{
    nav: CSSProperties;
    item: CSSProperties;
} = { 
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "60px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #ddd",
    zIndex: 50,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 12,
    color: "#333",
  },
};

