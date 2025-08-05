"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { StorageUtil } from "@/lib/storage-util"

type UserSession = {
  id: string
  name: string
  email: string
  role: string
} | null

type SessionContextType = {
  session: UserSession
  setSession: (user: UserSession) => void
  logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<UserSession>(null)

  useEffect(() => {
    const stored = StorageUtil.get<UserSession>("session")
    setSessionState(stored)
  }, [])

  const setSession = (user: UserSession) => {
    if (user) StorageUtil.set("session", user)
    else StorageUtil.remove("session")
    setSessionState(user)
  }

  const logout = () => {
    StorageUtil.remove("session")
    setSessionState(null)
  }

  return (
    <SessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context)
    throw new Error("useSession must be used within SessionProvider")
  return context
}
