import { CognitoIdentityProviderClient, ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server"

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "ap-northeast-1",
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: "accessToken がありません" }, { status: 401 })
  }

  const { oldPassword, newPassword } = await req.json()

  if (!oldPassword || !newPassword) {
    return NextResponse.json({ error: "情報不足" }, { status: 400 })
  }

  try {
    const command = new ChangePasswordCommand({
      AccessToken: session.accessToken, // lấy từ session
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    })

    await client.send(command)
    return NextResponse.json({ message: "パスワードの変更に成功しました" })

  } catch (error: any) {
    
    // Xử lý các lỗi phổ biến từ Cognito
    if (error.name === "NotAuthorizedException") {
      return NextResponse.json({ error: "現在のパスワードが正しくありません" }, { status: 400 })
    }
    if (error.name === "InvalidPasswordException") {
      return NextResponse.json({ error: "新しいパスワードが十分に強力ではありません" }, { status: 400 })
    }
    return NextResponse.json({ error: "エラーが発生しました" }, { status: 500 })
  }
}