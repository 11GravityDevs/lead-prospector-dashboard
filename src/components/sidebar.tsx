"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Radar,
  Send,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";

type User = {
  name: string;
  email: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutGrid },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Prospeccao", href: "/prospecting", icon: Radar },
  { label: "Disparos", href: "/dispatch", icon: Send },
];

const SECONDARY_NAV: NavItem[] = [
  { label: "Configuracoes", href: "/settings", icon: Settings },
];

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex flex-col w-60 h-screen shrink-0 bg-bg-surface border-r border-border">
      <div className="px-6 py-6">
        <span className="text-lg font-semibold text-green-400">
          Lead Prospector
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
          />
        ))}

        <hr className="border-border my-2" />

        {SECONDARY_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      <div className="flex items-center gap-3 px-4 py-4 border-t border-border">
        <div className="size-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-medium text-text-secondary">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-text-tertiary truncate">{user.email}</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        active
          ? "bg-green-500-10 text-green-400"
          : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
      )}
    >
      <Icon className="size-5 shrink-0" />
      {item.label}
    </Link>
  );
}
