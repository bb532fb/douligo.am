import { redirectIfAuthenticated } from "@/lib/auth/session";
import { Logo } from "@/components/brand/logo";
import { Mascot } from "@/components/brand/mascot";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await redirectIfAuthenticated();
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-4 flex justify-end">
        <LocaleSwitcher />
      </div>
      <div className="mb-4 flex justify-center">
        <Mascot mood="happy" size={120} />
      </div>
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      {children}
    </div>
  );
}
