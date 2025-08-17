import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-6 py-20 text-center">
      <div>
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you are looking for doesn’t exist or was moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild className="bg-black">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/shop">Browse laptops</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
