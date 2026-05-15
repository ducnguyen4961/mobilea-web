'use client';
import { useState, CSSProperties } from "react"
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import ChangePass from "@/components/menupage/aChangePass";
import useOrientation from "@/hook/useOrientation";

export default function MenuPage() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const {isLandscape, isPortrait} = useOrientation();
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={{...styles.card, marginBottom: isLandscape? 20:0}}>
        <div style={styles.title}>
          <h3 style={styles.name}>
            Welcome {session?.user?.name}様
          </h3>

          <div style={styles.sub}>
            {session?.user?.email}
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.changePassword}
            onClick={() => setShowModal(true)}
          >
            パスワードを変更する
          </button>

          <button
            style={styles.signout}
            onClick={() => {signOut({ redirect: false }); router.push("/signup");}}
          >
            ログアウト
          </button>
        </div>
      </div>

      <ChangePass
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

const styles: {
  container: CSSProperties
  card: CSSProperties
  title: CSSProperties
  name: CSSProperties
  sub: CSSProperties
  buttonGroup: CSSProperties
  signout: CSSProperties
  changePassword: CSSProperties
} = {
  container: {
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },

  title: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    textAlign: "center",
  },

  name: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#222",
  },

  sub: {
    fontSize: 14,
    color: "#777",
    wordBreak: "break-word",
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  changePassword: {
    height: 54,
    border: "none",
    borderRadius: 14,
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },

  signout: {
    height: 54,
    border: "1px solid #d0d5dd",
    borderRadius: 14,
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
}