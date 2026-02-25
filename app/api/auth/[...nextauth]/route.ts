import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password")
        }

        await connectToDatabase()

        const user = await User.findOne({ email: credentials.email.toLowerCase() })

        if (!user) {
          throw new Error("Invalid email or password")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        ;(session.user as { id?: string }).id = token.id as string | undefined
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }

