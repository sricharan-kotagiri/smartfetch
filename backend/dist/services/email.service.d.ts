export declare const initEmailService: () => Promise<any>;
export declare const getEmailTransporter: () => any;
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<any>;
export declare const sendOTPEmail: (email: string, otp: string, userName?: string) => Promise<any>;
export declare const sendVerificationEmail: (email: string, userName?: string) => Promise<any>;
export declare const sendWelcomeEmail: (email: string, userName?: string) => Promise<any>;
export {};
//# sourceMappingURL=email.service.d.ts.map