"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function NewReviewPage() {
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [img, setImg] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  function validate() {
    if (!name.trim()) return "Name is required"
    if (!title.trim()) return "Title is required"
    if (!body.trim()) return "Review text is required"
    return null
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Write a review</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const err = validate()
              setError(err)
              if (!err) alert("Review submitted (demo)")
            }}
            aria-describedby={error ? "review-error" : undefined}
          >
            <div>
              <label className="text-sm" htmlFor="r-name">
                Your name
              </label>
              <Input id="r-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="text-sm" htmlFor="r-title">
                Review title
              </label>
              <Input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Great value" />
            </div>
            <div>
              <label className="text-sm" htmlFor="r-body">
                Review
              </label>
              <Textarea
                id="r-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your experience…"
              />
            </div>
            <div>
              <label className="text-sm" htmlFor="r-photo">
                Add photo (optional)
              </label>
              <Input
                id="r-photo"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setImg(e.target.files?.[0] || null)}
              />
              <p className="mt-1 text-xs text-muted-foreground">Use camera to capture a photo on mobile.</p>
            </div>
            {error && (
              <p id="review-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit" className="bg-black">
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-transparent"
                onClick={async () => {
                  if ("Notification" in window) {
                    const perm = await Notification.requestPermission()
                    alert(`Notifications: ${perm}`)
                  } else alert("Notifications are not supported in this browser.")
                }}
              >
                Enable notifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
