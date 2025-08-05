"use client"

import { useEffect, useState } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MultiSelectCombo } from "@/components/MultiSelectCombo"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { readDB, createOne, updateOne } from "@/app/actions"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  pwd: z.string().min(6, "Password must be at least 6 characters"),
  departments: z.array(z.string()).nonempty("Select at least one department"),
  semester: z.string().min(1, "Select a semester"),
  role: z.enum(["student", "teacher"]),
  is_verifier: z.boolean().optional(),
})

type ProfileValues = z.infer<typeof profileSchema>

type ProfileFormProps = {
  userId?: string
  initialData?: Partial<ProfileValues>
}

export function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      pwd: initialData?.pwd || "",
      departments: initialData?.departments || [],
      semester: initialData?.semester || "",
      role: initialData?.role || "student",
      is_verifier: initialData?.is_verifier || false,
    },
  })

  const [deptOptions, setDeptOptions] = useState<
    { label: string; value: string }[]
  >([])
  const role = useWatch({ control: form.control, name: "role" })

  useEffect(() => {
    async function fetchDepts() {
      const data = await readDB<{ id: string; name: string }>(
        "departments.json",
      )
      setDeptOptions(data.map((d) => ({ label: d.name, value: d.id })))
    }
    fetchDepts()
  }, [])

  async function onSubmit(values: ProfileValues) {
    const payload = {
      ...values,
      is_teacher: values.role === "teacher",
    }
    delete (payload as any).role

    const allUsers = await readDB<any>("users.json")

    if (!userId) {
      const emailExists = allUsers.some((u: any) => u.email === values.email)
      if (emailExists) {
        alert("A user with this email already exists.")
        return
      }

      const newUser = {
        id: "user_" + Date.now(),
        files: [],
        saved: [],
        liked_by: [],
        created_at: new Date().toISOString(),
        ...payload,
      }

      await createOne("users.json", newUser)
      alert("User created successfully.")
      form.reset()
    } else {
      await updateOne("users.json", userId, payload)
      alert("User updated successfully.")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  type="email"
                  {...field}
                  disabled={!!userId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pwd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={form.control}
          name="departments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departments</FormLabel>
              <FormControl>
                <MultiSelectCombo
                  options={deptOptions}
                  selected={deptOptions.filter((o) =>
                    field.value.includes(o.value),
                  )}
                  onChange={(opts) => field.onChange(opts.map((o) => o.value))}
                  placeholder="Select departments"
                  className="max-w-sm min-w-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel>Student</FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="teacher" />
                    </FormControl>
                    <FormLabel>Teacher</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {role === "teacher" && (
          <FormField
            control={form.control}
            name="is_verifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verifier</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(v) => field.onChange(v === "true")}
                    value={field.value ? "true" : "false"}
                    className="flex space-x-4"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel>Yes</FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel>No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="mt-4 w-full">
          Submit
        </Button>
      </form>
    </Form>
  )
}
