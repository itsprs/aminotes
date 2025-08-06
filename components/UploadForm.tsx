"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/session-provider"
import { uploadFile, createOne, readDB } from "@/app/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function UploadForm() {
  const { session } = useSession()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [department, setDepartment] = useState("")
  const [type, setType] = useState("")
  const [semester, setSemester] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([])
  const [types, setTypes] = useState<{ id: string; type: string }[]>([])

  useEffect(() => {
    async function fetchOptions() {
      const deptData = await readDB<{ id: string; name: string }>(
        "departments.json",
      )
      const typeData = await readDB<{ id: string; type: string }>("types.json")
      setDepartments(deptData)
      setTypes(typeData)
    }
    fetchOptions()
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return alert("Please login to upload")
    if (!file || !title || !description || !department || !type || !semester) {
      return alert("Please fill all fields and select a file")
    }

    const formData = new FormData()
    formData.append("file", file)
    const uploadRes = await uploadFile(formData)
    if (!uploadRes.success) return alert(uploadRes.message)

    const newItem = {
      id: `item_${Date.now()}`,
      title,
      description,
      tags: [],
      code: "",
      path: uploadRes.filename,
      created_at: new Date().toISOString(),
      type,
      uploaded_by: session.id,
      liked_by: [],
      verified_by: session.role === "teacher" ? [session.id] : [],
      department,
      year: new Date().getFullYear(),
      semester: parseInt(semester, 10),
    }

    await createOne("index.json", newItem)
    alert("File uploaded successfully")
    setTitle("")
    setDescription("")
    setDepartment("")
    setType("")
    setSemester("")
    setFile(null)
  }

  return (
    <form onSubmit={handleUpload} className="max-w-md space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger>
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={setType}>
        <SelectTrigger>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          {types.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={semester} onValueChange={setSemester}>
        <SelectTrigger>
          <SelectValue placeholder="Select Semester" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, i) => (
            <SelectItem key={i + 1} value={(i + 1).toString()}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button type="submit">Upload</Button>
    </form>
  )
}
