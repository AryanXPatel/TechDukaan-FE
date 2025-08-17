"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/use-auth";
import { userDataService } from "@/lib/supabase/user-data";

export default function PreferencesPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({
    emailDeals: true,
    whatsappUpdates: true,
    darkMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id]);

  async function loadPreferences() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const userPrefs = await userDataService.getPreferences(user.id);
      if (userPrefs) {
        setPrefs({
          emailDeals: userPrefs.email_deals,
          whatsappUpdates: userPrefs.whatsapp_updates,
          darkMode: userPrefs.dark_mode,
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences(newPrefs: typeof prefs) {
    if (!user?.id || saving) return;
    setSaving(true);
    try {
      await userDataService.savePreferences({
        user_id: user.id,
        email_deals: newPrefs.emailDeals,
        whatsapp_updates: newPrefs.whatsappUpdates,
        dark_mode: newPrefs.darkMode,
      });
      setPrefs(newPrefs);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  }

  function updatePref(key: keyof typeof prefs, value: boolean) {
    const newPrefs = { ...prefs, [key]: value };
    savePreferences(newPrefs);
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to manage your preferences.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading preferences...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Row
          label="Email me deals and updates"
          checked={prefs.emailDeals}
          onChange={(v) => updatePref("emailDeals", v)}
          disabled={saving}
        />
        <Row
          label="Send WhatsApp order updates"
          checked={prefs.whatsappUpdates}
          onChange={(v) => updatePref("whatsappUpdates", v)}
          disabled={saving}
        />
        <Row
          label="Prefer dark mode"
          checked={prefs.darkMode}
          onChange={(v) => updatePref("darkMode", v)}
          disabled={saving}
        />
        {saving && (
          <p className="text-sm text-muted-foreground">Saving preferences...</p>
        )}
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <Label className="text-sm">{label}</Label>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
