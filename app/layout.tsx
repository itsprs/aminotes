import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { fontVariables } from "@/lib/fonts"
import { ThemeProvider } from "@/lib/theme-provider"
import "@/app/globals.css"
import { Header } from "@/components/function/header"
import { SessionProvider } from "@/lib/session-provider"

export const metadata: Metadata = {
  title: {
    default: "AmiNotes",
    template: `%s | AmiNotes`,
  },
  description: "Notes You Can Trust. From Students. Verified by Teachers.",
  keywords: ["Education", "Study", "Notes", "AmiNotes", "Amity"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`flex min-h-screen flex-col overscroll-none scroll-smooth font-sans antialiased ${fontVariables}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Header />
            {children}
          </SessionProvider>
          <Toaster expand />
        </ThemeProvider>
      </body>
    </html>
  )
}
