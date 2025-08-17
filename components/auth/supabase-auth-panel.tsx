"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowser } from "@/lib/supabase/supabase-browser"
import { isSupabaseConfigured } from "@/lib/auth-config"
import SupabaseDemoHint from "@/app/auth/supabase-demo-hint"
import { Icons } from "@/components/ui/icons"

export function SupabaseAuthPanel({ onSignedIn }: { onSignedIn?: () => void }) {
  const configured = isSupabaseConfigured()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState<string | null>(null)

  async function handleOAuth(provider: "google" | "facebook") {
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: (process.env.NEXT_PUBLIC_APP_URL || window.location.origin) + "/account" },
    })
    setMsg(error ? error.message : "Redirecting...")
  }

  async function handleEmailSignIn() {
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMsg(error ? error.message : "Signed in")
    if (!error) onSignedIn?.()
  }
  async function handleEmailSignUp() {
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signUp({ email, password })
    setMsg(error ? error.message : "Account created. Check your email to verify.")
    if (!error) onSignedIn?.()
  }

  return (
    <div className="space-y-3">
      {!configured && <SupabaseDemoHint />}
      <Button className="w-full bg-black" onClick={() => handleOAuth("google")}>
        <Icons.google className="mr-2 h-4 w-4" /> Continue with Google
      </Button>
      <Button className="w-full bg-transparent" variant="outline" onClick={() => handleOAuth("facebook")}>
        <Icons.facebook className="mr-2 h-4 w-4" /> Continue with Facebook
      </Button>
      <div className="grid gap-2">
        <label className="text-sm">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Password</label>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
      </div>
      <div className="flex gap-2">
        <Button className="flex-1 bg-black" onClick={handleEmailSignIn}>
          Sign in
        </Button>
        <Button className="flex-1 bg-transparent" variant="outline" onClick={handleEmailSignUp}>
          Sign up
        </Button>
      </div>
      {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
    </div>
  )
}
