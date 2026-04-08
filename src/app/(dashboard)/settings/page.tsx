import { SettingsForm } from "@/components/settings-form";
import { ToastTrigger } from "@/components/toast-trigger";
import { getSettings } from "@/lib/queries/settings";

export default async function SettingsPage() {
  let settings: Record<string, string> = {};
  let error = false;

  try {
    settings = await getSettings();
  } catch {
    error = true;
  }

  return (
    <div className="space-y-6">
      {error && (
        <ToastTrigger message="Não foi possível carregar as configurações. Tente novamente." />
      )}

      <h1 className="text-[30px] font-semibold leading-9">Configurações</h1>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
