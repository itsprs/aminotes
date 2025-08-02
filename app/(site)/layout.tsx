import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="relative container flex min-h-[calc(100vh-var(--header-height))] grow flex-col items-center gap-[var(--space)] py-[var(--space)]">
      {children}
    </main>
  )
}
