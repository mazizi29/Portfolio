import PublicLayout from "@/layouts/public/PublicLayout"

export function SkeletonBox({
  className = "",
  style = {},
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`skeleton-shimmer rounded ${className}`}
      style={{
        backgroundColor: "rgba(225, 225, 220, 0.7)",
        ...style,
      }}
    />
  )
}

export function HomeSkeleton() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}>
        {/* Hero Section Skeleton */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 min-h-[calc(100vh-80px)] flex flex-col justify-center pt-24 pb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Left Column */}
            <div className="flex-1 w-full max-w-2xl">
              {/* Badge & Subtitle */}
              <div className="flex flex-col items-start gap-3.5 mb-6">
                <SkeletonBox className="h-7 w-48 rounded-full" />
                <SkeletonBox className="h-4 w-64" />
              </div>

              {/* Big Title Headline */}
              <div className="space-y-3 mb-6">
                <SkeletonBox className="h-12 md:h-16 w-11/12" />
                <SkeletonBox className="h-12 md:h-16 w-3/4" />
              </div>

              {/* Subtitle / Intro */}
              <div className="space-y-2 mb-8 max-w-lg">
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-5/6" />
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3.5 mb-10">
                <SkeletonBox className="h-12 w-36 rounded" />
                <SkeletonBox className="h-12 w-32 rounded" />
              </div>

              {/* Stats */}
              <div
                className="flex gap-8 md:gap-14 pt-6 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div>
                  <SkeletonBox className="h-6 w-24 mb-1" />
                  <SkeletonBox className="h-3 w-28" />
                </div>
                <div>
                  <SkeletonBox className="h-6 w-16 mb-1" />
                  <SkeletonBox className="h-3 w-32" />
                </div>
                <div>
                  <SkeletonBox className="h-6 w-20 mb-1" />
                  <SkeletonBox className="h-3 w-36" />
                </div>
              </div>
            </div>

            {/* Right Column: Portrait Photo Skeleton */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end mt-6 lg:mt-0">
              <div style={{ width: "100%", maxWidth: "380px" }}>
                <SkeletonBox
                  className="w-full"
                  style={{
                    aspectRatio: "3/4",
                    borderRadius: "4px 40px 4px 40px",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Selected Works Skeleton */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <SkeletonBox className="h-3 w-28 mb-2" />
              <SkeletonBox className="h-8 w-44" />
            </div>
            <SkeletonBox className="h-4 w-28 hidden md:block" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-6 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <SkeletonBox className="h-4 w-8 shrink-0" />
                <SkeletonBox className="w-full sm:w-44 h-24 shrink-0 rounded" />
                <div className="flex-1 w-full space-y-2">
                  <div className="flex gap-2">
                    <SkeletonBox className="h-4 w-24 rounded" />
                    <SkeletonBox className="h-4 w-20 rounded" />
                  </div>
                  <SkeletonBox className="h-6 w-2/3" />
                  <SkeletonBox className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}

export function WorkSkeleton() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}>
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 pt-36 md:pt-44 pb-20">
          <div className="mb-10 md:mb-14">
            <SkeletonBox className="h-3 w-32 mb-3" />
            <SkeletonBox className="h-12 md:h-16 w-80 mb-4" />
            <SkeletonBox className="h-4 w-96 max-w-full" />
          </div>

          {/* Filter tabs skeleton */}
          <div className="flex flex-wrap gap-2 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBox key={i} className="h-9 w-28 rounded-full" />
            ))}
          </div>

          {/* Project List Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-6 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <SkeletonBox className="h-4 w-8 shrink-0" />
                <SkeletonBox className="w-full sm:w-44 h-24 shrink-0 rounded" />
                <div className="flex-1 w-full space-y-2">
                  <div className="flex gap-2">
                    <SkeletonBox className="h-4 w-28 rounded" />
                    <SkeletonBox className="h-4 w-24 rounded" />
                  </div>
                  <SkeletonBox className="h-6 w-3/4" />
                  <SkeletonBox className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}

export function AboutSkeleton() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}>
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 pt-36 md:pt-44 pb-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SkeletonBox
                className="w-full max-w-sm mx-auto rounded"
                style={{ aspectRatio: "3/4" }}
              />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <SkeletonBox className="h-4 w-32" />
              <SkeletonBox className="h-10 md:h-12 w-full max-w-lg" />
              <div className="space-y-3 pt-4">
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-4/5" />
              </div>
              <div className="pt-6 space-y-4">
                <SkeletonBox className="h-20 w-full rounded" />
                <SkeletonBox className="h-20 w-full rounded" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}

export function ProjectDetailSkeleton() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh" }}>
        <article className="max-w-[1440px] mx-auto px-6 md:px-16 pt-32 md:pt-40 pb-24">
          {/* Back button */}
          <SkeletonBox className="h-4 w-28 mb-8" />

          {/* Header */}
          <div className="space-y-4 mb-10">
            <div className="flex gap-2">
              <SkeletonBox className="h-5 w-28 rounded" />
              <SkeletonBox className="h-5 w-24 rounded" />
            </div>
            <SkeletonBox className="h-12 md:h-16 w-3/4" />
            <SkeletonBox className="h-6 w-1/2" />
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y mb-12" style={{ borderColor: "var(--color-border)" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <SkeletonBox className="h-3 w-16" />
                <SkeletonBox className="h-4 w-28" />
              </div>
            ))}
          </div>

          {/* Hero Cover Image Skeleton */}
          <SkeletonBox className="w-full h-80 md:h-[480px] rounded mb-16" />

          {/* Content sections */}
          <div className="space-y-12 max-w-3xl">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <SkeletonBox className="h-6 w-40" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </article>
      </div>
    </PublicLayout>
  )
}
