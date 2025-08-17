"use client";

import Link from "next/link";
import { Triangle, Heart, Search, Menu, X, User, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AccountMenu } from "@/components/account/account-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function SiteHeader({ className }: { className?: string }) {
  const [q, setQ] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  // Always enable high-contrast mode
  useEffect(() => {
    document.documentElement.setAttribute("data-contrast", "high");
  }, []);

  const navigationLinks = [
    { href: "/shop", label: "All Products" },
    { href: "/shop?category=business", label: "Business" },
    { href: "/shop?category=gaming", label: "Gaming" },
    { href: "/shop?category=student", label: "Student" },
    { href: "/shop?category=ultrabooks", label: "Ultrabooks" },
    { href: "/shop?category=accessories", label: "Accessories" },
  ];
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur dark:bg-background/80",
        className
      )}
    >
      <div className="mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold">
          <Triangle className="h-5 w-5" aria-hidden="true" />
          <span>TechDukaan</span>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm md:flex"
          aria-label="Primary"
        >
          <Link
            href="/shop"
            className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            All Products
          </Link>
          <Link
            href="/shop?category=business"
            className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            Business
          </Link>
          <Link
            href="/shop?category=gaming"
            className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            Gaming
          </Link>
          <Link
            href="/shop?category=student"
            className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            Student
          </Link>
          <Link
            href="/shop?category=ultrabooks"
            className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            Ultrabooks
          </Link>
          <Link
            href="/shop?category=accessories"
            className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            Accessories
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-64 pl-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/shop?q=${encodeURIComponent(q)}`;
                }
              }}
              aria-label="Search site"
            />
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
          </div>
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Wishlist"
          >
            <Link href="/wishlist">
              <Heart className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
          <CartDrawer />
          <AccountMenu />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Open search"
          >
            <Link href="/shop">
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
          <ThemeToggle />
          <CartDrawer />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col space-y-6">
                {/* Auth Section */}
                <div className="border-b pb-6">
                  {loading ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ) : user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {user.name || "Account"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 pl-11">
                        <Link
                          href="/account"
                          className="block text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                        <button
                          className="block text-sm text-muted-foreground hover:text-foreground"
                          onClick={async () => {
                            await signOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/sign-in">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/sign-in">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <nav className="space-y-4">
                  <h3 className="font-medium">Categories</h3>
                  <div className="space-y-3">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Additional Links */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-medium">Support</h3>
                  <div className="space-y-3">
                    <Link
                      href="/support"
                      className="block text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Help Center
                    </Link>
                    <Link
                      href="/support/contact"
                      className="block text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                    <Link
                      href="/about"
                      className="block text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
