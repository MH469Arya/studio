
'use server';

export type Order = {
    id: string;
    customer: string;
    product: string;
    date: string;
    status: 'Fulfilled' | 'Shipped' | 'Processing' | 'Pending' | 'Cancelled';
    total: string;
};

const mockOrders: Order[] = [
    { id: 'ORD001', customer: 'Ravi Kumar', product: 'Ganjifa Cards', date: '2023-11-23', status: 'Fulfilled', total: '₹2,59.00' },
    { id: 'ORD002', customer: 'Priya Sharma', product: 'Kolhapuri Chappals', date: '2023-11-20', status: 'Shipped', total: '₹469.00' },
    { id: 'ORD003', customer: 'Amit Patel', product: 'Ganjifa Cards', date: '2023-11-22', status: 'Processing', total: '₹259.00' },
    { id: 'ORD004', customer: 'Sunita Devi', product: 'Kolhapuri Chappals', date: '2023-11-21', status: 'Fulfilled', total: '₹469.00' },
    { id: 'ORD005', customer: 'Vikram Singh', product: 'Ganjifa Cards', date: '2023-11-24', status: 'Pending', total: '₹259.00' },
    { id: 'ORD006', customer: 'Anjali Gupta', product: 'Kolhapuri Chappals', date: '2023-11-19', status: 'Cancelled', total: '₹469.00' },
    { id: 'ORD007', customer: 'Deepak Verma', product: 'Ganjifa Cards', date: '2023-11-25', status: 'Processing', total: '₹259.00' },
    { id: 'ORD008', customer: 'Meera Iyer', product: 'Kolhapuri Chappals', date: '2023-11-18', status: 'Fulfilled', total: '₹469.00' },
    // Add more orders to make the data richer
    { id: 'ORD009', customer: 'Rajesh Singh', product: 'Handwoven Pashmina Shawl', date: '2023-11-26', status: 'Shipped', total: '₹8500.00' },
    { id: 'ORD010', customer: 'Sneha Reddy', product: 'Handwoven Pashmina Shawl', date: '2023-11-27', status: 'Processing', total: '₹8500.00' },
    { id: 'ORD011', customer: 'Kavita Nair', product: 'Handwoven Pashmina Shawl', date: '2023-11-28', status: 'Fulfilled', total: '₹8500.00' },
     { id: 'ORD012', customer: 'Suresh Menon', product: 'Handwoven Pashmina Shawl', date: '2023-11-28', status: 'Fulfilled', total: '₹8500.00' },
];

export async function getOrders(): Promise<Order[]> {
    // In a real app, you would fetch this from a database.
    return Promise.resolve(mockOrders);
}

export async function getSalesVolumeForProduct(productName: string): Promise<number> {
    const orders = await getOrders();
    // In a real app, you would also filter by a date range.
    const relevantOrders = orders.filter(order => order.product === productName && order.status !== 'Cancelled');
    return relevantOrders.length;
}
