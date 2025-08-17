export const WHATSAPP_NUMBER = "+919876543210"

export function buildWaLink(message: string) {
  const num = WHATSAPP_NUMBER.replace(/\D/g, "")
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}
