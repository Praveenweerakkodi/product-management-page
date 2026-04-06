export function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-44 bg-muted" />
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 bg-muted rounded-md" />
        <div className="h-4 w-3/4 bg-muted rounded-md" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-muted rounded-md" />
          <div className="h-3 w-2/3 bg-muted rounded-md" />
        </div>
        <div className="h-3 w-28 bg-muted rounded-md" />
      </div>
      {/* Action bar */}
      <div className="flex gap-2 px-4 py-3 border-t border-border">
        <div className="h-7 w-16 bg-muted rounded-md ml-auto" />
        <div className="h-7 w-16 bg-muted rounded-md" />
      </div>
    </div>
  );
}
