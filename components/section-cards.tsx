import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {/* Card 1 --> Account Aggregation */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
        Financial Accounts
          </CardTitle>
          <CardDescription>Manage your connected accounts</CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-3 pt-2 justify-start">
          <a href="/accounts" className="md:w-1/6 w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
        View Financial Accounts
          </a>

        </CardFooter>
      </Card>

      {/* Card 2 --> Alerts/Anamolies */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardTitle>Spending Alerts</CardTitle>
          <CardDescription>
            Detect any abnormal spending or sudden changes in your spending habits
          </CardDescription>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +10%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sudden spending change <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Spending more than usual </div>
        </CardFooter>
      </Card>





      {/* Card 3 --> Saving Recommendations (not too sure what to put in here for now) */}
      {/* <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            4.5%
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card> */}
    </div>
  )
}
