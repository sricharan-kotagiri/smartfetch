import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from '../middleware/errorHandler.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = Router();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
/**
 * GET /api/products
 * Get all products or filter by shop_id
 */
router.get('/', asyncHandler(async (req, res) => {
    const { shop_id } = req.query;
    try {
        let query = supabase.from('products').select('*');
        if (shop_id) {
            query = query.eq('shop_id', shop_id);
        }
        const { data, error } = await query;
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            products: data || []
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to fetch products');
        apiError.statusCode = 400;
        throw apiError;
    }
}));
/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            const apiError = new Error('Product not found');
            apiError.statusCode = 404;
            throw apiError;
        }
        res.json({
            success: true,
            product: data
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to fetch product');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * POST /api/products
 * Create new product (shopkeeper only)
 */
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { shop_id, product_name, category, price, stock_quantity, description, image_url } = req.body;
    if (!shop_id || !product_name || !category || price === undefined || stock_quantity === undefined) {
        const error = new Error('shop_id, product_name, category, price, and stock_quantity are required');
        error.statusCode = 400;
        throw error;
    }
    try {
        // Verify ownership of shop
        const { data: shop } = await supabase
            .from('shops')
            .select('shopkeeper_id')
            .eq('id', shop_id)
            .single();
        if (!shop || shop.shopkeeper_id !== userId) {
            const error = new Error('Unauthorized to add products to this shop');
            error.statusCode = 403;
            throw error;
        }
        // Create product
        const { data, error } = await supabase.from('products').insert({
            shop_id,
            product_name,
            category,
            price,
            stock_quantity,
            description: description || null,
            image_url: image_url || null,
            is_available: true
        });
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: data?.[0]
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to create product');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * PUT /api/products/:id
 * Update product (shopkeeper only)
 */
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const updateData = req.body;
    try {
        // Verify ownership
        const { data: product } = await supabase
            .from('products')
            .select('shop_id')
            .eq('id', id)
            .single();
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        const { data: shop } = await supabase
            .from('shops')
            .select('shopkeeper_id')
            .eq('id', product.shop_id)
            .single();
        if (!shop || shop.shopkeeper_id !== userId) {
            const error = new Error('Unauthorized to update this product');
            error.statusCode = 403;
            throw error;
        }
        // Update product
        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id);
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            message: 'Product updated successfully',
            product: data?.[0]
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to update product');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * DELETE /api/products/:id
 * Delete product (shopkeeper only)
 */
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    try {
        // Verify ownership
        const { data: product } = await supabase
            .from('products')
            .select('shop_id')
            .eq('id', id)
            .single();
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        const { data: shop } = await supabase
            .from('shops')
            .select('shopkeeper_id')
            .eq('id', product.shop_id)
            .single();
        if (!shop || shop.shopkeeper_id !== userId) {
            const error = new Error('Unauthorized to delete this product');
            error.statusCode = 403;
            throw error;
        }
        // Delete product
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to delete product');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * PATCH /api/products/:id/availability
 * Toggle product availability
 */
router.patch('/:id/availability', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    try {
        // Verify ownership
        const { data: product } = await supabase
            .from('products')
            .select('shop_id, is_available')
            .eq('id', id)
            .single();
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        const { data: shop } = await supabase
            .from('shops')
            .select('shopkeeper_id')
            .eq('id', product.shop_id)
            .single();
        if (!shop || shop.shopkeeper_id !== userId) {
            const error = new Error('Unauthorized to update this product');
            error.statusCode = 403;
            throw error;
        }
        // Toggle availability
        const { data, error } = await supabase
            .from('products')
            .update({ is_available: !product.is_available })
            .eq('id', id);
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            message: `Product ${!product.is_available ? 'available' : 'unavailable'} successfully`,
            product: data?.[0]
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to update product availability');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
export default router;
//# sourceMappingURL=products.routes.js.map