"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { LeadStatus } from "@/types/database";

interface LeadsFiltersProps {
  niches: { slug: string; name: string }[];
  cities: string[];
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Novo" },
  { value: "contacted", label: "Contactado" },
  { value: "follow_up", label: "Follow-up" },
  { value: "won", label: "Ganho" },
  { value: "lost", label: "Perdido" },
  { value: "skipped", label: "Ignorado" },
];

export function LeadsFilters({ niches, cities }: LeadsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch(value: string) {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams("q", value);
    }, 300);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary pointer-events-none" />
        <Input
          placeholder="Buscar empresa..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={searchParams.get("niche") ?? ""}
        onChange={(e) => updateParams("niche", e.target.value)}
      >
        <option value="">Todos os nichos</option>
        {niches.map((n) => (
          <option key={n.slug} value={n.slug}>
            {n.name}
          </option>
        ))}
      </Select>

      <Select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateParams("status", e.target.value)}
      >
        <option value="">Todos os status</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      <Select
        value={searchParams.get("city") ?? ""}
        onChange={(e) => updateParams("city", e.target.value)}
      >
        <option value="">Todas as cidades</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </Select>
    </div>
  );
}
