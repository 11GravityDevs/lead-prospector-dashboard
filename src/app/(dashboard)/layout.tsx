import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const sidebarUser = {
    name: user.user_metadata?.full_name ?? user.email ?? "",
    email: user.email ?? "",
    avatarUrl: user.user_metadata?.avatar_url as string | undefined,
  };

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar user={sidebarUser} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
