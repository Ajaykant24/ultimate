import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  highlight?: boolean
}

export function StatCard({ label, value, icon, highlight }: StatCardProps) {
  return (
    <Card className="border-[#2a2d2d] bg-[#1a1c1c]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className={`text-2xl font-bold ${highlight ? "text-[#84cc16]" : "text-white"}`}>
              {value}
            </p>
          </div>
          {icon && <div className="text-[#9ca3af]">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
