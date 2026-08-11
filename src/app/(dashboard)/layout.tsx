import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { MobileNav } from "@/components/layout/MobileNav"

export const dynamic = "force-dynamic"

// Browsing is public. Pages that show personal data guard themselves.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#0f1010] text-white">
      <Sidebar />
      <Topbar />
      <MobileNav />
      <main className="md:ml-56 md:mt-16 md:mb-0 mb-16 min-h-screen">
        {children}
      </main>
    </div>
  )
}
