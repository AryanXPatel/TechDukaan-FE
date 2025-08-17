"use client"

type AlertPrefs = {
  priceDrop?: boolean
  backInStock?: boolean
  via?: "email" | "whatsapp"
}
type AlertsStore = Record<string, AlertPrefs>

function load(): AlertsStore {
  try {
    return JSON.parse(localStorage.getItem("tk_wishlist_alerts") || "{}")
  } catch {
    return {}
  }
}
function save(data: AlertsStore) {
  localStorage.setItem("tk_wishlist_alerts", JSON.stringify(data))
}

export function getAlertPrefs(id: string): AlertPrefs {
  const s = load()
  return s[id] || { priceDrop: false, backInStock: false, via: "whatsapp" }
}

export function setAlertPrefs(id: string, prefs: AlertPrefs) {
  const s = load()
  s[id] = prefs
  save(s)
}

export function shareWishlist(ids: string[]) {
  const qs = ids.join(",")
  if (typeof window !== "undefined") {
    const url = `${window.location.origin}/account/wishlist?ids=${encodeURIComponent(qs)}`
    navigator.clipboard.writeText(url)
    alert("Share link copied")
  }
}
