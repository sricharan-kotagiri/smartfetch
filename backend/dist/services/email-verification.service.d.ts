/**
 * Generate a secure verification token
 */
export declare const generateVerificationToken: () => string;
/**
 * Get user by email
 */
export declare const getUserByEmail: (email: string) => Promise<any>;
/**
 * Check if email is verified
 */
export declare const isEmailVerified: (email: string) => Promise<boolean>;
/**
 * Send verification email to user
 */
export declare const sendVerificationEmail: (email: string, userId: string, userName?: string) => Promise<{
    success: boolean;
    token?: string;
    error?: string;
}>;
/**
 * Verify email token and mark user as verified
 */
export declare const verifyEmailToken: (token: string) => Promise<{
    success: boolean;
    userId?: string;
    error?: string;
}>;
/**
 * Resend verification email
 */
export declare const resendVerificationEmail: (email: string, userId: string, userName?: string) => Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Check if user's email is verified
 */
export declare const isEmailVerified: (userId: string) => Promise<boolean>;
/**
 * Get user by email
 */
export declare const getUserByEmail: (email: string) => Promise<any>;
//# sourceMappingURL=email-verification.service.d.ts.map