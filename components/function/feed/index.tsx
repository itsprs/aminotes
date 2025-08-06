"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { readDB, updateOne } from "@/app/actions"
import { useSession } from "@/lib/session-provider"
import { HeartIcon, BadgeCheckIcon } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MultiSelectCombo } from "@/components/MultiSelectCombo"

export function Feed() {
  const { session } = useSession()
  const [items, setItems] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [types, setTypes] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [filters, setFilters] = useState({
    department: "",
    type: "",
    semester: "",
    tags: [] as { value: string; label: string }[],
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"likes" | "recent">("likes")

  useEffect(() => {
    async function fetchData() {
      const [itemsData, deptData, typeData, usersData] = await Promise.all([
        readDB("index.json"),
        readDB("departments.json"),
        readDB("types.json"),
        readDB("users.json"),
      ])
      setItems(itemsData)
      setDepartments(deptData)
      setTypes(typeData)
      setUsers(usersData)
    }
    fetchData()
  }, [])

  const uniqueTags = Array.from(
    new Set(items.flatMap((item) => item.tags)),
  ).sort()
  const tagOptions = uniqueTags.map((tag) => ({ value: tag, label: tag }))

  const filteredItems = items
    .filter((item) => {
      const deptMatch = filters.department
        ? item.department === filters.department
        : true
      const typeMatch = filters.type ? item.type === filters.type : true
      const semMatch = filters.semester
        ? item.semester.toString() === filters.semester
        : true
      const selectedTagValues = filters.tags.map((t) => t.value)
      const tagMatch =
        selectedTagValues.length > 0
          ? selectedTagValues.every((tag) => item.tags.includes(tag))
          : true
      const searchMatch = searchQuery
        ? item.title.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchQuery),
          )
        : true
      return deptMatch && typeMatch && semMatch && tagMatch && searchMatch
    })
    .sort((a, b) => {
      if (sortBy === "likes") return b.liked_by.length - a.liked_by.length
      else return b.created_at - a.created_at
    })

  const handleLike = async (itemId: string) => {
    if (!session) {
      alert("Please login to like items.")
      return
    }
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const liked = item.liked_by.includes(session.id)
        const newLikes = liked
          ? item.liked_by.filter((uid: string) => uid !== session.id)
          : [...item.liked_by, session.id]
        return { ...item, liked_by: newLikes }
      }
      return item
    })
    setItems(updatedItems)
    await updateOne("index.json", itemId, {
      liked_by: updatedItems.find((i) => i.id === itemId)?.liked_by || [],
    })
  }

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search notes..."
          className="w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />

        <Select
          onValueChange={(v) => setSortBy(v as "likes" | "recent")}
          value={sortBy}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          onValueChange={(v) => setFilters((f) => ({ ...f, department: v }))}
          value={filters.department}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d: any) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) => setFilters((f) => ({ ...f, type: v }))}
          value={filters.type}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((t: any) => (
              <SelectItem key={t.id} value={t.id}>
                {t.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) => setFilters((f) => ({ ...f, semester: v }))}
          value={filters.semester}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <MultiSelectCombo
        options={tagOptions}
        selected={filters.tags}
        onChange={(selectedTags: { value: string; label: string }[]) =>
          setFilters((f) => ({ ...f, tags: selectedTags }))
        }
        placeholder="Filter by Tags"
        className="mb-12 w-full md:w-1/2"
      />

      {filteredItems.length === 0 && <p>No items found.</p>}

      {filteredItems.map((item) => {
        const uploader = users.find((u: any) => u.id === item.uploaded_by)
        const dept = departments.find((d: any) => d.id === item.department)
        const type = types.find((t: any) => t.id === item.type)
        const isLiked = session ? item.liked_by.includes(session.id) : false

        return (
          <Card key={item.id} className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {item.title}
                {item.verified_by.length > 0 && (
                  <BadgeCheckIcon size={18} className="text-green-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>{item.description}</p>
              <div className="text-muted-foreground text-sm">
                <span>{type?.type}</span> ● <span>{dept?.name}</span> ● Semester{" "}
                {item.semester}
              </div>
              <div className="flex items-center gap-2 text-sm">
                Uploaded by:{" "}
                <span className="font-medium">
                  {uploader?.name || "Unknown"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {item.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={`/uploads/${item.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant={isLiked ? "default" : "outline"}
                  onClick={() => handleLike(item.id)}
                >
                  <HeartIcon
                    size={16}
                    className={isLiked ? "fill-red-500 text-red-500" : ""}
                  />
                  <span className="ml-1 text-xs">{item.liked_by.length}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
