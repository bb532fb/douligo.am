import type { ReactNode } from "react";
import { AppNav } from "@/components/navigation/app-nav";
import { AdminSubnav } from "@/components/admin/admin-subnav";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-full">
      <AppNav isAdmin />
      <div className="px-4 pb-[calc(9.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:ml-64 lg:pb-10">
        <div className="mx-auto flex max-w-5xl justify-end pb-4 lg:hidden">
          <LocaleSwitcher />
        </div>
        <div className="mx-auto max-w-5xl space-y-6">
          <AdminSubnav />
          {children}
        </div>
      </div>
    </div>
  );
}
