import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminUserCard } from "@/components/admin/admin-user-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAdmin } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/i18n/interpolate";
import { withLocale } from "@/i18n/path";
import { adminUserQuerySchema } from "@/lib/validations/admin";
import { adminService } from "@/server/services/admin-service";

type AdminUsersPageProps = PageProps<"/[lang]/admin/users"> & {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

export default async function AdminUsersPage({ params, searchParams }: AdminUsersPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  const admin = await requireAdmin();
  const dict = await getDictionary(lang);
  const raw = await searchParams;
  const parsedQuery = adminUserQuerySchema.safeParse({
    q: raw.q ?? "",
    status: raw.status ?? "ALL",
    page: raw.page ?? "1",
  });
  const query = parsedQuery.success ? parsedQuery.data : { q: "", status: "ALL" as const, page: 1 };
  const [list, heartsMax] = await Promise.all([
    adminService.listUsers(query),
    adminService.getHeartsMax(),
  ]);
  const totalPages = Math.max(1, Math.ceil(list.total / list.pageSize));

  return (
    <div className="space-y-6">
      <AdminHeader title={dict.nav.adminUsers} lead={dict.admin.usersLead} />
      <UserFilters q={query.q} status={query.status} dict={dict} />
      {list.items.length === 0 ? (
        <EmptyState title={dict.admin.noUsers} />
      ) : (
        <ul className="space-y-3">
          {list.items.map((user) => (
            <li key={user.id}>
              <AdminUserCard user={user} locale={lang} dict={dict} currentUserId={admin.id} heartsMax={heartsMax} />
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={query.page}
        totalPages={totalPages}
        hrefBase={withLocale(lang, "/admin/users")}
        q={query.q}
        status={query.status}
        dict={dict}
      />
    </div>
  );
}

function UserFilters({
  q,
  status,
  dict,
}: {
  q: string;
  status: "ALL" | "ACTIVE" | "SUSPENDED";
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const filters = [
    ["ALL", dict.admin.filterAll],
    ["ACTIVE", dict.admin.filterActive],
    ["SUSPENDED", dict.admin.filterSuspended],
  ] as const;
  return (
    <form className="space-y-3" method="get">
      <label className="block">
        <span className="sr-only">{dict.admin.searchUsers}</span>
        <input
          name="q"
          defaultValue={q}
          placeholder={dict.admin.searchUsers}
          className="tap-target w-full rounded-2xl border-2 border-b-4 border-line bg-paper-raised px-4 font-semibold"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {filters.map(([value, label]) => (
          <button
            key={value}
            name="status"
            value={value}
            className={`rounded-full border-2 px-4 py-2 text-sm font-extrabold ${
              status === value ? "border-brand bg-brand text-white" : "border-line bg-paper-raised text-ink-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  );
}

function Pagination({
  page,
  totalPages,
  hrefBase,
  q,
  status,
  dict,
}: {
  page: number;
  totalPages: number;
  hrefBase: string;
  q: string;
  status: string;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  if (totalPages <= 1) {
    return null;
  }
  const query = new URLSearchParams({ q, status });
  const hrefFor = (next: number) => `${hrefBase}?${new URLSearchParams({ ...Object.fromEntries(query), page: String(next) })}`;
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="secondary" href={hrefFor(page - 1)} disabled={page <= 1}>
        {dict.admin.prev}
      </Button>
      <p className="font-extrabold">{interpolate(dict.admin.page, { page })}</p>
      <Button variant="secondary" href={hrefFor(page + 1)} disabled={page >= totalPages}>
        {dict.admin.next}
      </Button>
    </div>
  );
}
