export const buildQRData = (orderId, pickupCode, customerName, shopName, shopkeeperName, items, totalAmount, paymentMethod, pickupTime, createdAt) => {
    return {
        orderId,
        pickupCode,
        customerName,
        shopName,
        shopkeeperName,
        items,
        totalAmount,
        paymentMethod,
        pickupTime,
        createdAt,
    };
};
export default buildQRData;
//# sourceMappingURL=qr-data.js.map