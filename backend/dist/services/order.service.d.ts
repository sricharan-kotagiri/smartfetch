interface CreateOrderData {
    user_id: string;
    total_amount: number;
    delivery_address?: string;
    items: Array<{
        product_id: string;
        quantity: number;
        price: number;
    }>;
}
interface UpdateOrderData {
    status?: string;
    delivery_address?: string;
}
/**
 * Create a new order with items
 */
export declare const createOrder: (data: CreateOrderData) => Promise<any>;
/**
 * Get order by ID with items
 */
export declare const getOrderById: (id: string) => Promise<any>;
/**
 * Get all orders by user
 */
export declare const getOrdersByUser: (user_id: string, limit?: number, offset?: number) => Promise<{
    orders: any[];
    total: number | null;
}>;
/**
 * Get order items
 */
export declare const getOrderItems: (order_id: string) => Promise<any[]>;
/**
 * Update order status
 */
export declare const updateOrder: (id: string, data: UpdateOrderData) => Promise<any>;
/**
 * Cancel order
 */
export declare const cancelOrder: (id: string) => Promise<any>;
/**
 * Get all orders (admin)
 */
export declare const getAllOrders: (limit?: number, offset?: number) => Promise<{
    orders: any[];
    total: number | null;
}>;
/**
 * Get orders by status
 */
export declare const getOrdersByStatus: (status: string, limit?: number) => Promise<any[]>;
export {};
//# sourceMappingURL=order.service.d.ts.map