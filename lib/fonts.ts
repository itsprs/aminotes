import { Onest } from "next/font/google"

export const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
})

export const fontVariables = `${onest.variable}`
