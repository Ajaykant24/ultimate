import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1010] flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-6xl font-bold text-[#84cc16]">404</p>
          <h1 className="text-4xl font-bold text-white">Page not found</h1>
        </div>
        <p className="text-[#9ca3af] text-lg">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button className="mt-4">Back to home</Button>
        </Link>
      </div>
    </div>
  )
}
