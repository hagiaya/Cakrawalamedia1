import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'Cakrawala Media - Berita Terkini',
  description: 'Portal berita terpercaya dengan update terkini.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
