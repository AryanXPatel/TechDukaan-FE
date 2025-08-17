"use client"

import SearchClient from "./search-client"

export const dynamic = "force-static"

export default function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  return <SearchClient initialParams={searchParams} />
}
