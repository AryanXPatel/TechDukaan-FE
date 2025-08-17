"use client"

import type React from "react"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import type { ProductImage } from "@/lib/products"
import { cn } from "@/lib/utils"

export function ProductGallery({
  images,
  className,
}: {
  images: ProductImage[]
  className?: string
}) {
  const [active, setActive] = useState(0)
  const [isZoom, setIsZoom] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const current = images[active] || images[0]

  // touch swipe state
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

  useEffect(() => setActive(0), [images])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  const bgStyle = useMemo(
    () => ({
      backgroundImage: `url(${current.src})`,
      backgroundSize: "200%",
      backgroundPosition: `${pos.x}% ${pos.y}%`,
    }),
    [current.src, pos.x, pos.y],
  )

  // keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setActive((i) => Math.min(images.length - 1, i + 1))
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    }
    if (e.key === "Escape") {
      setIsZoom(false)
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsZoom((z) => !z)
    }
  }

  // touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX
    touchDeltaX.current = 0
  }
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current != null) {
      touchDeltaX.current = e.changedTouches[0].clientX - touchStartX.current
    }
  }
  const onTouchEnd = () => {
    const dx = touchDeltaX.current
    const threshold = 30 // px
    if (Math.abs(dx) > threshold) {
      if (dx < 0) setActive((i) => Math.min(images.length - 1, i + 1))
      else setActive((i) => Math.max(0, i - 1))
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  return (
    <div className={cn("grid gap-3 lg:grid-cols-[88px_1fr]", className)}>
      {/* Thumbnails */}
      <div className="order-2 flex gap-2 overflow-auto lg:order-1 lg:flex-col" aria-label="Image thumbnails">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            onClick={() => {
              setActive(i)
              setIsZoom(false)
            }}
            className={cn(
              "relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === i ? "ring-2 ring-foreground/70" : "opacity-80 hover:opacity-100",
            )}
            aria-label={"View image " + (i + 1)}
            aria-current={active === i}
          >
            <Image
              src={img.src || "/placeholder.svg"}
              alt={img.alt || "Product image " + (i + 1)}
              width={160}
              height={160}
              placeholder={img.blurDataURL ? "blur" : "empty"}
              blurDataURL={img.blurDataURL}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image with zoom */}
      <div
        ref={containerRef}
        className="order-1 aspect-[4/3] overflow-hidden rounded-xl border bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:order-2"
        onMouseEnter={() => setIsZoom(true)}
        onMouseLeave={() => setIsZoom(false)}
        onMouseMove={handleMove}
        onClick={() => setIsZoom((z) => !z)}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="img"
        aria-label={current.alt || "Product image"}
        tabIndex={0}
      >
        {/* Fallback image */}
        <Image
          src={current.src || "/placeholder.svg"}
          alt={current.alt || "Product image"}
          width={1200}
          height={900}
          placeholder={current.blurDataURL ? "blur" : "empty"}
          blurDataURL={current.blurDataURL}
          className={cn("h-full w-full object-cover transition", isZoom ? "opacity-0 lg:opacity-0" : "opacity-100")}
          priority
        />
        {/* Zoom layer (desktop hover / click toggle) */}
        <div
          className={cn(
            "hidden h-full w-full lg:block",
            isZoom ? "opacity-100" : "opacity-0",
            "transition-opacity duration-200",
          )}
          style={bgStyle as any}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
