import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { logAdminAction } from "@/lib/logger";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          throw new Error("Invalid credentials")
        }

        return user
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
      
        session.user.id = token.id as string
   
        session.user.role = token.role as string
        prisma.user.update({
          where: { id: token.id as string },
          data: { lastActive: new Date() }
        }).catch(err => console.error("Error updating lastActive:", err));
      
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (user.id) {
        await logAdminAction(
          user.id,
          isNewUser ? "REGISTER" : "LOGIN",
          `Provider: ${account?.provider}`
        );
      }
    },
    async signOut({ token }) {
      // Note: In JWT sessions, 'token' contains the user payload
      if (token && token.sub) {
         await logAdminAction(token.sub, "LOGOUT", "User logged out");
      }
    },
    async createUser({ user }) {
      const count = await prisma.user.count()
      if (count === 1) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "SUPER_ADMIN" },
        });
        await logAdminAction(user.id, "SYSTEM_PROMOTE", "First user promoted to SUPER_ADMIN");
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
