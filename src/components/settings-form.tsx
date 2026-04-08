"use client";

import { type FormEvent, useMemo, useState, useTransition } from "react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { saveSettings } from "@/lib/actions/settings";
import { Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

interface SelectOption {
  value: string;
  label: string;
}

interface FieldConfig {
  key: string;
  label: string;
  description: string;
  isMs: boolean;
  isCron?: boolean;
  unit?: string;
  options: SelectOption[];
}

interface SectionConfig {
  title: string;
  fields: FieldConfig[];
}

const SECTIONS: SectionConfig[] = [
  {
    title: "Agendamento",
    fields: [
      {
        key: "whatsapp_cron",
        label: "Cron de disparo WhatsApp",
        description: "Quando as mensagens de WhatsApp serão enviadas",
        isMs: false,
        isCron: true,
        options: [
          { value: "0 9 * * 1-5", label: "Dias úteis às 09:00" },
          { value: "0 10 * * 1-5", label: "Dias úteis às 10:00" },
          { value: "0 14 * * 1-5", label: "Dias úteis às 14:00" },
          { value: "0 9,14 * * 1-5", label: "Dias úteis às 09:00 e 14:00" },
          { value: "0 10 * * *", label: "Todo dia às 10:00" },
          { value: "0 */4 * * *", label: "A cada 4 horas" },
        ],
      },
      {
        key: "scheduler_poll_interval_ms",
        label: "Intervalo do scheduler",
        description: "Frequência com que o scheduler verifica mudanças nas configurações",
        isMs: true,
        options: [
          { value: "30", label: "30 segundos" },
          { value: "60", label: "1 minuto" },
          { value: "120", label: "2 minutos" },
          { value: "300", label: "5 minutos" },
          { value: "600", label: "10 minutos" },
        ],
      },
    ],
  },
  {
    title: "Disparo WhatsApp",
    fields: [
      {
        key: "leads_per_dispatch",
        label: "Leads por disparo",
        description: "Quantidade de leads contatados por nicho em cada execução",
        isMs: false,
        unit: "leads",
        options: [
          { value: "5", label: "5 leads" },
          { value: "10", label: "10 leads" },
          { value: "15", label: "15 leads" },
          { value: "20", label: "20 leads" },
          { value: "25", label: "25 leads" },
          { value: "50", label: "50 leads" },
          { value: "100", label: "100 leads" },
        ],
      },
      {
        key: "whatsapp_delay_min_ms",
        label: "Delay mínimo entre mensagens",
        description: "Tempo mínimo de espera entre envios",
        isMs: true,
        options: [
          { value: "30", label: "30 segundos" },
          { value: "60", label: "1 minuto" },
          { value: "90", label: "1 minuto e 30 segundos" },
          { value: "120", label: "2 minutos" },
          { value: "180", label: "3 minutos" },
          { value: "240", label: "4 minutos" },
          { value: "300", label: "5 minutos" },
        ],
      },
      {
        key: "whatsapp_delay_max_ms",
        label: "Delay máximo entre mensagens",
        description: "Tempo máximo de espera entre envios",
        isMs: true,
        options: [
          { value: "60", label: "1 minuto" },
          { value: "120", label: "2 minutos" },
          { value: "180", label: "3 minutos" },
          { value: "240", label: "4 minutos" },
          { value: "300", label: "5 minutos" },
          { value: "600", label: "10 minutos" },
          { value: "900", label: "15 minutos" },
        ],
      },
      {
        key: "evolution_typing_min_ms",
        label: "Digitação mínima",
        description: "Tempo mínimo de simulação de digitação",
        isMs: true,
        options: [
          { value: "1", label: "1 segundo" },
          { value: "2", label: "2 segundos" },
          { value: "3", label: "3 segundos" },
          { value: "5", label: "5 segundos" },
        ],
      },
      {
        key: "evolution_typing_max_ms",
        label: "Digitação máxima",
        description: "Tempo máximo de simulação de digitação",
        isMs: true,
        options: [
          { value: "3", label: "3 segundos" },
          { value: "5", label: "5 segundos" },
          { value: "8", label: "8 segundos" },
          { value: "10", label: "10 segundos" },
          { value: "15", label: "15 segundos" },
        ],
      },
    ],
  },
];

const MIN_MAX_PAIRS: [string, string][] = [
  ["whatsapp_delay_min_ms", "whatsapp_delay_max_ms"],
  ["evolution_typing_min_ms", "evolution_typing_max_ms"],
];

function toDisplayValue(dbValue: string, isMs: boolean): string {
  if (!isMs) return dbValue;
  const num = parseInt(dbValue, 10);
  if (isNaN(num)) return dbValue;
  return String(num / 1000);
}

function toDbValue(displayValue: string, isMs: boolean): string {
  if (!isMs) return displayValue;
  const num = parseFloat(displayValue);
  if (isNaN(num)) return displayValue;
  return String(num * 1000);
}

function buildInitialValues(
  settings: Record<string, string>,
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const section of SECTIONS) {
    for (const field of section.fields) {
      values[field.key] = toDisplayValue(
        settings[field.key] ?? "",
        field.isMs,
      );
    }
  }
  return values;
}

const DAYS_OF_WEEK: Record<string, { name: string; article: string }> = {
  "0": { name: "domingo", article: "Todo" },
  "1": { name: "segunda-feira", article: "Toda" },
  "2": { name: "terça-feira", article: "Toda" },
  "3": { name: "quarta-feira", article: "Toda" },
  "4": { name: "quinta-feira", article: "Toda" },
  "5": { name: "sexta-feira", article: "Toda" },
  "6": { name: "sábado", article: "Todo" },
  "7": { name: "domingo", article: "Todo" },
};

function formatTime(hour: string, minute: string): string {
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(" e ");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

function describeTime(m: string, h: string): string {
  if (m === "*" && h === "*") return "a cada minuto";

  if (/^\*\/\d+$/.test(m) && h === "*") {
    return `a cada ${m.slice(2)} minutos`;
  }

  if (m === "0" && /^\*\/\d+$/.test(h)) {
    return `a cada ${h.slice(2)} horas`;
  }

  if (/^\d+$/.test(m) && /^\*\/\d+$/.test(h)) {
    return `no minuto ${m} a cada ${h.slice(2)} horas`;
  }

  if (m === "*" && /^\d+$/.test(h)) {
    return `a cada minuto entre ${h.padStart(2, "0")}:00 e ${h.padStart(2, "0")}:59`;
  }

  if (/^\d+$/.test(m) && /^\d+(,\d+)+$/.test(h)) {
    const times = h.split(",").map((hr) => formatTime(hr, m));
    return `às ${joinList(times)}`;
  }

  if (/^\d+$/.test(m) && /^\d+$/.test(h)) {
    return `às ${formatTime(h, m)}`;
  }

  return `(${m} ${h})`;
}

function describeDay(dom: string, mon: string, dow: string): string {
  if (dom === "*" && mon === "*" && dow === "*") return "todo dia";

  if (dom === "*" && mon === "*") {
    if (dow === "1-5") return "dias úteis";
    if (dow === "0,6" || dow === "6,0") return "fins de semana";
    if (/^\d$/.test(dow)) {
      const day = DAYS_OF_WEEK[dow];
      if (day) return `${day.article.toLowerCase()} ${day.name}`;
    }
    if (/^\d(,\d)+$/.test(dow)) {
      const names = dow
        .split(",")
        .map((d) => DAYS_OF_WEEK[d]?.name)
        .filter((n): n is string => Boolean(n));
      if (names.length > 0) return `toda ${joinList(names)}`;
    }
  }

  if (dow === "*" && mon === "*" && /^\d+$/.test(dom)) {
    return `todo dia ${dom} do mês`;
  }

  if (dow === "*" && mon === "*" && /^\*\/\d+$/.test(dom)) {
    return `a cada ${dom.slice(2)} dias`;
  }

  return `(dom=${dom} mon=${mon} dow=${dow})`;
}

function humanizeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return cron;
  const [m, h, dom, mon, dow] = parts;

  const dayText = describeDay(dom, mon, dow);
  const timeText = describeTime(m, h);

  const combined = `${dayText} ${timeText}`.trim();
  return combined.charAt(0).toUpperCase() + combined.slice(1);
}

function humanizeDuration(secondsStr: string): string {
  const total = parseInt(secondsStr, 10);
  if (isNaN(total) || total < 0) return `${secondsStr} segundos`;
  if (total === 0) return "0 segundos";

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hora" : "horas"}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "minuto" : "minutos"}`);
  if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? "segundo" : "segundos"}`);

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(" e ");
  return `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
}

function humanizeValue(field: FieldConfig, value: string): string {
  if (!value) return "";
  if (field.isCron) return humanizeCron(value);
  if (field.isMs) return humanizeDuration(value);
  if (field.unit) return `${value} ${field.unit}`;
  return value;
}

function getResolvedOptions(
  field: FieldConfig,
  currentValue: string,
): SelectOption[] {
  if (!currentValue) return field.options;
  const exists = field.options.some((opt) => opt.value === currentValue);
  if (exists) return field.options;
  const customLabel = humanizeValue(field, currentValue) || currentValue;
  return [{ value: currentValue, label: customLabel }, ...field.options];
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const displayInitial = useMemo(
    () => buildInitialValues(initialSettings),
    [initialSettings],
  );
  const [values, setValues] = useState(() => displayInitial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const hasChanges = Object.keys(values).some(
    (key) => values[key] !== displayInitial[key],
  );

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};

    for (const [minKey, maxKey] of MIN_MAX_PAIRS) {
      const minVal = Number(values[minKey]);
      const maxVal = Number(values[maxKey]);
      if (isNaN(minVal) || isNaN(maxVal)) continue;
      if (minVal >= maxVal) {
        errs[maxKey] = "Deve ser maior que o mínimo";
      }
    }

    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const allFields = SECTIONS.flatMap((s) => s.fields);
    const changed = allFields
      .filter((field) => values[field.key] !== displayInitial[field.key])
      .map((field) => ({
        key: field.key,
        value: toDbValue(values[field.key], field.isMs),
      }));

    if (changed.length === 0) return;

    startTransition(async () => {
      const result = await saveSettings(changed);
      if (result.success) {
        toast("Configurações salvas com sucesso", "success");
      } else {
        toast(result.error ?? "Erro ao salvar configurações", "error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {SECTIONS.map((section, idx) => (
        <section key={section.title} className="space-y-4">
          {idx > 0 && <hr className="border-border" />}
          <h2 className="text-lg font-semibold text-text-primary">
            {section.title}
          </h2>

          <Card className="space-y-6">
            {section.fields.map((field) => {
              const currentValue = values[field.key] ?? "";
              const resolvedOptions = getResolvedOptions(field, currentValue);

              return (
                <div key={field.key} className="space-y-1.5">
                  <label
                    htmlFor={field.key}
                    className="text-sm font-medium text-text-primary"
                  >
                    {field.label}
                  </label>
                  <p className="text-sm text-text-secondary">
                    {field.description}
                  </p>
                  <div className="max-w-sm">
                    <Select
                      id={field.key}
                      value={currentValue}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    >
                      {resolvedOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  {errors[field.key] && (
                    <p className="text-sm text-error">{errors[field.key]}</p>
                  )}
                </div>
              );
            })}
          </Card>
        </section>
      ))}

      <Button type="submit" disabled={!hasChanges || isPending}>
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Salvando...
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </form>
  );
}
