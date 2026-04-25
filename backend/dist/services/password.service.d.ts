/**
 * Hash a password
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * Compare password with hash
 */
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
/**
 * Validate password strength
 */
export declare const validatePasswordStrength: (password: string) => {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=password.service.d.ts.map