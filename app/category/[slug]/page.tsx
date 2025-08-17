import { redirect } from "next/navigation"

const map: Record<string, string> = {
  business: "/shop?q=business",
  gaming: "/shop?q=gaming",
  student: "/shop?q=student",
  ultrabooks: "/shop?q=ultrabook",
  accessories: "/shop?q=accessories",
}

export default async function CategoryRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const to = map[slug] || "/shop"
  redirect(to)
}
