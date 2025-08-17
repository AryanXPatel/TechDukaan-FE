import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ShieldCheck,
  Wrench,
  Heart,
  Users,
  Zap,
  DollarSign,
  Leaf,
  Award,
  Building2,
  User,
  Shield,
  Headphones,
  ClipboardCheck,
} from "lucide-react";

export function TrustSection() {
  const benefits = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Save up to 60%",
      desc: "Get premium laptops at fraction of retail price",
    },
    {
      icon: <Leaf className="h-5 w-5" />,
      title: "Eco-friendly choice",
      desc: "Reduce e-waste and environmental impact",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Quality assured",
      desc: "Thoroughly tested and graded for reliability",
    },
  ];

  const businessBenefits = [
    "Bulk pricing available",
    "Consistent performance standards",
    "Warranty and support included",
  ];

  const individualBenefits = [
    "Premium brands at budget prices",
    "Environmentally responsible choice",
    "Same functionality as new",
  ];

  const trustPoints = [
    {
      icon: <Shield className="h-4 w-4" />,
      label: "Warranty",
      value: "30-day replacement",
    },
    {
      icon: <Headphones className="h-4 w-4" />,
      label: "Support",
      value: "Technical assistance",
    },
    {
      icon: <ClipboardCheck className="h-4 w-4" />,
      label: "Grading",
      value: "Condition transparency",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Why choose refurbished?</h2>
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          30‑day replacement guarantee
        </Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {benefits.map((benefit) => (
          <Card key={benefit.title}>
            <CardContent className="flex items-start gap-3 p-5">
              <div className="rounded-md border bg-white dark:bg-neutral-800 p-2">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-medium">{benefit.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {benefit.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Smart choice for businesses and individuals
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Refurbished laptops offer the perfect balance of performance,
              affordability, and sustainability. Get enterprise-grade hardware
              without the premium price tag.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  <h4 className="font-medium">For Businesses</h4>
                </div>
                <ul className="space-y-2">
                  {businessBenefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-emerald-600 mt-0.5">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  <h4 className="font-medium">For Individuals</h4>
                </div>
                <ul className="space-y-2">
                  {individualBenefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-emerald-600 mt-0.5">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Trusted by customers nationwide
            </h3>

            <div className="space-y-4">
              {trustPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white dark:bg-neutral-700 p-2">
                      {point.icon}
                    </div>
                    <span className="font-medium text-sm">{point.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {point.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-800 dark:text-emerald-200 text-sm">
                  Pre-launch exclusive pricing
                </span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Get the best deals as we launch. Direct WhatsApp support and
                personal attention to every order.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
