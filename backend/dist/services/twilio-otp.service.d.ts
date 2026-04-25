/**
 * Send OTP via Twilio Verify API using WhatsApp channel
 */
export declare const sendOTP: (phone: string) => Promise<void>;
/**
 * Verify OTP using Twilio Verify API
 */
export declare const verifyOTP: (phone: string, otp: string) => Promise<boolean>;
/**
 * Get OTP status
 */
export declare const getOTPStatus: (phone: string) => Promise<{
    exists: boolean;
    expiresIn: number;
    requestsRemaining?: undefined;
} | {
    exists: boolean;
    expiresIn: number;
    requestsRemaining: number;
}>;
//# sourceMappingURL=twilio-otp.service.d.ts.map