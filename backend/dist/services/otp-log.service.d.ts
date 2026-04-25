/**
 * Log OTP sent event
 */
export declare const logOtpSent: (phone: string) => Promise<void>;
/**
 * Log OTP verified event
 */
export declare const logOtpVerified: (phone: string) => Promise<void>;
/**
 * Log OTP failed event
 */
export declare const logOtpFailed: (phone: string, error_message: string) => Promise<void>;
/**
 * Get OTP logs for a phone number
 */
export declare const getOtpLogs: (phone: string, limit?: number) => Promise<any[]>;
/**
 * Get OTP statistics
 */
export declare const getOtpStats: (hours?: number) => Promise<{
    total: number;
    sent: number;
    verified: number;
    failed: number;
}>;
//# sourceMappingURL=otp-log.service.d.ts.map