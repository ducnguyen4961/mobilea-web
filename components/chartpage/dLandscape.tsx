'use client';

import { CSSProperties, useEffect, useState } from "react";

export default function LandscapeOnly() {

  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {

    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();

    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
    };

  }, []);

  if (!isPortrait) return null;

  return (
    <div style={styles.overlay}>

      <div style={styles.box}>

        <div style={styles.icon}>
          📱↻
        </div>

        <h2 style={styles.title}>
          Please rotate your device
        </h2>

        <p style={styles.text}>
          This page works best in landscape mode.
        </p>

      </div>

    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {

  overlay: {
    position: "fixed",

    top: 0,
    left: 0,

    width: "100vw",
    height: "100vh",

    backgroundColor: "#111",

    display: "flex",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 9999,
  },

  box: {
    textAlign: "center",
    color: "white",
    padding: 24,
  },

  icon: {
    fontSize: 64,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    opacity: 0.8,
  },
};