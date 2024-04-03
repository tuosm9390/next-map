import { authOptions } from "@/utils/authoptions";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions as unknown as NextAuthOptions);

export { authOptions, handler as GET, handler as POST };
