"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/ui/lib/utils";

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

const sideClassNames = {
  bottom:
    "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl border-t data-open:slide-in-from-bottom data-closed:slide-out-to-bottom",
  left: "inset-y-0 left-0 w-[min(20rem,calc(100vw-3rem))] border-r data-open:slide-in-from-left data-closed:slide-out-to-left",
};

function SheetContent({
  className,
  children,
  side = "bottom",
  ...props
}: SheetPrimitive.Popup.Props & { side?: keyof typeof sideClassNames }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop
        data-slot="sheet-backdrop"
        className="fixed inset-0 z-50 bg-black/55 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col overflow-y-auto border-border bg-popover text-popover-foreground shadow-lg outline-none duration-200 data-open:animate-in data-closed:animate-out",
          sideClassNames[side],
          className,
        )}
        {...props}
      >
        {side === "bottom" && (
          <div aria-hidden className="flex justify-center pt-3">
            <div className="h-1 w-9 rounded-full bg-border" />
          </div>
        )}
        {children}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}

function SheetTitle({ ...props }: SheetPrimitive.Title.Props) {
  return <SheetPrimitive.Title data-slot="sheet-title" {...props} />;
}

function SheetDescription({ ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description data-slot="sheet-description" {...props} />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
};
