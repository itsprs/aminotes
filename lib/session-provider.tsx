"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { StorageUtil } from "@/lib/storage-util"

type SessionType = { email: string; role: string } | null

const SessionContext = createContext<SessionType>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionType>(null)

  useEffect(() => {
    const storedSession = StorageUtil.get<SessionType>("session")
    setSession(storedSession)
  }, [])

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
