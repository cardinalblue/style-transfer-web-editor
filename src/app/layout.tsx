import type { Metadata } from 'next'
import '@/app/globals.css'
import { QueryClientProvider } from '@/components/providers/QueryClient'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  )
}
