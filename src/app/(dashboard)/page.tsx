import {
  getKpis,
  getLeadsByNiche,
  getLeadsByStatus,
  getLatestProspectingRun,
  getLatestDispatchRun,
} from "@/lib/queries/dashboard";
import type { Kpis, NicheRow } from "@/lib/queries/dashboard";
import type { LeadStatus } from "@/types/database";
import { KpiCards } from "@/components/kpi-cards";
import { LeadsByNicheTable } from "@/components/leads-by-niche-table";
import { StatusDistribution } from "@/components/status-distribution";
import { ToastTrigger } from "@/components/toast-trigger";

export default async function HomePage() {
  let kpis: Kpis = { total: 0, new: 0, contacted: 0, won: 0 };
  let niches: NicheRow[] = [];
  let statusCounts: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    follow_up: 0,
    won: 0,
    lost: 0,
    skipped: 0,
  };
  let error = false;

  try {
    [kpis, niches, statusCounts] =
      await Promise.all([
        getKpis(),
        getLeadsByNiche(),
        getLeadsByStatus(),
        getLatestProspectingRun(),
        getLatestDispatchRun(),
      ]);
  } catch {
    error = true;
  }

  const hasLeads = kpis.total > 0;

  return (
    <div className="space-y-10">
      {error && (
        <ToastTrigger message="Não foi possível carregar os dados do dashboard. Tente novamente." />
      )}

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
    </div>
  );
}
