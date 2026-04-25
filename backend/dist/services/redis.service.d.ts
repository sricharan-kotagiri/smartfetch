export declare const initRedis: () => Promise<any>;
export declare const getRedis: () => any;
export declare const cacheSet: (key: string, value: any, expirySeconds: number) => Promise<void>;
export declare const cacheGet: (key: string) => Promise<any>;
export declare const cacheDel: (key: string) => Promise<void>;
//# sourceMappingURL=redis.service.d.ts.map