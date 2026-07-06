import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/hooks/useTheme'
import { ReactQueryProvider } from '@/lib/query-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'DebtFlow',
    template: '%s | DebtFlow',
  },
  description:
    'Administra préstamos personales de forma elegante. Rastrea deudas, pagos y progreso en tiempo real.',
  keywords: ['préstamos', 'deudas', 'pagos', 'finanzas personales'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('debtflow-theme');
                  var theme = (saved === 'clay-light' || saved === 'clay-dark')
                    ? saved
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'clay-dark' : 'clay-light');
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.style.visibility = 'visible';
                } catch(e) {
                  document.documentElement.setAttribute('data-theme', 'clay-light');
                  document.documentElement.style.visibility = 'visible';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <ReactQueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  boxShadow: 'var(--clay-shadow)',
                  fontFamily: 'var(--font-geist-sans)',
                },
              }}
            />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
