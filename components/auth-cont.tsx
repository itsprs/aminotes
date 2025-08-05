import { ShieldUserIcon } from "lucide-react"

export function AuthContainer({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="m-auto grid w-full grow grid-cols-1 gap-8 md:grid-cols-2">
      <section className="animate-in slide-in-from-left hidden flex-col justify-between rounded-lg bg-zinc-900 p-8 text-white duration-500 md:flex">
        <span className="w-fit text-lg font-medium">AmiNotes</span>
        <blockquote className="max-w-[400px] space-y-4">
          <p className="text-lg">
            Browse high-quality notes shared by students and verified by
            teachers — or contribute your own and help your peers succeed.
          </p>
          <footer className="text-sm">AmiNotes</footer>
        </blockquote>
      </section>
      <section className="animate-in fade-in zoom-in flex flex-col items-center justify-between gap-16 py-8 duration-500">
        <div className="max-w-sm text-pretty">
          <p className="flex items-center gap-2 text-lg font-medium tracking-tight">
            <ShieldUserIcon />
            {title}
          </p>
          <p className="text-muted-foreground mt-2 text-sm/6">{desc}</p>
        </div>
        {children}
        <p className="w-fit text-sm">
          Accidentally landed here? No worries —{" "}
          <a href="/" className="font-medium underline underline-offset-4">
            Back
          </a>
          .
        </p>
      </section>
    </div>
  )
}
