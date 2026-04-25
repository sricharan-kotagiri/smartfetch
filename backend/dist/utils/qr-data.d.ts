/**
 * Build QR code data structure
 * Returns JSON object to be encoded in QR code
 */
export interface QRData {
    orderId: string;
    pickupCode: string;
    customerName: string;
    shopName: string;
    shopkeeperName: string;
    items: Array<{
        name: string;
        qty: number;
        unitPrice: number;
        subtotal: number;
    }>;
    totalAmount: number;
    paymentMethod: string;
    pickupTime: string;
    createdAt: string;
}
export declare const buildQRData: (orderId: string, pickupCode: string, customerName: string, shopName: string, shopkeeperName: string, items: Array<{
    name: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
}>, totalAmount: number, paymentMethod: string, pickupTime: string, createdAt: string) => QRData;
export default buildQRData;
//# sourceMappingURL=qr-data.d.ts.map