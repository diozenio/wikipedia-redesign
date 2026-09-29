"use client";

import { type ReactNode, useMemo } from "react";
import { HeaderContext } from "@/ui/contexts/header-context";
import { ProfileCardContext } from "@/ui/contexts/profile-card-context";
import { useToggle } from "@/ui/hooks/use-toggle";

const profile = {
  name: "Ada Lovelace",
  handle: "@ada",
  role: "Engineer",
  bio: "Writing the first programs before computers existed.",
};

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [isFollowing, toggleFollow] = useToggle();

  const header = useMemo(
    () => ({
      title: "Hello World",
      tag: {
        label: profile.handle,
        variant: isFollowing ? ("default" as const) : ("outline" as const),
      },
    }),
    [isFollowing],
  );

  const card = useMemo(
    () => ({
      title: profile.name,
      subtitle: profile.handle,
      tag: profile.role,
      avatarFallback: profile.name
        .split(" ")
        .map((part) => part[0])
        .join(""),
      description: profile.bio,
      action: {
        label: isFollowing ? "Following" : "Follow",
        variant: isFollowing ? ("outline" as const) : ("default" as const),
        onClick: toggleFollow,
      },
    }),
    [isFollowing, toggleFollow],
  );

  return (
    <HeaderContext value={header}>
      <ProfileCardContext value={card}>{children}</ProfileCardContext>
    </HeaderContext>
  );
}
