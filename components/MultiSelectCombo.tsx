"use client"

import * as React from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

interface MultiSelectComboProps {
  options: Option[]
  selected: Option[]
  onChange: (opts: Option[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelectCombo({
  options,
  selected,
  onChange,
  placeholder = "Select",
  className,
}: MultiSelectComboProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const toggleOption = (opt: Option) => {
    if (selected.some((s) => s.value === opt.value)) {
      onChange(selected.filter((s) => s.value !== opt.value))
    } else {
      onChange([...selected, opt])
    }
  }

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) setSearch("")
      }}
    >
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex min-h-10 cursor-pointer flex-wrap gap-2 rounded border px-3 py-2",
            !selected.length && "text-muted-foreground",
            className,
          )}
        >
          {selected.length ? (
            selected.map((opt) => (
              <Badge key={opt.value} variant="secondary">
                {opt.label}
              </Badge>
            ))
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={() => toggleOption(opt)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.some((s) => s.value === opt.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
