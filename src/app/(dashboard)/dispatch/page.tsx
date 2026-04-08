import { Send } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { DispatchRunsTable } from "@/components/dispatch-runs-table";
import { Pagination } from "@/components/pagination";
import { ToastTrigger } from "@/components/toast-trigger";
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

  let runs: Awaited<ReturnType<typeof getDispatchRuns>>["runs"] = [];
  let total = 0;
  let error = false;

  try {
    ({ runs, total } = await getDispatchRuns({ page }));
  } catch {
    error = true;
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      {error && (
        <ToastTrigger message="Não foi possível carregar os disparos. Tente novamente." />
      )}

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
          description="O histórico aparecerá aqui após o primeiro disparo de mensagens."
        />
      )}
    </div>
  );
}
