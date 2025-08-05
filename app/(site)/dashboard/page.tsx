"use client"

import { AuthContainer } from "@/components/auth-cont"
import { DashboardContent } from "@/components/DashboardContent"
import { LoginForm } from "@/components/LoginForm"
import { useSession } from "@/lib/session-provider"

export default function DashboardPage() {
  const { session } = useSession()

  return (
    <>
      {session ? (
        <DashboardContent />
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
