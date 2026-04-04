import { Send } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { DispatchRunsTable } from "@/components/dispatch-runs-table";
import { Pagination } from "@/components/pagination";
import {
  getDispatchRuns,
  ITEMS_PER_PAGE,
} from "@/lib/queries/dispatch-runs";

export default async function DispatchPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { runs, total } = await getDispatchRuns({ page });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <h1 className="text-[30px] font-semibold leading-9">Disparos</h1>

      {runs.length > 0 ? (
        <>
          <DispatchRunsTable runs={runs} />
          <Pagination page={page} totalPages={totalPages} />
        </>
      ) : (
        <EmptyState
          icon={Send}
          title="Nenhum disparo registrado"
          description="O historico aparecera aqui apos o primeiro disparo de mensagens."
        />
      )}
    </div>
  );
}
