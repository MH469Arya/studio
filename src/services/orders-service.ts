
'use server';

import { subDays, format } from 'date-fns';

export type Order = {
    id: string;
    customer: string;
    product: string;
    date: string;
    status: 'Fulfilled' | 'Shipped' | 'Processing' | 'Pending' | 'Cancelled';
    total: string;
};

// Generate more dynamic mock data for better chart visualization
const generateMockOrders = (): Order[] => {
    const orders: Order[] = [];
    const today = new Date();
    const products = [
        { name: 'Ganjifa Cards', price: 259 },
        { name: 'Kolhapuri Chappals', price: 469 },
        { name: 'Handwoven Pashmina Shawl', price: 8500 },
        { name: 'Block-Printed Tablecloth', price: 1200 },
        { name: 'Terracotta Diyas (Set of 4)', price: 150 },
    ];
    const customers = ['Ravi Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Vikram Singh', 'Anjali Gupta', 'Deepak Verma', 'Meera Iyer'];
    const statuses: Order['status'][] = ['Fulfilled', 'Shipped', 'Processing', 'Pending', 'Cancelled'];

    // Generate orders for the past year
    for (let i = 0; i < 200; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const date = subDays(today, Math.floor(Math.random() * 365));
        
        orders.push({
            id: `ORD${String(1000 + i).padStart(4, '0')}`,
            customer: customers[Math.floor(Math.random() * customers.length)],
            product: product.name,
            date: format(date, 'yyyy-MM-dd'),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            total: `₹${product.price.toFixed(2)}`,
        });
    }

    return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const mockOrders: Order[] = generateMockOrders();

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
