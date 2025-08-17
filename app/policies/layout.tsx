import type React from "react"
export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-6 py-14 lg:px-8">{children}</div>
}
