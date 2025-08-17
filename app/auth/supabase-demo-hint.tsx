export default function SupabaseDemoHint() {
  return (
    <p className="rounded-md border bg-amber-50 p-3 text-xs text-amber-700">
      Supabase keys are not configured. The buttons will show demo behavior. Add NEXT_PUBLIC_SUPABASE_URL and
      NEXT_PUBLIC_SUPABASE_ANON_KEY to enable real authentication.
    </p>
  )
}
