export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/users/mypage",
    "/stores/:id/new",
    "/stores/:id/edit",
    "/users/likes",
  ],
};
