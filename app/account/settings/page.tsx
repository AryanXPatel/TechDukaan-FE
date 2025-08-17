"use client"

import { useAuth } from "@/components/auth/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Account settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="bg-black" onClick={() => alert("Saved (demo)")}>
            Save changes
          </Button>
          <Button variant="outline" onClick={() => alert("Preferences saved (demo)")}>
            Update preferences
          </Button>
          <Button variant="ghost" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
