import { Users, SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { LeadsFilters } from "@/components/leads-filters";
import { LeadsTable } from "@/components/leads-table";
import { Pagination } from "@/components/pagination";
import { ToastTrigger } from "@/components/toast-trigger";
import {
  getLeads,
  getNichesForFilter,
  ITEMS_PER_PAGE,
} from "@/lib/queries/leads";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    niche?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  let leads: Awaited<ReturnType<typeof getLeads>>["leads"] = [];
  let total = 0;
  let niches: Awaited<ReturnType<typeof getNichesForFilter>> = [];
  let error = false;

  try {
    [{ leads, total }, niches] = await Promise.all([
      getLeads({
        q: params.q,
        niche: params.niche,
        status: params.status,
        page,
      }),
      getNichesForFilter(),
    ]);
  } catch {
    error = true;
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const hasFilters = !!(params.q || params.niche || params.status);

  return (
    <div className="space-y-6">
      {error && (
        <ToastTrigger message="Nao foi possivel carregar os leads. Tente novamente." />
      )}

      <h1 className="text-[30px] font-semibold leading-9">Leads</h1>

      <LeadsFilters niches={niches} />

      {leads.length > 0 ? (
        <>
          <LeadsTable leads={leads} niches={niches} />
          <Pagination page={page} totalPages={totalPages} />
        </>
      ) : hasFilters ? (
        <EmptyState
          icon={SearchX}
          title="Nenhum resultado"
          description="Tente ajustar os filtros ou o termo de busca."
        />
      ) : (
        <EmptyState
          icon={Users}
          title="Nenhum lead encontrado"
          description="Os leads aparecerao aqui apos a primeira execucao da pipeline."
        />
      )}
    </div>
  );
}
