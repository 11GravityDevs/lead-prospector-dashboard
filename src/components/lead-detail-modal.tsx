"use client";

import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Lead } from "@/types/database";
import { ExternalLink, MapPin, Star } from "lucide-react";

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs text-text-secondary mb-1">{label}</dt>
      <dd className="text-sm text-text-primary">{children}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {children}
    </div>
  );
}

function AiField({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-text-secondary mb-1">{label}</dt>
      <dd className="text-sm text-text-primary whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  if (!lead) return null;

  return (
    <Modal open={lead !== null} onClose={onClose}>
      <ModalHeader onClose={onClose}>{lead.company_name}</ModalHeader>
      <ModalBody className="space-y-6">
        <Section title="Dados de Contato">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Telefone">{lead.phone}</Field>
            <Field label="WhatsApp">{lead.phone_whatsapp}</Field>
            <Field label="Endereco">{lead.address}</Field>
            <Field label="Cidade">
              {[lead.city, lead.state].filter(Boolean).join(", ") || null}
            </Field>
            <Field label="Website">
              {lead.website ? (
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-400 hover:text-green-500 transition-colors"
                >
                  {lead.website}
                  <ExternalLink className="size-3" />
                </a>
              ) : null}
            </Field>
            <Field label="Google Maps">
              {lead.gmb_link ? (
                <a
                  href={lead.gmb_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-400 hover:text-green-500 transition-colors"
                >
                  Ver no mapa
                  <MapPin className="size-3" />
                </a>
              ) : null}
            </Field>
            <Field label="Avaliacao">
              {lead.rating !== null ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5 text-amber-400 fill-amber-400" />
                  {lead.rating} ({lead.review_count ?? 0})
                </span>
              ) : null}
            </Field>
            <Field label="Status">
              <Badge variant={lead.status} />
            </Field>
            <Field label="Data de contato">
              {lead.contacted_at ? formatDate(lead.contacted_at) : null}
            </Field>
          </dl>
        </Section>

        <div className="border-t border-border" />

        <Section title="Mensagem de Abordagem">
          {lead.personalized_message ? (
            <div className="bg-bg-elevated rounded-md p-4 text-sm text-text-primary whitespace-pre-wrap">
              {lead.personalized_message}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">Nenhuma mensagem gerada.</p>
          )}
        </Section>

        <div className="border-t border-border" />

        <Section title="Analise IA">
          <dl className="space-y-4">
            <AiField label="Descricao do negocio" value={lead.business_description} />
            <AiField label="Resumo executivo" value={lead.business_summary} />
            <AiField label="Pontos positivos" value={lead.positive_points} />
            <AiField label="Pontos negativos" value={lead.negative_points} />
            <AiField label="Percepcao geral" value={lead.general_perception} />
            <AiField label="Oportunidade identificada" value={lead.ai_opportunity} />
          </dl>
        </Section>
      </ModalBody>
    </Modal>
  );
}
