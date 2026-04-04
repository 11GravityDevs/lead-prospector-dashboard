import { SettingsForm } from "@/components/settings-form";
import { getSettings } from "@/lib/queries/settings";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-[30px] font-semibold leading-9">Configuracoes</h1>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
