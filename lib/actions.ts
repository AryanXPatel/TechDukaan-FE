"use server"

export async function subscribeNewsletter(formData: FormData) {
  console.log("newsletter:", formData.get("email"))
}

export async function subscribeFooterNewsletter(formData: FormData) {
  console.log("footer-newsletter:", formData.get("email"))
}

export async function submitContactForm(formData: FormData) {
  console.log("support-contact", Object.fromEntries(formData.entries()))
}