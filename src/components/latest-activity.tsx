import { Radar, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { RunStatus } from "@/types/database";

interface ProspectingData {
  finished_at: string | null;
  niche_slug: string;
  city_name: string | null;
  total_new: number;
  run_status: RunStatus;
}

interface DispatchData {
  finished_at: string | null;
  total_sent: number;
  total_errors: number;
}

export function LatestActivity({
  prospecting,
  dispatch,
}: {
  prospecting: ProspectingData | null;
  dispatch: DispatchData | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <div className="flex items-center gap-2 text-text-secondary mb-4">
          <Radar size={16} strokeWidth={1.5} />
          <span className="text-xs font-medium">Ultima Prospecção</span>
        </div>
        {prospecting ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Data</span>
              <span>
                {prospecting.finished_at
                  ? formatDate(prospecting.finished_at)
                  : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Nicho</span>
              <span>{prospecting.niche_slug}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Cidade</span>
              <span>{prospecting.city_name ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Leads novos</span>
              <span className="tabular-nums">{prospecting.total_new}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Status</span>
              <Badge variant={prospecting.run_status} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">
            Nenhuma execucao registrada
          </p>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 text-text-secondary mb-4">
          <Send size={16} strokeWidth={1.5} />
          <span className="text-xs font-medium">Ultimo Disparo</span>
        </div>
        {dispatch ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Data</span>
              <span>
                {dispatch.finished_at
                  ? formatDate(dispatch.finished_at)
                  : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Enviados</span>
              <span className="tabular-nums">{dispatch.total_sent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Erros</span>
              <span
                className={`tabular-nums ${dispatch.total_errors > 0 ? "text-error" : ""}`}
              >
                {dispatch.total_errors}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">
            Nenhum disparo registrado
          </p>
        )}
      </Card>
    </div>
  );
}
