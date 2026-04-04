import { Users, UserPlus, MessageSquare, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Kpis } from "@/lib/queries/dashboard";

const CARDS = [
  { label: "Total de Leads", key: "total" as const, icon: Users },
  { label: "Novos", key: "new" as const, icon: UserPlus },
  { label: "Contatados", key: "contacted" as const, icon: MessageSquare },
  { label: "Ganhos", key: "won" as const, icon: Trophy },
];

export function KpiCards({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {CARDS.map(({ label, key, icon: Icon }) => (
        <Card key={key}>
          <div className="flex items-center gap-2 text-text-secondary mb-3">
            <Icon size={16} strokeWidth={1.5} />
            <span className="text-xs font-medium">{label}</span>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{kpis[key]}</p>
        </Card>
      ))}
    </div>
  );
}
