"use client";

import { type FormEvent, useState, useTransition, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { saveSettings } from "@/lib/actions/settings";
import { Loader2 } from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

interface FieldConfig {
  key: string;
  label: string;
  description: string;
  type: "text" | "number";
  isMs: boolean;
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
        key: "prospecting_cron",
        label: "Cron de prospeccao",
        description:
          "Expressao cron que define quando a pipeline roda",
        type: "text",
        isMs: false,
      },
      {
        key: "whatsapp_cron",
        label: "Cron de disparo WhatsApp",
        description:
          "Expressao cron que define quando as mensagens sao enviadas",
        type: "text",
        isMs: false,
      },
      {
        key: "scheduler_poll_interval_ms",
        label: "Intervalo do scheduler",
        description:
          "Intervalo em que o scheduler verifica mudancas nas configuracoes (em segundos)",
        type: "number",
        isMs: true,
      },
    ],
  },
  {
    title: "Disparo WhatsApp",
    fields: [
      {
        key: "leads_per_dispatch",
        label: "Leads por disparo",
        description:
          "Quantidade de leads contatados por nicho em cada execucao",
        type: "number",
        isMs: false,
      },
      {
        key: "whatsapp_delay_min_ms",
        label: "Delay minimo entre mensagens",
        description: "Tempo minimo de espera entre envios (em segundos)",
        type: "number",
        isMs: true,
      },
      {
        key: "whatsapp_delay_max_ms",
        label: "Delay maximo entre mensagens",
        description: "Tempo maximo de espera entre envios (em segundos)",
        type: "number",
        isMs: true,
      },
      {
        key: "evolution_typing_min_ms",
        label: "Digitacao minima",
        description:
          "Tempo minimo de simulacao de digitacao (em segundos)",
        type: "number",
        isMs: true,
      },
      {
        key: "evolution_typing_max_ms",
        label: "Digitacao maxima",
        description:
          "Tempo maximo de simulacao de digitacao (em segundos)",
        type: "number",
        isMs: true,
      },
    ],
  },
];

const MIN_MAX_PAIRS: [string, string][] = [
  ["whatsapp_delay_min_ms", "whatsapp_delay_max_ms"],
  ["evolution_typing_min_ms", "evolution_typing_max_ms"],
];

function toDisplayValue(key: string, dbValue: string, isMs: boolean): string {
  if (!isMs) return dbValue;
  const num = parseInt(dbValue, 10);
  if (isNaN(num)) return dbValue;
  return String(num / 1000);
}

function toDbValue(key: string, displayValue: string, isMs: boolean): string {
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
        field.key,
        settings[field.key] ?? "",
        field.isMs,
      );
    }
  }
  return values;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [values, setValues] = useState(() =>
    buildInitialValues(initialSettings),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const displayInitial = buildInitialValues(initialSettings);
  const hasChanges = Object.keys(values).some(
    (key) => values[key] !== displayInitial[key],
  );

  const handleCloseToast = useCallback(() => setToast(null), []);

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};

    for (const section of SECTIONS) {
      for (const field of section.fields) {
        const val = values[field.key]?.trim() ?? "";

        if (field.type === "text" && val === "") {
          errs[field.key] = "Campo obrigatorio";
        }

        if (field.type === "number") {
          const num = Number(val);
          if (val === "" || !Number.isInteger(num) || num <= 0) {
            errs[field.key] = "Deve ser um inteiro positivo";
          }
        }
      }
    }

    for (const [minKey, maxKey] of MIN_MAX_PAIRS) {
      if (errs[minKey] || errs[maxKey]) continue;
      const minVal = Number(values[minKey]);
      const maxVal = Number(values[maxKey]);
      if (minVal >= maxVal) {
        errs[maxKey] = "Deve ser maior que o minimo";
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
        value: toDbValue(field.key, values[field.key], field.isMs),
      }));

    if (changed.length === 0) return;

    startTransition(async () => {
      const result = await saveSettings(changed);
      if (result.success) {
        setToast({
          message: "Configuracoes salvas com sucesso",
          variant: "success",
        });
      } else {
        setToast({
          message: result.error ?? "Erro ao salvar configuracoes",
          variant: "error",
        });
      }
    });
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={handleCloseToast}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {SECTIONS.map((section, idx) => (
          <section key={section.title} className="space-y-4">
            {idx > 0 && <hr className="border-border" />}
            <h2 className="text-lg font-semibold text-text-primary">
              {section.title}
            </h2>

            <Card className="space-y-6">
              {section.fields.map((field) => (
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
                  <Input
                    id={field.key}
                    type={field.type}
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    min={field.type === "number" ? 1 : undefined}
                    className="max-w-sm"
                  />
                  {errors[field.key] && (
                    <p className="text-sm text-error">{errors[field.key]}</p>
                  )}
                </div>
              ))}
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
    </>
  );
}
