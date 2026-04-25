import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { supabase } from '../config/supabase.js';
import { getShopkeeperByUserId, updateShopkeeper, getAllShopkeepers, searchShopkeepersByLocation, } from '../services/shopkeeper.service.js';
import { logger } from '../middleware/logger.js';
const router = Router();
/**
 * Create shopkeeper profile
 */
router.post('/create-shop', asyncHandler(async (req, res) => {
    const { user_id, shop_name, owner_name, upi_id, location, latitude, longitude } = req.body;
    if (!user_id || !shop_name || !owner_name) {
        const error = new Error('user_id, shop_name, and owner_name are required');
        error.statusCode = 400;
        throw error;
    }
    try {
        logger.info(`🏪 [CREATE-SHOP] Request for user: ${user_id}`);
        // Validate user exists in users table
        const { data: userExists, error: userCheckError } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', user_id)
            .single();
        if (userCheckError || !userExists) {
            logger.error(`❌ [CREATE-SHOP] User not found: ${user_id}`);
            const error = new Error('User not found in database. Please sign up first.');
            error.statusCode = 404;
            throw error;
        }
        logger.info(`✅ [CREATE-SHOP] User validated: ${user_id}`);
        // Check if shopkeeper entry exists
        const { data: existingShopkeeper, error: shopkeeperCheckError } = await supabase
            .from('shopkeepers')
            .select('id')
            .eq('user_id', user_id)
            .single();
        if (shopkeeperCheckError && shopkeeperCheckError.code !== 'PGRST116') {
            throw shopkeeperCheckError;
        }
        let shopkeeperId = existingShopkeeper?.id;
        // If no shopkeeper entry, create one
        if (!shopkeeperId) {
            logger.info(`🏪 [CREATE-SHOP] Creating shopkeeper entry for user: ${user_id}`);
            const { data: newShopkeeper, error: createShopkeeperError } = await supabase
                .from('shopkeepers')
                .insert({
                user_id,
                shop_name,
                owner_name,
                upi_id,
                location,
                latitude: latitude || 0,
                longitude: longitude || 0
            })
                .select()
                .single();
            if (createShopkeeperError) {
                logger.error(`❌ [CREATE-SHOP] Shopkeeper creation error:`, createShopkeeperError);
                throw createShopkeeperError;
            }
            shopkeeperId = newShopkeeper.id;
            logger.info(`✅ [CREATE-SHOP] Shopkeeper created: ${shopkeeperId}`);
        }
        else {
            logger.info(`✅ [CREATE-SHOP] Shopkeeper already exists: ${shopkeeperId}`);
        }
        // Now create the shop with valid shopkeeper_id
        logger.info(`🏪 [CREATE-SHOP] Creating shop with shopkeeper_id: ${shopkeeperId}`);
        const { data: newShop, error: shopError } = await supabase
            .from('shops')
            .insert({
            shopkeeper_id: shopkeeperId,
            name: shop_name,
            description: '',
            category: '',
            address: location || '',
            latitude: latitude || 0,
            longitude: longitude || 0,
            is_active: true
        })
            .select()
            .single();
        if (shopError) {
            logger.error(`❌ [CREATE-SHOP] Shop creation error:`, shopError);
            throw shopError;
        }
        logger.info(`✅ [CREATE-SHOP] Shop created successfully: ${newShop.id}`);
        res.status(201).json({
            success: true,
            message: 'Shop created successfully',
            shop: newShop,
            shopkeeper_id: shopkeeperId,
        });
    }
    catch (error) {
        logger.error(`❌ [CREATE-SHOP] Error:`, error);
        if (error.code === '23503') {
            // Foreign key constraint violation
            const apiError = new Error('Shopkeeper not found. Please create shopkeeper profile first.');
            apiError.statusCode = 409;
            throw apiError;
        }
        if (error.code === '23505') {
            // Unique constraint violation
            const apiError = new Error('User already has a shop');
            apiError.statusCode = 409;
            throw apiError;
        }
        const apiError = new Error(error.message || 'Failed to create shop');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * Get shopkeeper profile
 */
router.get('/profile/:user_id', asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    if (!user_id) {
        const error = new Error('user_id is required');
        error.statusCode = 400;
        throw error;
    }
    try {
        const shopkeeper = await getShopkeeperByUserId(user_id);
        if (!shopkeeper) {
            const error = new Error('Shopkeeper not found');
            error.statusCode = 404;
            throw error;
        }
        res.json({
            success: true,
            shopkeeper,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to get shopkeeper');
        apiError.statusCode = error.statusCode || 500;
        throw apiError;
    }
}));
/**
 * Update shopkeeper profile
 */
router.put('/profile/:user_id', asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const data = req.body;
    if (!user_id) {
        const error = new Error('user_id is required');
        error.statusCode = 400;
        throw error;
    }
    try {
        const shopkeeper = await updateShopkeeper(user_id, data);
        res.json({
            success: true,
            message: 'Shop updated successfully',
            shopkeeper,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to update shop');
        apiError.statusCode = 400;
        throw apiError;
    }
}));
/**
 * Get all shopkeepers
 */
router.get('/all', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const { shopkeepers, total } = await getAllShopkeepers(limit, offset);
        res.json({
            success: true,
            shopkeepers,
            total,
            limit,
            offset,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to get shopkeepers');
        apiError.statusCode = 500;
        throw apiError;
    }
}));
/**
 * Search shopkeepers by location
 */
router.post('/search-location', asyncHandler(async (req, res) => {
    const { latitude, longitude, radius } = req.body;
    if (latitude === undefined || longitude === undefined) {
        const error = new Error('latitude and longitude are required');
        error.statusCode = 400;
        throw error;
    }
    try {
        const shopkeepers = await searchShopkeepersByLocation(latitude, longitude, radius || 5);
        res.json({
            success: true,
            shopkeepers,
            count: shopkeepers.length,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to search shopkeepers');
        apiError.statusCode = 500;
        throw apiError;
    }
}));
export default router;
//# sourceMappingURL=shopkeeper.routes.js.map