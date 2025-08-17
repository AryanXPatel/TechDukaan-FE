import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { submitContactForm } from "@/lib/actions"

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-6 py-14 lg:px-8" id="contact-main">
        <Card asChild>
          <section aria-labelledby="contact-heading">
            <CardHeader>
              <CardTitle id="contact-heading">Contact support</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={submitContactForm}
                className="space-y-4"
                aria-describedby="contact-instructions"
              >
                <p id="contact-instructions" className="text-xs text-muted-foreground">
                  All fields are required unless marked optional.
                </p>
                <div>
                  <label className="text-sm" htmlFor="name">
                    Name
                  </label>
                  <Input id="name" name="name" required placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm" htmlFor="email">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm" htmlFor="message">
                    Message
                  </label>
                  <Textarea id="message" name="message" required placeholder="How can we help?" />
                </div>
                <Button type="submit" className="bg-black">
                  Send message
                </Button>
              </form>
            </CardContent>
          </section>
        </Card>
      </main>
    </div>
  )
}
