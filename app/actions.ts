"use server"

import { writeFile, unlink } from "fs/promises"
import path from "path"
import fs from "fs/promises"

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File
  if (!file || file.size === 0)
    return { success: false, message: "No file selected" }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadPath = path.join(process.cwd(), "public", "uploads", file.name)
  await writeFile(uploadPath, buffer)

  return {
    success: true,
    message: "File uploaded successfully",
    filename: file.name,
  }
}

export async function deleteFile(filename: string) {
  const filePath = path.join(process.cwd(), "public", "uploads", filename)

  try {
    await unlink(filePath)
    return { success: true, message: "File deleted successfully" }
  } catch (error) {
    return { success: false, message: "File not found or cannot be deleted" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const filePath = path.join(process.cwd(), "db", "users.json")
  const data = await fs.readFile(filePath, "utf-8")
  const users = JSON.parse(data)

  const user = users.find((u: any) => u.email === email && u.pwd === password)
  if (!user) return { success: false, message: "Invalid credentials" }

  const isTeacher =
    user.is_teacher &&
    Object.values(user.is_teacher).some((v) => Array.isArray(v) && v.length > 0)

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: isTeacher ? "teacher" : "student",
    },
  }
}

export async function CaptchaVerification(
  captchaResponse: string,
): Promise<boolean> {
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RC_SECRET_KEY || "",
        response: captchaResponse,
      }),
    })
    const { success } = await res.json()
    return !!success
  } catch {
    return false
  }
}
