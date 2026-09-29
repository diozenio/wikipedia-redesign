"use client";

import { useProfileCard } from "@/ui/contexts/profile-card-context";
import { Avatar, AvatarFallback } from "@/ui/primitives/avatar";
import { Badge } from "@/ui/primitives/badge";
import { Button } from "@/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/primitives/card";
import { Separator } from "@/ui/primitives/separator";

export function ProfileCard() {
  const { title, subtitle, tag, avatarFallback, description, action } =
    useProfileCard();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          {avatarFallback && (
            <Avatar size="lg">
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col gap-1">
            <CardTitle>{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
          {tag && (
            <Badge className="ml-auto" variant="secondary">
              {tag}
            </Badge>
          )}
        </div>
      </CardHeader>
      {description && (
        <>
          <Separator />
          <CardContent>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </>
      )}
      {action && (
        <CardFooter>
          <Button
            className="w-full"
            variant={action.variant}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
