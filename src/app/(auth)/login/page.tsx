"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!result?.ok) {
        setError("Invalid email or password")
        return
      }

      // Return the user to the page that sent them here, if any. Only accept
      // same-site paths: "//host" is protocol-relative and would leave the site.
      const callbackUrl = new URLSearchParams(window.location.search).get(
        "callbackUrl"
      )
      const isSafePath =
        !!callbackUrl &&
        callbackUrl.startsWith("/") &&
        !callbackUrl.startsWith("//")
      router.push(isSafePath ? callbackUrl : "/")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1010] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#84cc16] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-2xl">Ultimate</span>
          </div>
          <p className="text-[#9ca3af] text-lg">Turn your content into revenue.</p>
        </div>

        {/* Form Card */}
        <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
          <CardHeader>
            <CardTitle className="text-white">Welcome back</CardTitle>
            <CardDescription className="text-[#9ca3af]">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-[#ef4444]/10 border border-[#ef4444] text-[#ef4444] text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-[#2a2d2d]"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[#9ca3af]">
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4">
              <p className="text-center text-sm text-[#9ca3af]">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#84cc16] hover:text-[#a3e635]">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
