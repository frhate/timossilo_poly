"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface Wilaya {
  id: string
  code: string
  name: string
  ar_name: string
}

interface Commune {
  id: string
  post_code: string
  name: string
  ar_name: string
  wilaya_id: string
}

export interface LocationSelection {
  wilayaId: string
  wilayaName: string
  communeId: string
  communeName: string
  postCode: string
}

interface LocationSelectProps {
  value: LocationSelection | null
  onChange: (value: LocationSelection | null) => void
  defaultCity?: string
  defaultZip?: string
  disabled?: boolean
}

function stripBom(text: string) {
  return text.replace(/^\uFEFF/, "")
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (${res.status})`)
  }
  const text = await res.text()
  if (text.trimStart().startsWith("<")) {
    throw new Error(`Expected JSON from ${url} but received HTML`)
  }
  return JSON.parse(stripBom(text)) as T
}

export default function LocationSelect({
  value,
  onChange,
  defaultCity,
  defaultZip,
  disabled,
}: LocationSelectProps) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [communes, setCommunes] = useState<Commune[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [wilayaOpen, setWilayaOpen] = useState(false)
  const [communeOpen, setCommuneOpen] = useState(false)
  const didResolveDefault = useRef(false)

  useEffect(() => {
    let mounted = true

    Promise.all([
      fetchJson<Wilaya[]>("/algeria-willaya-communes/wilayas.json"),
      fetchJson<Commune[]>("/algeria-willaya-communes/communes.json"),
    ])
      .then(([wilayaData, communeData]) => {
        if (!mounted) return
        setWilayas(wilayaData)
        setCommunes(communeData)
      })
      .catch((error) => {
        console.error("Failed to load wilaya/commune data:", error)
        if (mounted) {
          setLoadError("Impossible de charger la liste des wilayas et communes.")
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // Pre-select the saved profile location once the data is available.
  useEffect(() => {
    if (didResolveDefault.current || loading || value || !defaultCity) {
      if (!loading && !value && !defaultCity) didResolveDefault.current = true
      return
    }

    const parts = defaultCity.split(",").map((part) => part.trim())
    const communeName = parts[0]?.toLowerCase() ?? ""
    const wilayaName = parts[1]?.toLowerCase() ?? ""

    let commune =
      defaultZip
        ? communes.find(
            (item) =>
              item.post_code === defaultZip.trim() &&
              item.name.toLowerCase() === communeName,
          )
        : undefined

    commune ??= communes.find((item) => {
      if (item.name.toLowerCase() !== communeName) return false
      if (!wilayaName) return true
      const wilaya = wilayas.find((w) => w.id === item.wilaya_id)
      return wilaya?.name.toLowerCase() === wilayaName
    })

    commune ??= communes.find(
      (item) => item.name.toLowerCase() === communeName,
    )

    if (commune) {
      const wilaya = wilayas.find((w) => w.id === commune!.wilaya_id)
      if (wilaya) {
        onChange({
          wilayaId: wilaya.id,
          wilayaName: wilaya.name,
          communeId: commune.id,
          communeName: commune.name,
          postCode: commune.post_code,
        })
      }
    }

    didResolveDefault.current = true
  }, [loading, communes, wilayas, defaultCity, defaultZip, value, onChange])

  const selectedWilaya = useMemo(
    () => wilayas.find((wilaya) => wilaya.id === value?.wilayaId) ?? null,
    [wilayas, value?.wilayaId],
  )

  const selectedCommune = useMemo(
    () => communes.find((commune) => commune.id === value?.communeId) ?? null,
    [communes, value?.communeId],
  )

  const filteredCommunes = useMemo(
    () =>
      value?.wilayaId
        ? communes.filter((commune) => commune.wilaya_id === value.wilayaId)
        : [],
    [communes, value?.wilayaId],
  )

  const handleWilayaSelect = (wilaya: Wilaya) => {
    onChange({
      wilayaId: wilaya.id,
      wilayaName: wilaya.name,
      communeId: "",
      communeName: "",
      postCode: "",
    })
    setWilayaOpen(false)
  }

  const handleCommuneSelect = (commune: Commune) => {
    const wilaya = wilayas.find((item) => item.id === commune.wilaya_id)
    if (!wilaya) return
    onChange({
      wilayaId: wilaya.id,
      wilayaName: wilaya.name,
      communeId: commune.id,
      communeName: commune.name,
      postCode: commune.post_code,
    })
    setCommuneOpen(false)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm sm:text-base">Wilaya *</Label>
          <Popover open={wilayaOpen} onOpenChange={setWilayaOpen}>
            <PopoverTrigger asChild>
              <Button
                id="wilaya"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={wilayaOpen}
                disabled={disabled || loading}
                className="mt-1.5 h-10 sm:h-11 w-full justify-between font-normal"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement...
                  </span>
                ) : selectedWilaya ? (
                  <span className="truncate">{selectedWilaya.name}</span>
                ) : (
                  <span className="text-muted-foreground">Sélectionnez une wilaya</span>
                )}
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher une wilaya..." />
                <CommandList className="max-h-64">
                  <CommandEmpty>Aucune wilaya trouvée.</CommandEmpty>
                  <CommandGroup>
                    {wilayas.map((wilaya) => (
                      <CommandItem
                        key={wilaya.id}
                        value={`${wilaya.code}:${wilaya.name}:${wilaya.ar_name}`}
                        onSelect={() => handleWilayaSelect(wilaya)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value?.wilayaId === wilaya.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="flex-1">{wilaya.name}</span>
                        <span className="text-xs text-muted-foreground">{wilaya.ar_name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="text-sm sm:text-base">Commune *</Label>
          <Popover open={communeOpen} onOpenChange={setCommuneOpen}>
            <PopoverTrigger asChild>
              <Button
                id="commune"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={communeOpen}
                disabled={disabled || loading || !value?.wilayaId}
                className="mt-1.5 h-10 sm:h-11 w-full justify-between font-normal"
              >
                {selectedCommune ? (
                  <span className="truncate">{selectedCommune.name}</span>
                ) : (
                  <span className="text-muted-foreground">
                    {value?.wilayaId
                      ? "Sélectionnez une commune"
                      : "Choisissez d'abord la wilaya"}
                  </span>
                )}
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher une commune..." />
                <CommandList className="max-h-64">
                  <CommandEmpty>Aucune commune trouvée.</CommandEmpty>
                  <CommandGroup>
                    {filteredCommunes.map((commune) => (
                      <CommandItem
                        key={commune.id}
                        value={`${commune.id}:${commune.name}:${commune.ar_name}:${commune.post_code}`}
                        onSelect={() => handleCommuneSelect(commune)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value?.communeId === commune.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="flex-1">{commune.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {commune.post_code}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loadError && (
        <p className="text-xs text-red-600">
          {loadError} Veuillez recharger la page.
        </p>
      )}

      {selectedCommune && (
        <p className="text-xs text-muted-foreground">
          Commune de {selectedCommune.name}, wilaya de {value?.wilayaName} — code postal{" "}
          <span className="font-medium text-foreground">{selectedCommune.post_code}</span>
        </p>
      )}
    </div>
  )
}
