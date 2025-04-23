
import { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { calculateMonthlyProfit } from "@/lib/data";

const ProfitChart = () => {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    const currentDate = new Date();
    const chartData = [];
    
    // Get data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthlyData = calculateMonthlyProfit(month, year);
      chartData.push({
        name: format(date, "MMM"),
        income: monthlyData.income,
        expenses: monthlyData.expenses,
        profit: monthlyData.profit
      });
    }
    
    setData(chartData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="income" name="Revenue" fill="#4ade80" />
              <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
              <Bar dataKey="profit" name="Profit" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitChart;
