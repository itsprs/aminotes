"use client"

import { useSession } from "@/lib/session-provider"

export function DashboardContent() {
  const { session, logout } = useSession()

  function handleLogout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?")
    if (confirmLogout) {
      logout()
    }
  }

  return (
    <div>
      <h1>Welcome, {session?.name}!</h1>
      <p>Role: {session?.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
