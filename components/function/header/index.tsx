"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { CurrentUserDropdown } from "./current-user-dropdown"
import Link from "next/link"
import { useSession } from "@/lib/session-provider"
import { Button } from "@/components/ui/button"

export function Header() {
  const session = useSession()

  return (
    <header className="sticky top-0 z-50 container flex h-[var(--header-height)] items-center justify-between gap-2">
      <a href="/" className="text-lg font-medium">
        <span className="text-[#F6C015]">Ami</span>
        <span className="text-[#0e385f]">Notes</span>
      </a>
      <div className="flex items-center gap-2">
        {session ? (
          <CurrentUserDropdown email={session.email} />
        ) : (
          <Button variant={"ghost"} size={"sm"} asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
