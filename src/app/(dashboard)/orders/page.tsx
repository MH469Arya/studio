import { OrdersTable } from './_components/orders-table';
import { SalesOverviewChart } from './_components/sales-overview-chart';

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <SalesOverviewChart />
      <OrdersTable />
    </div>
  );
}
