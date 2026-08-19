"use client";

import { createApiNexus, CallOptions, IResponseFormat } from "@niteen5/api-nexus";
import * as endpoints from "./endpoint";
import DataManager from "../data-manager";

const allEndpoints = Object.values(endpoints).reduce<Record<string, string>>((acc, curr) => {
    if (typeof curr === "object" && curr !== null) {
        return { ...acc, ...curr };
    }
    return acc;
}, {});

// Create the base API instance using native fetch
const baseApi = createApiNexus({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
    endpoints: allEndpoints,
    httpClient: "fetch",
});

// We wrap the `call` method to act as our request & response interceptor
export const apiNexus = {
    ...baseApi,
    call: async <T = any>(
        apiKey: string,
        options?: CallOptions
    ): Promise<IResponseFormat<T>> => {
        const reqOptions = { ...options };
        reqOptions.config = {
            ...reqOptions.config,
            cache: 'no-store',
            next: { revalidate: 0 }
        };
        const apikey = apiKey as keyof typeof allEndpoints;

        const headers = new Headers(reqOptions.config.headers || {});

        headers.set("Content-type", "application/json");
        headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.set("Pragma", "no-cache");

        const endpointPath = allEndpoints[apikey] as string | undefined;

        // Add Authorization header if token exists
        const token = DataManager.getToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        reqOptions.config.headers = headers;

        const response = (await baseApi.call<T>(apikey, reqOptions)) as IResponseFormat<T> & { data: { data: T } };

        if (!response.isSuccess) {
            if (response.status === 401) {
                if (endpointPath && !endpointPath.includes("auth")) {
                    handleLogout();
                }
            }
        }

        const errObj = response?.error as any;
        const rawData = (response?.data !== undefined ? response.data : errObj?.responseData || errObj?.response?.data) as any;

        let extractedMessage: string | undefined = undefined;

        // 1. Check response.data.message (NestJS default error structure)
        if (rawData && typeof rawData === "object" && rawData.message) {
            extractedMessage = Array.isArray(rawData.message) ? rawData.message.join(", ") : rawData.message;
        }

        // 2. Check errObj.responseData.message or errObj.response.data.message (api-nexus fetch/axios error structure)
        if (!extractedMessage && errObj && typeof errObj === "object") {
            const respMessage = errObj?.responseData?.message || errObj?.response?.data?.message || errObj?.message;
            if (respMessage && respMessage !== "Request Failed") {
                extractedMessage = Array.isArray(respMessage) ? respMessage.join(", ") : respMessage;
            }
        }

        // 3. Fallback to response.message if set and valid
        if (!extractedMessage || extractedMessage === "Request Failed") {
            const fallback = response?.message;
            if (fallback && fallback !== "Request Failed") {
                extractedMessage = fallback;
            }
        }

        const finalMessage = extractedMessage || "An error occurred. Please try again.";
        const isSuccess = response?.isSuccess || !!(response.status && ((response.status >= 200 && response.status <= 299) || response.status === 304));

        return {
            ...response,
            data: rawData,
            message: finalMessage,
            isSuccess: isSuccess,
        };
    }
};

function handleLogout() {
    DataManager.cleanAll();
    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}

export default apiNexus;
