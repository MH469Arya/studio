'use client';

import * as React from 'react';
import {
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '../../_components/language-provider';
import type { Order } from '@/services/orders-service';
import { getOrders } from '@/services/orders-service';


const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Fulfilled':
        case 'Shipped':
            return 'default';
        case 'Processing':
        case 'Pending':
            return 'secondary';
        case 'Cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
};

export function OrdersTable() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>(['Processing', 'Pending', 'Shipped']);
  const { t } = useLanguage();

  React.useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  const filteredOrders = orders.filter(order => statusFilter.includes(order.status));

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const allStatuses = ['Fulfilled', 'Shipped', 'Processing', 'Pending', 'Cancelled'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline">{t('Orders')}</CardTitle>
                <CardDescription>{t('Manage and track your recent orders.')}</CardDescription>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        {t('Filter Status')} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t('Filter by status')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allStatuses.map(status => (
                        <DropdownMenuCheckboxItem
                            key={status}
                            checked={statusFilter.includes(status)}
                            onCheckedChange={() => toggleStatusFilter(status)}
                        >
                            {t(status)}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Order ID')}</TableHead>
                <TableHead>{t('Customer')}</TableHead>
                <TableHead>{t('Product')}</TableHead>
                <TableHead>{t('Date')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead className="text-right">{t('Total')}</TableHead>
                <TableHead>
                  <span className="sr-only">{t('Actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{t(order.id)}</TableCell>
                    <TableCell>{t(order.customer)}</TableCell>
                    <TableCell>{t(order.product)}</TableCell>
                    <TableCell>{t(order.date)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{t(order.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{t(order.total)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('Toggle menu')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('Actions')}</DropdownMenuLabel>
                          <DropdownMenuItem>{t('View Details')}</DropdownMenuItem>
                          <DropdownMenuItem>{t('Print Invoice')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {t('No orders found.')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" disabled>{t('Previous')}</Button>
            <Button variant="outline" size="sm">{t('Next')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
