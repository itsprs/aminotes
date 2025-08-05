"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Captcha } from "@/components/captcha"
import { schemaAuth, type TypeAuth } from "@/lib/schema"
import { loginUser } from "@/app/actions"
import { useSession } from "@/lib/session-provider"

export function LoginForm() {
  const { setSession } = useSession()

  const form = useForm<TypeAuth>({
    resolver: zodResolver(schemaAuth),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleAuthSubmit(values: TypeAuth) {
    const formData = new FormData()
    formData.append("email", values.email)
    formData.append("password", values.password)

    const res = await loginUser(formData)
    if (res.success && res.user) {
      setSession(res.user)
      form.reset()
    } else {
      form.setError("email", { message: "Invalid credentials" })
    }
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <Captcha<TypeAuth> onSubmit={handleAuthSubmit}>
        {({ submitForm, isLoading }) => (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="grid space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Login"}
              </Button>
            </form>
          </Form>
        )}
      </Captcha>
    </div>
  )
}
