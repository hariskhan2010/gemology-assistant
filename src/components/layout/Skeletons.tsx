export function ChatSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface animate-pulse`} />
            <div className="max-w-2xl rounded-lg bg-surface px-4 py-3 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 w-64 rounded bg-surface-elevated" />
                <div className="h-4 w-48 rounded bg-surface-elevated" />
                <div className="h-4 w-56 rounded bg-surface-elevated" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-3 p-3">
      <div className="h-10 rounded-md bg-surface animate-pulse" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 rounded-md bg-surface animate-pulse" />
      ))}
    </div>
  );
}
