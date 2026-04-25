/**
 * Initialize database tables and ensure they exist
 */
export declare const initializeDatabase: () => Promise<boolean>;
/**
 * Create or update a user in the database
 */
export declare const createOrUpdateUser: (userData: {
    id?: string;
    email?: string;
    phone?: string;
    full_name?: string;
    role?: "customer" | "shopkeeper";
}) => Promise<any>;
/**
 * Get user by email
 */
export declare const getUserByEmail: (email: string) => Promise<any>;
/**
 * Get user by phone
 */
export declare const getUserByPhone: (phone: string) => Promise<any>;
/**
 * Get user by ID
 */
export declare const getUserById: (userId: string) => Promise<any>;
/**
 * Update user profile
 */
export declare const updateUserProfile: (userId: string, updates: {
    full_name?: string;
    phone?: string;
    email?: string;
}) => Promise<any>;
/**
 * Get all users (for admin purposes)
 */
export declare const getAllUsers: (limit?: number, offset?: number) => Promise<{
    users: any[];
    total: number | null;
}>;
/**
 * Delete user (soft delete - mark as inactive)
 */
export declare const deleteUser: (userId: string) => Promise<any>;
/**
 * Search users by name or email
 */
export declare const searchUsers: (query: string) => Promise<any[]>;
//# sourceMappingURL=database.service.d.ts.map