"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowser } from "@/lib/supabase/supabase-browser"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto grid max-w-md place-items-center px-6 py-16" id="reset-main">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Reset your password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm" htmlFor="reset-email">
                Email
              </label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <Button
              className="w-full bg-black"
              onClick={async () => {
                const supabase = getSupabaseBrowser()
                const { error } = await (supabase as any).auth.resetPasswordForEmail(email, {
                  redirectTo: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/reset-password",
                })
                setMsg(error ? error.message : "If the email exists, a reset link has been sent.")
              }}
            >
              Send reset link
            </Button>
            {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
