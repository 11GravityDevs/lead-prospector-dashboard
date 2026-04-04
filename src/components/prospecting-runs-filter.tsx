"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { formatSlug } from "@/lib/format";

interface ProspectingRunsFilterProps {
  niches: { slug: string }[];
}

export function ProspectingRunsFilter({
  niches,
}: ProspectingRunsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateNiche(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("niche", value);
    } else {
      params.delete("niche");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <Select
        value={searchParams.get("niche") ?? ""}
        onChange={(e) => updateNiche(e.target.value)}
      >
        <option value="">Todos os nichos</option>
        {niches.map((n) => (
          <option key={n.slug} value={n.slug}>
            {formatSlug(n.slug)}
          </option>
        ))}
      </Select>
    </div>
  );
}
