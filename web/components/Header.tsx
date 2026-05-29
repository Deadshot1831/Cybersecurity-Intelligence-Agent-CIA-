import { ShieldHalf } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3.5">
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-xl border border-border-strong bg-panel text-accent shadow-[0_0_18px_-6px_var(--color-accent)]"
        >
          <ShieldHalf className="size-5" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[0.95rem] font-semibold leading-tight text-fg">
            Cybersecurity Intelligence Agent
          </h1>
          <p className="truncate text-xs text-fg-subtle">
            Autonomous threat-intel crew &middot; CrewAI &middot; Groq &middot; Exa
          </p>
        </div>
        <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-border bg-panel px-3 py-1 text-xs font-medium text-fg-muted sm:inline-flex">
          <span className="size-1.5 rounded-full bg-medium" aria-hidden />
          Stubbed backend
        </span>
      </div>
    </header>
  );
}
