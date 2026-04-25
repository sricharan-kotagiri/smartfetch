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
 * GET /api/cart
 * Get current user's cart
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    try {
        const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
          *,
          products (
            id,
            product_name,
            price,
            stock_quantity,
            image_url,
            shop_id
          )
        `)
            .eq('customer_id', userId);
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            cart: cartItems || []
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to fetch cart');
        apiError.statusCode = 400;
        throw apiError;
    }
}));
/**
 * POST /api/cart
 * Add item to cart
 */
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity || quantity <= 0) {
        const error = new Error('product_id and quantity (>0) are required');
        error.statusCode = 400;
        throw error;
    }
    try {
        // Verify product exists and has stock
        const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', product_id)
            .single();
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        if (product.stock_quantity < quantity) {
            const error = new Error('Insufficient stock');
            error.statusCode = 400;
            throw error;
        }
        // Check if item already in cart
        const { data: existingItem } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('customer_id', userId)
            .eq('product_id', product_id)
            .single();
        if (existingItem) {
            // Update quantity
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity: existingItem.quantity + quantity })
                .eq('id', existingItem.id);
            if (error) {
                const apiError = new Error(error.message);
                apiError.statusCode = 400;
                throw apiError;
            }
            res.json({
                success: true,
                message: 'Cart item updated',
                cartItem: data?.[0]
            });
        }
        else {
            // Add new item
            const { data, error } = await supabase.from('cart_items').insert({
                customer_id: userId,
                product_id,
                quantity
            });
            if (error) {
                const apiError = new Error(error.message);
                apiError.statusCode = 400;
                throw apiError;
            }
            res.status(201).json({
                success: true,
                message: 'Item added to cart',
                cartItem: data?.[0]
            });
        }
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to add to cart');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * PUT /api/cart/:id
 * Update cart item quantity
 */
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        const error = new Error('quantity (>0) is required');
        error.statusCode = 400;
        throw error;
    }
    try {
        // Verify ownership
        const { data: cartItem } = await supabase
            .from('cart_items')
            .select('customer_id, product_id')
            .eq('id', id)
            .single();
        if (!cartItem || cartItem.customer_id !== userId) {
            const error = new Error('Cart item not found or unauthorized');
            error.statusCode = 404;
            throw error;
        }
        // Verify stock
        const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', cartItem.product_id)
            .single();
        if (!product || product.stock_quantity < quantity) {
            const error = new Error('Insufficient stock');
            error.statusCode = 400;
            throw error;
        }
        // Update quantity
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', id);
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            message: 'Cart item updated',
            cartItem: data?.[0]
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to update cart item');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * DELETE /api/cart/:id
 * Remove item from cart
 */
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    try {
        // Verify ownership
        const { data: cartItem } = await supabase
            .from('cart_items')
            .select('customer_id')
            .eq('id', id)
            .single();
        if (!cartItem || cartItem.customer_id !== userId) {
            const error = new Error('Cart item not found or unauthorized');
            error.statusCode = 404;
            throw error;
        }
        // Delete item
        const { error } = await supabase.from('cart_items').delete().eq('id', id);
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to remove from cart');
        apiError.statusCode = error.statusCode || 400;
        throw apiError;
    }
}));
/**
 * DELETE /api/cart
 * Clear entire cart
 */
router.delete('/', authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('customer_id', userId);
        if (error) {
            const apiError = new Error(error.message);
            apiError.statusCode = 400;
            throw apiError;
        }
        res.json({
            success: true,
            message: 'Cart cleared'
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to clear cart');
        apiError.statusCode = 400;
        throw apiError;
    }
}));
export default router;
//# sourceMappingURL=cart.routes.js.map