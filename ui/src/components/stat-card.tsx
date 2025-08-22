import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const overlayGradientMap: Record<string, string> = {
  ok: "from-green-500/10 via-green-400/5 to-green-500/10",
  error: "from-red-500/10 via-red-400/5 to-red-500/10",
  warning: "from-yellow-500/10 via-yellow-400/5 to-yellow-500/10",
}

const valueGradientMap: Record<string, string> = {
  ok: "from-green-400 via-green-300 to-green-400",
  error: "from-red-400 via-red-300 to-red-400",
  warning: "from-yellow-400 via-yellow-300 to-yellow-400",
}

const cardBgGradientMap: Record<string, string> = {
  ok: "from-gray-900 via-green-950 to-gray-900",
  error: "from-gray-900 via-red-950 to-gray-900",
  warning: "from-gray-900 via-yellow-950 to-gray-900",
}

const StatCard = ({
  title,
  value,
  description,
  unit,
  type,
}: {
  title: string
  value: string
  description: string
  unit: string
  type: string
}) => {
  const overlayGradient = overlayGradientMap[type] || overlayGradientMap.ok
  const valueGradient = valueGradientMap[type] || valueGradientMap.ok
  const cardBgGradient = cardBgGradientMap[type] || cardBgGradientMap.ok

  return (
    <Card
      className={`relative w-[300px] overflow-hidden rounded-2xl border border-gray-200/20 bg-gradient-to-br ${cardBgGradient} shadow-lg transition-transform hover:scale-[1.02] hover:shadow-2xl`}
    >
      {/* dynamic overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${overlayGradient} opacity-60 pointer-events-none`}
      />

      <CardContent className="px-4 pt-0 relative z-10">
        <CardTitle className="text-lg font-semibold tracking-tight text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-300">
          {description}
        </CardDescription>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl font-bold bg-gradient-to-r ${valueGradient} bg-clip-text text-transparent`}
          >
            {value || 0}
          </span>
          <span className="text-sm font-medium text-gray-400">{unit}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard