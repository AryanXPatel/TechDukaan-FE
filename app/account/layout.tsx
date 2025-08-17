import type React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import AuthGuard from "@/components/auth/auth-guard";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-dvh bg-background text-foreground">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-[240px_1fr] lg:px-8">
          <aside className="md:sticky md:top-20">
            <Card className="p-4">
              <nav className="space-y-1 text-sm">
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account"
                >
                  Overview
                </Link>
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account/orders"
                >
                  Orders
                </Link>
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account/bulk-orders"
                >
                  Bulk Orders
                </Link>
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account/warranty"
                >
                  Warranty
                </Link>
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account/addresses"
                >
                  Addresses
                </Link>
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account/preferences"
                >
                  Preferences
                </Link>
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account/recommendations"
                >
                  Recommendations
                </Link>
                <Link
                  className="block rounded-md px-2 py-2 hover:bg-muted"
                  href="/account/settings"
                >
                  Settings
                </Link>
              </nav>
            </Card>
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </AuthGuard>
  );
}
