"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatViews } from "@/lib/utils"

interface ViewsChartProps {
  data: { date: string; views: number }[]
  height?: number
}

export function ViewsChart({ data, height = 200 }: ViewsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d2d" />
        <XAxis dataKey="date" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1c1c",
            border: "1px solid #2a2d2d",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#84cc16" }}
          formatter={(value) => formatViews(typeof value === "number" ? value : 0)}
        />
        <Bar dataKey="views" fill="#84cc16" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
