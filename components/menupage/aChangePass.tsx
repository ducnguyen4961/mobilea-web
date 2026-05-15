"use client"

import { useState, CSSProperties } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePass({ isOpen, onClose }: Props) {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleClose = () => {
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setMessage(null)
    onClose()
  }

  const handleChangePassword = async () => {
    setMessage(null)

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ text: "Vui lòng điền đầy đủ thông tin", type: "error" })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Mật khẩu mới không khớp", type: "error" })
      return
    }
    if (newPassword.length < 8) {
      setMessage({ text: "Mật khẩu mới phải ít nhất 8 ký tự", type: "error" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ text: "✅ Đổi mật khẩu thành công!", type: "success" })
        setTimeout(handleClose, 2000)
      } else {
        setMessage({ text: data.error, type: "error" })
      }
    } catch {
      setMessage({ text: "Lỗi kết nối, thử lại sau", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.modalTitle}>Đổi mật khẩu</h3>

        <input
          style={styles.input}
          type="password"
          placeholder="Mật khẩu hiện tại"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {message && (
          <p style={message.type === "success" ? styles.success : styles.error}>
            {message.text}
          </p>
        )}

        <div style={styles.modalButtons}>
          <button style={styles.cancelBtn} onClick={handleClose} disabled={loading}>
            Hủy
          </button>
          <button style={styles.confirmBtn} onClick={handleChangePassword} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 360,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 600, color: "#333" },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" },
  error: { color: "#e53e3e", fontSize: 13, margin: 0 },
  success: { color: "#38a169", fontSize: 13, margin: 0 },
  modalButtons: { display: "flex", gap: 8, marginTop: 4 },
  cancelBtn: { flex: 1, padding: "10px", backgroundColor: "#f5f5f5", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  confirmBtn: { flex: 1, padding: "10px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 },
}