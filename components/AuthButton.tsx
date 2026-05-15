"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Đang tải...</p>

  if (session) {
    return (
      <div>
        <p>Xin chào, {session.user?.email}</p>
        <button onClick={() => signOut()}>Đăng xuất</button>
      </div>
    )
  }

  return (
    <button onClick={() => signIn("cognito")}>
      Đăng nhập / Đăng ký
    </button>
  )
}