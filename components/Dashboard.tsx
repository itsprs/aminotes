"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/session-provider"
import { readDB } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./profile-form"

export function Dashboard() {
  const { session, logout } = useSession()
  const [userData, setUserData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  function handleLogout() {
    const confirmLogout = window.confirm("Are you sure you want to logout?")
    if (confirmLogout) {
      logout()
    }
  }

  useEffect(() => {
    async function fetchUser() {
      if (!session?.id) return
      const users = await readDB("users.json")
      const user = users.find((u: any) => u.id === session.id)
      if (user) setUserData(user)
      setLoading(false)
    }
    fetchUser()
  }, [session?.id])

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {session?.name}!</h1>
          <p className="text-muted-foreground">Role: {session?.role}</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {userData && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Edit Your Profile</h2>
          <ProfileForm initialData={userData} />
        </div>
      )}
    </div>
  )
}
