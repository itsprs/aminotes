import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { fontVariables } from "@/lib/fonts"
import { ThemeProvider } from "@/lib/theme-provider"
import { site } from "@/data/site"
import "@/app/globals.css"
import { SiteHeader } from "@/components/function/site-header"

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords || [],
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
          <SiteHeader />
          {children}
          <Toaster expand />
        </ThemeProvider>
      </body>
    </html>
  )
}
