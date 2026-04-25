import { logger } from './logger.js';
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    logger.error({
        statusCode,
        message,
        path: req.path,
        method: req.method,
        details: err.details,
        stack: err.stack,
    });
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { details: err.details }),
    });
};
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
//# sourceMappingURL=errorHandler.js.map