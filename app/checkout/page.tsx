"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart/cart-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}

function CheckoutContent() {
  const { items, total, clear } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <Stepper step={step} />
          {step === 1 && <Shipping onNext={() => setStep(2)} />}
          {step === 2 && (
            <Payment onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <Review
              onBack={() => setStep(2)}
              onPlaceOrder={() => {
                clear();
                alert("Order placed (demo)");
              }}
              total={total}
              itemsCount={items.length}
            />
          )}

          <div className="rounded-lg border p-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Order total</span>
              <span className="font-semibold">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const entries = ["Shipping", "Payment", "Review"];
  return (
    <ol className="flex items-center gap-3 text-sm">
      {entries.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const active = step === n;
        const done = step > n;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full border ${
                done
                  ? "bg-black text-white"
                  : active
                  ? "bg-foreground/10"
                  : "bg-background"
              }`}
            >
              {n}
            </span>
            <span
              className={`${active ? "font-medium" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {i < entries.length - 1 && (
              <span className="mx-2 h-px w-10 bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Shipping({ onNext }: { onNext: () => void }) {
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: "",
    phone: "",
    address: "",
    postal: "",
    country: "India",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Name is required";
    if (!/^\+?\d[\d\s-]{7,}$/.test(values.phone))
      e.phone = "Enter a valid phone number";
    if (!values.address.trim()) e.address = "Address is required";
    if (!/^\d{5,6}$/.test(values.postal))
      e.postal = "Enter a valid postal code";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!validate()) {
          toast({
            title: "Check your details",
            description: "Please fix the highlighted fields.",
          });
          return;
        }
        onNext();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          value={values.name}
          onChange={(v) => setValues((s) => ({ ...s, name: v }))}
          error={errors.name}
          placeholder="Jane Doe"
        />
        <Field
          label="Phone"
          value={values.phone}
          onChange={(v) => setValues((s) => ({ ...s, phone: v }))}
          error={errors.phone}
          placeholder="+91 90000 00000"
        />
      </div>
      <Field
        label="Email"
        value={values.email}
        onChange={(v) => setValues((s) => ({ ...s, email: v }))}
        error={errors.email}
        placeholder="you@example.com"
        type="email"
      />
      <Field
        label="Address"
        value={values.address}
        onChange={(v) => setValues((s) => ({ ...s, address: v }))}
        error={errors.address}
        placeholder="Street, City, State"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Postal code"
          value={values.postal}
          onChange={(v) => setValues((s) => ({ ...s, postal: v }))}
          error={errors.postal}
          placeholder="560001"
        />
        <Field
          label="Country"
          value={values.country}
          onChange={(v) => setValues((s) => ({ ...s, country: v }))}
          placeholder="India"
        />
      </div>
      <Button className="bg-black" type="submit">
        Continue to payment
      </Button>
    </form>
  );
}

function Payment({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [values, setValues] = useState({
    card: "",
    name: "",
    exp: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brand = /^4/.test(values.card)
    ? "Visa"
    : /^(5[1-5])/.test(values.card)
    ? "Mastercard"
    : /^3[47]/.test(values.card)
    ? "Amex"
    : "";

  function validate() {
    const e: Record<string, string> = {};
    if (!/^\d{12,19}$/.test(values.card.replace(/\s+/g, "")))
      e.card = "Enter a valid card number";
    if (!values.name.trim()) e.name = "Name required";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.exp)) e.exp = "Use MM/YY";
    if (!/^\d{3,4}$/.test(values.cvc)) e.cvc = "3–4 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!validate()) {
          toast({
            title: "Check payment details",
            description: "Please fix the highlighted fields.",
          });
          return;
        }
        onNext();
      }}
    >
      <Field
        label={`Card number${brand ? ` · ${brand}` : ""}`}
        value={values.card}
        onChange={(v) =>
          setValues((s) => ({ ...s, card: v.replace(/[^\d]/g, "") }))
        }
        error={errors.card}
        placeholder="4242 4242 4242 4242"
        inputMode="numeric"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Name on card"
          value={values.name}
          onChange={(v) => setValues((s) => ({ ...s, name: v }))}
          error={errors.name}
          placeholder="Jane Doe"
          className="sm:col-span-1"
        />
        <Field
          label="Expiry"
          value={values.exp}
          onChange={(v) => setValues((s) => ({ ...s, exp: v }))}
          error={errors.exp}
          placeholder="MM/YY"
          className="sm:col-span-1"
        />
        <Field
          label="CVC"
          value={values.cvc}
          onChange={(v) => setValues((s) => ({ ...s, cvc: v }))}
          error={errors.cvc}
          placeholder="123"
          inputMode="numeric"
          className="sm:col-span-1"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} type="button">
          Back
        </Button>
        <Button className="bg-black" type="submit">
          Review order
        </Button>
      </div>
    </form>
  );
}

function Review({
  onBack,
  onPlaceOrder,
  total,
  itemsCount,
}: {
  onBack: () => void;
  onPlaceOrder: () => void;
  total: number;
  itemsCount: number;
}) {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-muted-foreground">
        {itemsCount} item(s) • Free shipping • 6‑month warranty
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-black" onClick={onPlaceOrder}>
          Place order
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  className,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className={className}>
      <label className="text-sm">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        aria-invalid={!!error}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
