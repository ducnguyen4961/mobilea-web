// nếu chưa đăng nhập thì tự động chuyển về trang đăng nhập, các trang khác sẽ không hiển thị

export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/:path*"],
}