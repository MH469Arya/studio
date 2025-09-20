import { OrdersTable } from './_components/orders-table';

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <OrdersTable />
    </div>
  );
}
