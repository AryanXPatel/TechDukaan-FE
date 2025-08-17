import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ananya S.",
    body: "Laptop arrived spotless with excellent battery life. Customer support was prompt on WhatsApp.",
    rating: 5,
  },
  {
    name: "Rahul K.",
    body: "Great value. Transparent grading and fast delivery. Will buy again for my team.",
    rating: 5,
  },
  {
    name: "Meera D.",
    body: "Minor mark as described. Setup service saved time. Highly recommended.",
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-14 lg:px-8">
      <h2 className="mb-6 text-2xl font-semibold">What customers say</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Card key={i} className="transition-shadow hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-1 text-amber-600">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-4 w-4 ${j < t.rating ? "fill-current" : ""}`} />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.body}</p>
              <div className="mt-3 text-sm font-medium">{t.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
