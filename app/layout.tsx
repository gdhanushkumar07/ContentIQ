import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'ContentIQ — Raw Footage to Viral Gold',
  description: 'AI-powered scene intelligence, engagement prediction, and automated distribution.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    // suppressHydrationWarning prevents SSR/client mismatch for the `dark` class
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
        <ThemeProvider>
          <Providers session={session}>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
