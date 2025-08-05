"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { CircleUserRoundIcon, LogInIcon, UserPlusIcon } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/lib/session-provider"

export function Header() {
  const { session } = useSession()

  return (
    <header className="bg-background sticky top-0 z-50 container flex h-[var(--header-height)] items-center justify-between gap-2">
      <a href="/" className="text-lg font-medium">
        <span className="text-[#F6C015]">Ami</span>
        <span className="text-[#0e385f]">Notes</span>
      </a>
      <div className="flex items-center gap-2">
        {session ? (
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <CircleUserRoundIcon size={16} /> Dashboard
            </Link>
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <LogInIcon size={16} /> Login
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/register">
                <UserPlusIcon size={16} /> Register
              </Link>
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
