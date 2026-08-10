interface StatusDotProps {
  status: "approved" | "pending" | "denied" | "inactive"
  count: number
}

const colorMap = {
  approved: "text-[#22c55e]",
  pending: "text-[#f59e0b]",
  denied: "text-[#ef4444]",
  inactive: "text-[#9ca3af]",
}

export function StatusDot({ status, count }: StatusDotProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${colorMap[status]}`}>
      <span>●</span>
      <span>{count}</span>
    </span>
  )
}
