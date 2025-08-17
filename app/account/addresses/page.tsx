"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/use-auth";
import { userDataService, type UserAddress } from "@/lib/supabase/user-data";

type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert UserAddress to Address format
  const convertFromUserAddress = (userAddr: UserAddress): Address => ({
    id: userAddr.id,
    label: userAddr.label,
    recipient: userAddr.recipient,
    phone: userAddr.phone,
    line: userAddr.line,
    city: userAddr.city,
    state: userAddr.state,
    pincode: userAddr.pincode,
    isDefault: userAddr.is_default,
  });

  // Convert Address to UserAddress format
  const convertToUserAddress = (
    addr: Address
  ): Omit<UserAddress, "id" | "created_at" | "updated_at"> => ({
    user_id: user?.id || "",
    label: addr.label,
    recipient: addr.recipient,
    phone: addr.phone,
    line: addr.line,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    is_default: addr.isDefault || false,
  });

  useEffect(() => {
    if (user?.id) {
      loadAddresses();
    }
  }, [user?.id]);

  async function loadAddresses() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const userAddresses = await userDataService.getAddresses(user.id);
      setAddresses(userAddresses.map(convertFromUserAddress));
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function upsertAddress(a: Address) {
    if (!user?.id) return;

    try {
      const userAddress = convertToUserAddress(a);

      if (a.id && a.id.length > 10) {
        // Existing address - update
        await userDataService.updateAddress(a.id, userAddress);
      } else {
        // New address - create
        await userDataService.saveAddress(userAddress);
      }

      // Reload addresses
      await loadAddresses();
      setEditing(null);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  }

  async function remove(id: string) {
    if (!user?.id) return;

    try {
      await userDataService.deleteAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error("Error removing address:", error);
    }
  }

  async function setDefault(id: string) {
    if (!user?.id) return;

    try {
      await userDataService.setDefaultAddress(user.id, id);
      await loadAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to manage your addresses.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading addresses...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Address book</CardTitle>
        <Button
          onClick={() =>
            setEditing({
              id: crypto.randomUUID(),
              label: "",
              recipient: "",
              phone: "",
              line: "",
              city: "",
              state: "",
              pincode: "",
            })
          }
        >
          Add address
        </Button>
      </CardHeader>
      <CardContent>
        {editing ? (
          <AddressForm
            value={editing}
            onCancel={() => setEditing(null)}
            onSave={(a) => upsertAddress(a)}
          />
        ) : null}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-lg border p-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{a.label || "Address"}</div>
                {a.isDefault && (
                  <span className="text-xs text-emerald-700">Default</span>
                )}
              </div>
              <div className="mt-1 text-muted-foreground">
                <div>
                  {a.recipient} • {a.phone}
                </div>
                <div>{a.line}</div>
                <div>
                  {a.city}, {a.state} {a.pincode}
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => setEditing(a)}
                >
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(a.id)}>
                  Remove
                </Button>
                {!a.isDefault && (
                  <Button size="sm" onClick={() => setDefault(a.id)}>
                    Make default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AddressForm({
  value,
  onSave,
  onCancel,
}: {
  value: Address;
  onSave: (a: Address) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState<Address>(value);
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!v.recipient.trim()) return "Recipient is required";
    if (!/^\+?\d[\d\s-]{7,}$/.test(v.phone))
      return "Enter a valid phone number";
    if (!v.line.trim()) return "Address line is required";
    if (!v.city.trim()) return "City is required";
    if (!v.state.trim()) return "State is required";
    if (!/^\d{5,6}$/.test(v.pincode)) return "Enter a valid pincode";
    return null;
  }

  async function useLocation() {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Simple reverse geocode via Nominatim (demo purposes)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const addr = data.address || {};
          setV((s) => ({
            ...s,
            city: addr.city || addr.town || addr.village || s.city,
            state: addr.state || s.state,
            pincode: addr.postcode || s.pincode,
            line:
              s.line || `${addr.road || ""} ${addr.neighbourhood || ""}`.trim(),
          }));
        } catch {
          setError("Could not fetch address from location.");
        }
      },
      () => setError("Permission denied or location unavailable."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <form
      className="rounded-lg border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const err = validate();
        setError(err);
        if (!err) onSave(v);
      }}
      aria-describedby={error ? "addr-error" : undefined}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Label"
          value={v.label}
          onChange={(x) => setV((s) => ({ ...s, label: x }))}
        />
        <Field
          label="Recipient"
          value={v.recipient}
          onChange={(x) => setV((s) => ({ ...s, recipient: x }))}
        />
        <Field
          label="Phone"
          value={v.phone}
          onChange={(x) => setV((s) => ({ ...s, phone: x }))}
        />
        <Field
          label="Address line"
          value={v.line}
          onChange={(x) => setV((s) => ({ ...s, line: x }))}
        />
        <Field
          label="City"
          value={v.city}
          onChange={(x) => setV((s) => ({ ...s, city: x }))}
        />
        <Field
          label="State"
          value={v.state}
          onChange={(x) => setV((s) => ({ ...s, state: x }))}
        />
        <Field
          label="Pincode"
          value={v.pincode}
          onChange={(x) => setV((s) => ({ ...s, pincode: x }))}
        />
      </div>
      {error && (
        <p id="addr-error" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" className="bg-black">
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-transparent"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={useLocation}
          aria-label="Use current location"
        >
          Use current location
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
