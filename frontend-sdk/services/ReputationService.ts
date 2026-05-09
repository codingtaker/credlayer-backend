/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReputationService {
    /**
     * Get reputation score for a Solana wallet
     * @returns any Wallet reputation payload
     * @throws ApiError
     */
    public static getApiReputation({
        wallet,
    }: {
        /**
         * Solana wallet address (base58)
         */
        wallet: string,
    }): CancelablePromise<{
        wallet: string;
        score: number | null;
        risk: string | null;
        explanation: string | null;
        signals: (Array<string> | Record<string, any>) | null;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reputation/{wallet}',
            path: {
                'wallet': wallet,
            },
            errors: {
                400: `Invalid wallet format`,
            },
        });
    }
}
