"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HEARTS_MAX_LIMIT, HEARTS_MAX_MIN } from "@/lib/constants/app";
import { updateHeartsMaxAction, type AdminActionResult } from "@/server/actions/admin-actions";
import type { Dictionary } from "@/i18n/types";

type AdminHeartsMaxFormProps = {
  heartsMax: number;
  dict: Dictionary;
};

const initial: AdminActionResult = { ok: false };

export function AdminHeartsMaxForm({ heartsMax, dict }: AdminHeartsMaxFormProps) {
  const [state, action, pending] = useActionState(updateHeartsMaxAction, initial);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-xl font-black">{dict.admin.heartsMaxTitle}</h2>
        <p className="mt-1 font-semibold text-ink-soft">{dict.admin.heartsMaxLead}</p>
      </div>
      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          name="heartsMax"
          type="number"
          min={HEARTS_MAX_MIN}
          max={HEARTS_MAX_LIMIT}
          defaultValue={heartsMax}
          label={dict.admin.heartsMax}
          required
        />
        <Button type="submit" loading={pending} className="sm:mb-0.5">
          {dict.admin.saveHeartsMax}
        </Button>
      </form>
      {state.message ? (
        <p className="text-sm font-bold text-teal" role="status">
          {state.message}
        </p>
      ) : null}
    </Card>
  );
}
