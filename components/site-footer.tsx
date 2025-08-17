import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { subscribeFooterNewsletter } from "@/lib/actions";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Newsletter
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Get updates and exclusive deals.
            </p>
            <form
              action={subscribeFooterNewsletter}
              className="mt-4 flex gap-2"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Shop</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/category/business"
                  className="hover:text-foreground transition-colors"
                >
                  Business Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/category/gaming"
                  className="hover:text-foreground transition-colors"
                >
                  Gaming Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/category/student"
                  className="hover:text-foreground transition-colors"
                >
                  Student Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ultrabooks"
                  className="hover:text-foreground transition-colors"
                >
                  Premium Ultrabooks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Support</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/support/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/warranty"
                  className="hover:text-foreground transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/returns"
                  className="hover:text-foreground transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="hover:text-foreground transition-colors"
                >
                  Shipping
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Follow</h4>
            <div className="mt-2 flex gap-3 text-muted-foreground">
              <Facebook className="h-5 w-5 hover:text-foreground transition-colors cursor-pointer" />
              <Instagram className="h-5 w-5 hover:text-foreground transition-colors cursor-pointer" />
              <Twitter className="h-5 w-5 hover:text-foreground transition-colors cursor-pointer" />
              <Youtube className="h-5 w-5 hover:text-foreground transition-colors cursor-pointer" />
              <Linkedin className="h-5 w-5 hover:text-foreground transition-colors cursor-pointer" />
            </div>
            <p className="mt-3 text-sm">
              <Link
                href="/about"
                className="underline text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Learn more about our company and our mission.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} TechDukaan</div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-muted-foreground">
              Designed with <Sparkles className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
