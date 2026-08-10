import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { MobileNav } from "@/components/layout/MobileNav"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

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
