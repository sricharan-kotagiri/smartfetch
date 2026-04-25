interface CreateShopkeeperData {
    user_id: string;
    shop_name: string;
    owner_name: string;
    upi_id?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}
interface UpdateShopkeeperData {
    shop_name?: string;
    owner_name?: string;
    upi_id?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}
/**
 * Validate that user exists in users table
 */
export declare const validateUserExists: (user_id: string) => Promise<{
    id: any;
    email: any;
    role: any;
}>;
/**
 * Create a new shopkeeper profile
 */
export declare const createShopkeeper: (data: CreateShopkeeperData) => Promise<any>;
/**
 * Get shopkeeper by user ID
 */
export declare const getShopkeeperByUserId: (user_id: string) => Promise<any>;
/**
 * Get shopkeeper by ID
 */
export declare const getShopkeeperById: (id: string) => Promise<any>;
/**
 * Update shopkeeper profile
 */
export declare const updateShopkeeper: (user_id: string, data: UpdateShopkeeperData) => Promise<any>;
/**
 * Get all shopkeepers (for discovery)
 */
export declare const getAllShopkeepers: (limit?: number, offset?: number) => Promise<{
    shopkeepers: any[];
    total: number | null;
}>;
/**
 * Search shopkeepers by location
 */
export declare const searchShopkeepersByLocation: (latitude: number, longitude: number, radiusKm?: number) => Promise<any[]>;
/**
 * Delete shopkeeper profile
 */
export declare const deleteShopkeeper: (user_id: string) => Promise<boolean>;
export {};
//# sourceMappingURL=shopkeeper.service.d.ts.map