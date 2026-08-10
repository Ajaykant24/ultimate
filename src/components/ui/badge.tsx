import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#84cc16] text-black hover:bg-[#a3e635]",
        secondary:
          "border-transparent bg-[#222424] text-[#ffffff] hover:bg-[#2a2d2d]",
        destructive:
          "border-transparent bg-[#ef4444] text-white hover:bg-[#dc2626]",
        outline: "text-foreground border-[#2a2d2d]",
        success: "border-transparent bg-[#22c55e] text-white",
        warning: "border-transparent bg-[#f59e0b] text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
