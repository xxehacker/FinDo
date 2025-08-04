import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart for day-wise transactions in a month";

const chartConfig = {
  amount: {
    label: "Transaction Amount",
    color: "#4CAF50",
  },
};

export function DailyTransactionChart({ title, data }) {
  return (
    <Card style={{ width: "100%", minHeight: "200px", boxSizing: "border-box" }}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ padding: "0 16px" }}>
        <ChartContainer
          config={chartConfig}
          style={{ width: "100%", height: "200px" }}
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            width={undefined}
            height={200}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.padStart(2, "0")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ stroke: "#4CAF50", strokeWidth: 1 }}
              content={<ChartTooltipContent />}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {title} trend <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing daily transactions for {title.toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
}