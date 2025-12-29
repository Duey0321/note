import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import prisma from "./lib/prisma"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({token, user}) {
      if(user) token.id = user.id
      console.log(token)
      return token
    },
    async session({session, token}) {
      if(session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  }
})