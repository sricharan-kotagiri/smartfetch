import { createClient } from '@supabase/supabase-js';
import { logger } from './logger.js';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Missing or invalid authorization header');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.substring(7);
        // Verify token with Supabase
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            const error = new Error('Invalid or expired token');
            error.statusCode = 401;
            throw error;
        }
        // Attach user to request
        req.user = {
            id: data.user.id,
            email: data.user.email,
        };
        next();
    }
    catch (error) {
        logger.error('Auth middleware error:', error);
        const apiError = new Error(error.message || 'Authentication failed');
        apiError.statusCode = error.statusCode || 401;
        next(apiError);
    }
};
export default authMiddleware;
//# sourceMappingURL=auth.middleware.js.map