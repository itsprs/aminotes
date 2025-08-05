"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { BotIcon } from "lucide-react"
import ReCAPTCHA from "react-google-recaptcha"
import { cn } from "@/lib/utils"
import { CaptchaVerification } from "@/app/actions"

interface CaptchaProps<T> {
  children: (props: {
    submitForm: (values: T) => void
    isLoading: boolean
  }) => React.ReactNode
  onSubmit: (values: T) => Promise<void>
  className?: string
}

export function Captcha<T>({ children, onSubmit, className }: CaptchaProps<T>) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { resolvedTheme } = useTheme()

  const submitForm = async (values: T) => {
    if (!captchaToken) {
      setShowCaptcha(true)
      return
    }

    setIsLoading(true)

    const success = await CaptchaVerification(captchaToken)
    if (success) {
      setShowCaptcha(false)
      await onSubmit(values)
    } else {
      setCaptchaToken(null)
      setShowCaptcha(true)
    }

    setIsLoading(false)
  }

  return (
    <>
      {children({ submitForm, isLoading })}
      {showCaptcha && (
        <div className={cn("w-fit space-y-2", className)}>
          <span
            className={`text-sm ${
              !captchaToken ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <BotIcon size={18} className="mr-2 mb-1 inline" />
            Verify you&apos;re not a robot
          </span>
          <div
            className={`border border-dashed p-1 ${
              !captchaToken ? "border-destructive" : "border-border"
            }`}
          >
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RC_SITE_KEY!}
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              onChange={setCaptchaToken}
              onError={() => {
                setCaptchaToken(null)
                setShowCaptcha(true)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
