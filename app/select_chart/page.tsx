'use client';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';

import useOrientation from '@/hook/useOrientation';

export default function SelectChart() {
  const router = useRouter();
  const {isLandscape, isPortrait} = useOrientation();

  return (
    <div style={styles.container}>
      <div style={{...styles.card, marginBottom: isLandscape? 30:0}}>

        <button
          style={styles.button}
          onClick={() => router.push("/graph")}
        >
          Chart
        </button>

        <button
          style={styles.button}
          onClick={() => router.push("/radarchart")}
        >
          Radar Chart
        </button>

      </div>
    </div>
  );
}


const styles: {
  container: CSSProperties;
  card: CSSProperties;
  button: CSSProperties;
} = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#F3F6FB", // pastel xám xanh nhẹ
    padding: 20,
  },

  card: {
    width: "60%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    minHeight: "calc(100vdh -80px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // shadow nhẹ, hiện đại
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "center",
  },

  button: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    backgroundColor: "#4A90E2", // xanh pastel
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
};
