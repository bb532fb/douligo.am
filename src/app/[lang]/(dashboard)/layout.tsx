import { AppNav } from "@/components/navigation/app-nav";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-full">
      <AppNav />
      <div className="px-4 pb-24 pt-6 sm:px-6 lg:ml-64 lg:pb-10">
        <div className="mx-auto flex max-w-3xl justify-end pb-4 lg:hidden">
          <LocaleSwitcher />
        </div>
        <div className="mx-auto max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
