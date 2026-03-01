import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// ── In-memory user store (hackathon-grade — swap for DB in production) ──────
const USERS: Record<string, { id: string; name: string; email: string; hashedPassword: string }> = {}

// Seed a demo user on startup
const DEMO_HASH = bcrypt.hashSync('abcdef', 10)
USERS['demo@contentiq.ai'] = {
  id: 'demo-001',
  name: 'Demo User',
  email: 'demo@contentiq.ai',
  hashedPassword: DEMO_HASH,
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' }, // for signup
        isSignup: { label: 'Is Signup', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email.toLowerCase()

        // ── Signup flow ──────────────────────────────────────────────────────
        if (credentials.isSignup === 'true') {
          if (USERS[email]) throw new Error('Email already registered')
          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const id = `user-${Date.now()}`
          USERS[email] = {
            id,
            name: credentials.name || email.split('@')[0],
            email,
            hashedPassword,
          }
          return { id, name: USERS[email].name, email }
        }

        // ── Login flow ───────────────────────────────────────────────────────
        const user = USERS[email]
        if (!user) throw new Error('No account found for this email')

        const valid = await bcrypt.compare(credentials.password, user.hashedPassword)
        if (!valid) throw new Error('Incorrect password')

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return `${baseUrl}/dashboard`
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
