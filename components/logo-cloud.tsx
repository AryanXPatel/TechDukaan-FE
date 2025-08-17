import Image from "next/image"
import { cn } from "@/lib/utils"

export function LogoCloud({ className }: { className?: string }) {
  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <p className="mb-6 text-center text-sm text-neutral-500">Trusted by teams and students alike</p>
        <div className="grid grid-cols-2 place-items-center gap-8 opacity-80 sm:grid-cols-3 md:grid-cols-6">
          {[
            "/generic-brand-logo-1.png",
            "/generic-brand-logo-2.png",
            "/brand-logo-3.png",
            "/brand-logo-4.png",
            "/brand-logo-5.png",
            "/brand-logo-6.png",
          ].map((src, i) => (
            <Image key={i} src={src || "/placeholder.svg"} alt={"Logo " + (i + 1)} width={120} height={28} />
          ))}
        </div>
      </div>
    </section>
  )
}
