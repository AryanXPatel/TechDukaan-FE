import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  Headphones,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Support · TechDukaan",
  description:
    "Get help with your TechDukaan orders, warranty claims, and product questions",
};

export default function SupportPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-muted-foreground">
            Get support for your orders, warranty claims, and product questions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Live Chat</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Get instant help from our support team
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat 9 AM - 6 PM</span>
              </div>
              <Badge variant="secondary" className="mb-4">
                Usually responds in 2-3 minutes
              </Badge>
              <Button className="w-full" asChild>
                <Link href="/support/contact">
                  Start Chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Phone Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Speak directly with our experts
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat 9 AM - 6 PM</span>
              </div>
              <p className="font-mono text-lg font-semibold mb-4">
                +91 98765 43210
              </p>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Email Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Send us detailed questions
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>Response within 24 hours</span>
              </div>
              <p className="text-sm mb-4">support@techdukaan.com</p>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Help Topics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Order & Shipping</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Track your order</li>
                  <li>• Delivery timeline</li>
                  <li>• Shipping charges</li>
                  <li>• Change delivery address</li>
                </ul>
                <Button variant="ghost" size="sm" className="mt-4 p-0">
                  Learn more <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Returns & Warranty</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 7-day return policy</li>
                  <li>• Warranty claims</li>
                  <li>• Refund process</li>
                  <li>• Return shipping</li>
                </ul>
                <Button variant="ghost" size="sm" className="mt-4 p-0" asChild>
                  <Link href="/policies/returns">
                    Learn more <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Product Information</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Condition grades</li>
                  <li>• Technical specifications</li>
                  <li>• Compatibility questions</li>
                  <li>• Software & drivers</li>
                </ul>
                <Button variant="ghost" size="sm" className="mt-4 p-0">
                  Learn more <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Account & Payments</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Payment methods</li>
                  <li>• EMI options</li>
                  <li>• Account settings</li>
                  <li>• Order history</li>
                </ul>
                <Button variant="ghost" size="sm" className="mt-4 p-0">
                  Learn more <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you with any questions or issues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/support/contact">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>Service available across India</span>
          </div>
          <p className="text-xs text-muted-foreground">
            TechDukaan Support • Mon-Sat 9 AM - 6 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}
