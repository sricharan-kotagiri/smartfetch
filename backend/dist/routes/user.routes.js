import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getUserById, updateUserProfile, getAllUsers, searchUsers } from '../services/database.service.js';
import { logger } from '../middleware/logger.js';
const router = Router();
// Get user profile
router.get('/profile/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        const error = new Error('User ID is required');
        error.statusCode = 400;
        throw error;
    }
    try {
        const user = await getUserById(userId);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.json({
            success: true,
            user,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to fetch user profile');
        apiError.statusCode = error.statusCode || 500;
        throw apiError;
    }
}));
// Update user profile
router.put('/profile/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { full_name, phone, email } = req.body;
    if (!userId) {
        const error = new Error('User ID is required');
        error.statusCode = 400;
        throw error;
    }
    try {
        const user = await updateUserProfile(userId, {
            full_name,
            phone,
            email,
        });
        logger.info(`User profile updated: ${userId}`);
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to update profile');
        apiError.statusCode = 400;
        throw apiError;
    }
}));
// Get all users (admin only)
router.get('/all', asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const { users, total } = await getAllUsers(limit, offset);
        res.json({
            success: true,
            users,
            total,
            limit,
            offset,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to fetch users');
        apiError.statusCode = 500;
        throw apiError;
    }
}));
// Search users
router.get('/search', asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) {
        const error = new Error('Search query is required');
        error.statusCode = 400;
        throw error;
    }
    try {
        const users = await searchUsers(q);
        res.json({
            success: true,
            users,
        });
    }
    catch (error) {
        const apiError = new Error(error.message || 'Failed to search users');
        apiError.statusCode = 500;
        throw apiError;
    }
}));
export default router;
//# sourceMappingURL=user.routes.js.map