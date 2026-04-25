interface CreateProductData {
    shop_id: string;
    product_name: string;
    category: string;
    price: number;
    stock_quantity: number;
    description?: string;
    image_url?: string;
}
interface UpdateProductData {
    product_name?: string;
    category?: string;
    price?: number;
    stock_quantity?: number;
    description?: string;
    image_url?: string;
}
/**
 * Create a new product
 */
export declare const createProduct: (data: CreateProductData) => Promise<any>;
/**
 * Get product by ID
 */
export declare const getProductById: (id: string) => Promise<any>;
/**
 * Get all products by shop
 */
export declare const getProductsByShop: (shop_id: string, limit?: number, offset?: number) => Promise<{
    products: any[];
    total: number | null;
}>;
/**
 * Get all products (for discovery)
 */
export declare const getAllProducts: (limit?: number, offset?: number) => Promise<{
    products: any[];
    total: number | null;
}>;
/**
 * Search products by name or category
 */
export declare const searchProducts: (query: string, limit?: number) => Promise<any[]>;
/**
 * Update product
 */
export declare const updateProduct: (id: string, data: UpdateProductData) => Promise<any>;
/**
 * Delete product
 */
export declare const deleteProduct: (id: string) => Promise<boolean>;
/**
 * Get products by category
 */
export declare const getProductsByCategory: (category: string, limit?: number) => Promise<any[]>;
export {};
//# sourceMappingURL=product.service.d.ts.map