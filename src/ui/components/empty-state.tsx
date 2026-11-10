"use client";

import { useEmptyState } from "@/ui/contexts/empty-state-context";
import { Button } from "@/ui/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/primitives/empty";

export function EmptyState() {
  const { title, media, description, action } = useEmptyState();

  return (
    <Empty>
      <EmptyHeader>
        {media && (
          <EmptyMedia className="text-5xl font-semibold" aria-hidden="true">
            {media}
          </EmptyMedia>
        )}
        <EmptyTitle>
          <h1>{title}</h1>
        </EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button variant={action.variant} onClick={action.onClick}>
            {action.label}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
