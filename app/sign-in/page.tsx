"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { SupabaseAuthPanel } from "@/components/auth/supabase-auth-panel";

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to account if user is already signed in
  useEffect(() => {
    if (!loading && user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <main
          className="mx-auto grid max-w-md place-items-center px-6 py-16"
          id="signin-main"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main
        className="mx-auto grid max-w-md place-items-center px-6 py-16"
        id="signin-main"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SupabaseAuthPanel onSignedIn={() => router.push("/account")} />

            <p className="text-center text-xs text-muted-foreground">
              By continuing you agree to our{" "}
              <Link href="/policies/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/policies/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
