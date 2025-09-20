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

const mockOrders = [
    { id: 'ORD001', customer: 'Ravi Kumar', product: 'Ganjifa Cards', date: '2023-11-23', status: 'Fulfilled', total: '₹2,59.00' },
    { id: 'ORD002', customer: 'Priya Sharma', product: 'Kolhapuri Chappals', date: '2023-11-20', status: 'Shipped', total: '₹469.00' },
    { id: 'ORD003', customer: 'Amit Patel', product: 'Ganjifa Cards', date: '2023-11-22', status: 'Processing', total: '₹259.00' },
    { id: 'ORD004', customer: 'Sunita Devi', product: 'Kolhapuri Chappals', date: '2023-11-21', status: 'Fulfilled', total: '₹469.00' },
    { id: 'ORD005', customer: 'Vikram Singh', product: 'Ganjifa Cards', date: '2023-11-24', status: 'Pending', total: '₹259.00' },
    { id: 'ORD006', customer: 'Anjali Gupta', product: 'Kolhapuri Chappals', date: '2023-11-19', status: 'Cancelled', total: '₹469.00' },
    { id: 'ORD007', customer: 'Deepak Verma', product: 'Ganjifa Cards', date: '2023-11-25', status: 'Processing', total: '₹259.00' },
    { id: 'ORD008', customer: 'Meera Iyer', product: 'Kolhapuri Chappals', date: '2023-11-18', status: 'Fulfilled', total: '₹469.00' },
];

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
  const [statusFilter, setStatusFilter] = React.useState<string[]>(['Processing', 'Pending', 'Shipped']);

  const filteredOrders = mockOrders.filter(order => statusFilter.includes(order.status));

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
                <CardTitle className="font-headline">Orders</CardTitle>
                <CardDescription>Manage and track your recent orders.</CardDescription>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        Filter Status <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allStatuses.map(status => (
                        <DropdownMenuCheckboxItem
                            key={status}
                            checked={statusFilter.includes(status)}
                            onCheckedChange={() => toggleStatusFilter(status)}
                        >
                            {status}
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.total}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
        </div>
      </CardContent>
    </Card>
  );
}
