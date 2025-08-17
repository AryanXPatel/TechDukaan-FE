"use client"
import Link from "next/link"

export function SearchLink() {
  return (
    <Link href="/search" className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white">
      Advanced Search
    </Link>
  )
}
