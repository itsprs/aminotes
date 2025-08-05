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
  } catch {
    return { success: false, message: "File not found or cannot be deleted" }
  }
}

function getDBPath(fileName: string) {
  return path.join(process.cwd(), "db", fileName)
}

export async function readDB<T = any>(fileName: string): Promise<T[]> {
  const filePath = getDBPath(fileName)
  const file = await fs.readFile(filePath, "utf-8")
  return JSON.parse(file) as T[]
}

export async function writeDB<T = any>(
  fileName: string,
  data: T[],
): Promise<void> {
  const filePath = getDBPath(fileName)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function findOne<T = any>(
  fileName: string,
  id: string,
): Promise<T | null> {
  const data = await readDB<T>(fileName)
  return data.find((item: any) => item.id === id) || null
}

export async function createOne<T = any>(
  fileName: string,
  newItem: T,
): Promise<T> {
  const data = await readDB<T>(fileName)
  data.push(newItem)
  await writeDB(fileName, data)
  return newItem
}

export async function updateOne<T = any>(
  fileName: string,
  id: string,
  updatedFields: Partial<T>,
): Promise<T | null> {
  const data = await readDB<T>(fileName)
  const index = data.findIndex((item: any) => item.id === id)
  if (index === -1) return null

  data[index] = { ...data[index], ...updatedFields }
  await writeDB(fileName, data)
  return data[index]
}

export async function deleteOne<T = any>(
  fileName: string,
  id: string,
): Promise<T | null> {
  const data = await readDB<T>(fileName)
  const index = data.findIndex((item: any) => item.id === id)
  if (index === -1) return null

  const [deletedItem] = data.splice(index, 1)
  await writeDB(fileName, data)
  return deletedItem
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const users = await readDB<any>("users.json")
  const user = users.find((u: any) => u.email === email && u.pwd === password)

  if (!user) return { success: false, message: "Invalid credentials" }

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.is_teacher ? "teacher" : "student",
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
