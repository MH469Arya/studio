'use client';

import * as React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrders, Order } from '@/services/orders-service';
import { useLanguage } from '../../_components/language-provider';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

type ChartData = {
  date: string;
  Sales: number;
};

type TimeRange = 'week' | 'month' | 'year';

export function SalesOverviewChart() {
  const { t } = useLanguage();
  const [data, setData] = React.useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = React.useState<TimeRange>('month');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const processData = (orders: Order[], range: TimeRange) => {
      const now = new Date();
      let startDate, endDate;

      if (range === 'week') {
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
      } else if (range === 'month') {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
      } else { // year
        startDate = startOfYear(now);
        endDate = endOfYear(now);
      }

      const ordersInRange = orders.filter(order => {
        const orderDate = new Date(order.date);
        return isWithinInterval(orderDate, { start: startDate, end: endDate });
      });

      const salesByDate: { [key: string]: number } = {};

      if (range === 'year') {
         // Group by month for yearly view
        for (let i = 0; i < 12; i++) {
          const month = format(new Date(now.getFullYear(), i), 'MMM');
          salesByDate[month] = 0;
        }
        ordersInRange.forEach(order => {
          const month = format(new Date(order.date), 'MMM');
          const amount = parseFloat(order.total.replace('₹', '').replace(',', ''));
          if (!isNaN(amount)) {
            salesByDate[month] = (salesByDate[month] || 0) + amount;
          }
        });
        return Object.keys(salesByDate).map(month => ({
            date: month,
            Sales: salesByDate[month],
        }));

      } else {
        // Group by day for weekly/monthly view
        const intervalDays = eachDayOfInterval({ start: startDate, end: endDate });
        intervalDays.forEach(day => {
          const formattedDate = format(day, 'MMM d');
          salesByDate[formattedDate] = 0;
        });

        ordersInRange.forEach(order => {
          const formattedDate = format(new Date(order.date), 'MMM d');
          const amount = parseFloat(order.total.replace('₹', '').replace(',', ''));
          if (salesByDate.hasOwnProperty(formattedDate) && !isNaN(amount)) {
            salesByDate[formattedDate] += amount;
          }
        });

        return Object.keys(salesByDate).map(date => ({
          date: date,
          Sales: salesByDate[date],
        }));
      }
    };

    const fetchData = async () => {
      setLoading(true);
      const orders = await getOrders();
      const chartData = processData(orders, timeRange);
      setData(chartData);
      setLoading(false);
    };

    fetchData();
  }, [timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {t('Date')}
              </span>
              <span className="font-bold text-muted-foreground">{label}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {t('Sales')}
              </span>
              <span className="font-bold text-foreground">
                ₹{payload[0].value.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-headline">{t('Sales Overview')}</CardTitle>
            <CardDescription>{t('A visual representation of your sales performance.')}</CardDescription>
          </div>
          <Tabs defaultValue="month" onValueChange={(value) => setTimeRange(value as TimeRange)} className="sm:self-end">
            <TabsList>
              <TabsTrigger value="week">{t('This Week')}</TabsTrigger>
              <TabsTrigger value="month">{t('This Month')}</TabsTrigger>
              <TabsTrigger value="year">{t('This Year')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="h-[350px] w-full flex items-center justify-center">
                 <Skeleton className="h-full w-full" />
            </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Legend formatter={(value) => <span className="text-muted-foreground">{t(value)}</span>} />
              <Line
                type="monotone"
                dataKey="Sales"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--card))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
            <div className="h-[350px] w-full flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">{t('No sales data for this period.')}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
