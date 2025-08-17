import Image from "next/image"
import { cn } from "@/lib/utils"

const brands = [
  {
    name: "Dell",
    logo: (
      <svg viewBox="0 0 120 28" className="h-7 w-auto opacity-70">
        <text x="10" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">
          DELL
        </text>
      </svg>
    )
  },
  {
    name: "HP",
    logo: (
      <svg viewBox="0 0 120 28" className="h-7 w-auto opacity-70">
        <text x="10" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">
          HP
        </text>
      </svg>
    )
  },
  {
    name: "Lenovo",
    logo: (
      <svg viewBox="0 0 120 28" className="h-7 w-auto opacity-70">
        <text x="10" y="20" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="currentColor">
          lenovo
        </text>
      </svg>
    )
  },
  {
    name: "Acer",
    logo: (
      <svg viewBox="0 0 120 28" className="h-7 w-auto opacity-70">
        <text x="10" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">
          acer
        </text>
      </svg>
    )
  },
  {
    name: "ASUS",
    logo: (
      <svg viewBox="0 0 120 28" className="h-7 w-auto opacity-70">
        <text x="10" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">
          ASUS
        </text>
      </svg>
    )
  },
  {
    name: "Microsoft",
    logo: (
      <svg viewBox="0 0 120 28" className="h-7 w-auto opacity-70">
        <text x="10" y="20" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="currentColor">
          Microsoft
        </text>
      </svg>
    )
  }
];

export function LogoCloud({ className }: { className?: string }) {
  return (
    <section className={cn("bg-white dark:bg-gray-950", className)}>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <p className="mb-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Trusted by teams and students alike - featuring laptops from top brands
        </p>
        <div className="grid grid-cols-2 place-items-center gap-8 sm:grid-cols-3 md:grid-cols-6">
          {brands.map((brand, i) => (
            <div key={i} className="flex items-center justify-center text-neutral-600 dark:text-neutral-300">
              {brand.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
