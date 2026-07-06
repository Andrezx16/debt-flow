import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] w-full">
      <KeyboardShortcuts />
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile top + bottom nav */}
      <MobileNav />

      {/* Main content */}
      <main className="flex-1 min-w-0 w-full bg-[var(--bg-base)] min-h-[100dvh] overflow-auto pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
    </div>
  )
}
