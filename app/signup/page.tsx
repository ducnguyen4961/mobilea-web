"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function DefaultPage() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Đang tải...</p>

  return (
    <div>
      <h1>Chào mừng</h1>

      {/* Click vào đây → redirect sang Cognito Hosted UI */}
      <button onClick={() => signIn("cognito")}>
        Đăng nhập / Đăng ký
      </button>
    </div>
  )
}