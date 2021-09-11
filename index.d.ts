export interface RandomGenerationError extends Error { }

export function secureRandomNumber(minimum: number, maximum: number, cb?: (err: Error, result: number) => void): Promise<number>;
