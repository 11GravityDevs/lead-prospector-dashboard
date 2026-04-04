import { LayoutGrid } from "lucide-react";
import {
  getKpis,
  getLeadsByNiche,
  getLeadsByStatus,
  getLatestProspectingRun,
  getLatestDispatchRun,
} from "@/lib/queries/dashboard";
import { KpiCards } from "@/components/kpi-cards";
import { LeadsByNicheTable } from "@/components/leads-by-niche-table";
import { StatusDistribution } from "@/components/status-distribution";
import { LatestActivity } from "@/components/latest-activity";
import { EmptyState } from "@/components/empty-state";

export default async function HomePage() {
  const [kpis, niches, statusCounts, latestProspecting, latestDispatch] =
    await Promise.all([
      getKpis(),
      getLeadsByNiche(),
      getLeadsByStatus(),
      getLatestProspectingRun(),
      getLatestDispatchRun(),
    ]);

  const hasLeads = kpis.total > 0;
  const hasActivity = latestProspecting !== null || latestDispatch !== null;

  return (
    <div className="space-y-10">
      <h1 className="text-[30px] font-semibold leading-9">Dashboard</h1>

      <KpiCards kpis={kpis} />

      {hasLeads && (
        <>
          <section>
            <h2 className="text-[20px] font-semibold leading-7 mb-6">
              Leads por nicho
            </h2>
            <LeadsByNicheTable niches={niches} />
          </section>

          <section>
            <h2 className="text-[20px] font-semibold leading-7 mb-6">
              Leads por status
            </h2>
            <StatusDistribution counts={statusCounts} />
          </section>
        </>
      )}

      {hasActivity ? (
        <section>
          <h2 className="text-[20px] font-semibold leading-7 mb-6">
            Ultima atividade
          </h2>
          <LatestActivity
            prospecting={latestProspecting}
            dispatch={latestDispatch}
          />
        </section>
      ) : (
        <EmptyState
          icon={LayoutGrid}
          title="Nenhum dado ainda"
          description="Aguardando a primeira execucao da pipeline de prospeccao."
        />
      )}
    </div>
  );
}
