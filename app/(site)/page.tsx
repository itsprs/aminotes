import { Feed } from "@/components/function/feed"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <>
      <section className="space-y-4 text-center">
        <Badge>Explore</Badge>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          AmiNotes
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
          Notes You Can Trust. From Students. Verified by Teachers.
          <br /> — Notes that Matter. From People Who Care.
        </p>
      </section>
      <Feed />
    </>
  )
}
