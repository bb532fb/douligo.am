import type { ReactNode } from "react";
import { AppNav } from "@/components/navigation/app-nav";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { getOptionalAccount } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const account = await getOptionalAccount();
  const isAdmin = account?.role === "ADMIN" && account.status === "ACTIVE";

  return (
    <div className="min-h-full">
      <AppNav isAdmin={isAdmin} />
      <div
        className={
          isAdmin
            ? "px-4 pb-[calc(9.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:ml-64 lg:pb-10"
            : "px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:ml-64 lg:pb-10"
        }
      >
        <div className="mx-auto flex max-w-3xl justify-end pb-4 lg:hidden">
          <LocaleSwitcher />
        </div>
        <div className="mx-auto max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
