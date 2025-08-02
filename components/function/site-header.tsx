import { ThemeToggle } from "../theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 container flex h-[var(--header-height)] items-center justify-between gap-2">
      <a href="/" className="text-lg font-medium">
        <span className="text-[#F6C015]">Ami</span>
        <span className="text-[#0e385f]">Notes</span>
      </a>
      <ThemeToggle />
    </header>
  )
}
