import type React from "react"
import { Facebook, RefreshCw } from "lucide-react"

export const Icons = {
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" {...props} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.9h5.3c-.23 1.5-1.8 4.3-5.3 4.3A6.15 6.15 0 0 1 5.85 12 6.15 6.15 0 0 1 12 5.65c1.75 0 2.92.75 3.6 1.4l2.47-2.38C16.9 3.2 14.7 2.25 12 2.25a9.75 9.75 0 1 0 0 19.5c5.62 0 9.3-3.95 9.3-9.5 0-.64-.07-1.06-.15-1.55Z"
      />
    </svg>
  ),
  facebook: (props: React.SVGProps<SVGSVGElement>) => <Facebook {...props} />,
  spinner: (props: React.SVGProps<SVGSVGElement>) => <RefreshCw {...props} className="animate-spin" />,
}
