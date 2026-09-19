"use client";

import { useActionState, type FormEvent, type ReactNode } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adjustHeartsAction, updateUserStatusAction, type AdminActionResult } from "@/server/actions/admin-actions";
import type { Dictionary } from "@/i18n/types";
import type { UserStatus } from "@prisma/client";

type AdminUserControlsProps = {
  userId: string;
  status: UserStatus;
  hearts: number;
  heartsMax: number;
  isSelf: boolean;
  dict: Dictionary;
};

const initial: AdminActionResult = { ok: false };

export function AdminUserControls({ userId, status, hearts, heartsMax, isSelf, dict }: AdminUserControlsProps) {
  const [heartState, heartAction, heartPending] = useActionState(adjustHeartsAction, initial);
  const [statusState, statusAction, statusPending] = useActionState(updateUserStatusAction, initial);
  const message = heartState.message ?? statusState.message;
  const nextStatus = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

  function confirmStatus(event: FormEvent<HTMLFormElement>) {
    const text = nextStatus === "SUSPENDED" ? dict.admin.confirmSuspend : dict.admin.confirmActivate;
    if (!window.confirm(text)) {
      event.preventDefault();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-extrabold text-ink-soft">{dict.admin.hearts}</span>
        <HeartForm action={heartAction} userId={userId} intent="remove" disabled={heartPending || hearts <= 0} label={dict.admin.removeHeart}>
          <Minus className="h-4 w-4" />
        </HeartForm>
        <span className="inline-flex min-w-14 items-center justify-center gap-1 rounded-2xl bg-rose-soft px-3 py-2 text-lg font-black text-rose">
          <Heart className="h-5 w-5 fill-rose" aria-hidden="true" />
          {hearts}/{heartsMax}
        </span>
        <HeartForm action={heartAction} userId={userId} intent="add" disabled={heartPending || hearts >= heartsMax} label={dict.admin.addHeart}>
          <Plus className="h-4 w-4" />
        </HeartForm>
        <form action={heartAction}>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="intent" value="refill" />
          <Button type="submit" variant="secondary" disabled={heartPending || hearts >= heartsMax}>
            {dict.admin.refillHearts}
          </Button>
        </form>
      </div>
      {isSelf ? (
        <p className="text-sm font-bold text-ink-soft">{dict.admin.selfAccount}</p>
      ) : (
        <form action={statusAction} onSubmit={confirmStatus}>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="status" value={nextStatus} />
          <Button type="submit" variant={nextStatus === "SUSPENDED" ? "danger" : "secondary"} disabled={statusPending}>
            {nextStatus === "SUSPENDED" ? dict.admin.makeSuspended : dict.admin.makeActive}
          </Button>
        </form>
      )}
      {message ? (
        <p className="text-sm font-bold text-teal" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}

function HeartForm({
  action,
  userId,
  intent,
  disabled,
  label,
  children,
}: {
  action: (formData: FormData) => void;
  userId: string;
  intent: "add" | "remove";
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="intent" value={intent} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={label}
        className="tap-target inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-line bg-paper-raised font-black disabled:opacity-40"
      >
        {children}
      </button>
    </form>
  );
}
