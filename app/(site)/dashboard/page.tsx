"use client"

import { AuthContainer } from "@/components/auth-cont"
import { Dashboard } from "@/components/Dashboard"
import { LoginForm } from "@/components/LoginForm"
import { useSession } from "@/lib/session-provider"

export default function DashboardPage() {
  const { session } = useSession()

  return (
    <>
      {session ? (
        <Dashboard />
      ) : (
        <AuthContainer
          title="Login to Your Account"
          desc="This is where the magic happens — but only for authorized wizards."
        >
          <LoginForm />
        </AuthContainer>
      )}
    </>
  )
}
