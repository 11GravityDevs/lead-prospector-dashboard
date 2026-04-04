import { Radar, SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ProspectingRunsFilter } from "@/components/prospecting-runs-filter";
import { ProspectingRunsTable } from "@/components/prospecting-runs-table";
import { Pagination } from "@/components/pagination";
import {
  getProspectingRuns,
  ITEMS_PER_PAGE,
} from "@/lib/queries/prospecting-runs";
import { getNichesForFilter } from "@/lib/queries/leads";

export default async function ProspectingPage({
  searchParams,
}: {
  searchParams: Promise<{
    niche?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ runs, total }, niches] = await Promise.all([
    getProspectingRuns({ niche: params.niche, page }),
    getNichesForFilter(),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const hasFilters = !!params.niche;

  return (
    <div className="space-y-6">
      <h1 className="text-[30px] font-semibold leading-9">Prospeccao</h1>

      <ProspectingRunsFilter niches={niches} />

      {runs.length > 0 ? (
        <>
          <ProspectingRunsTable runs={runs} />
          <Pagination page={page} totalPages={totalPages} />
        </>
      ) : hasFilters ? (
        <EmptyState
          icon={SearchX}
          title="Nenhum resultado"
          description="Tente ajustar o filtro de nicho."
        />
      ) : (
        <EmptyState
          icon={Radar}
          title="Nenhuma execucao registrada"
          description="O historico aparecera aqui apos a primeira execucao da pipeline."
        />
      )}
    </div>
  );
}
