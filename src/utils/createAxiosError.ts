import {IFetchConfig} from '@steroidsjs/core/hooks/useFetch';
import {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';

export interface IApiErrorPayload {
    statusCode: number,
    error?: string,
    message?: string,
    errors?: Record<string, unknown>,
}

export function createAxiosError(
    apiErrorPayload: IApiErrorPayload,
    fetchConfig: IFetchConfig,
): AxiosError<IApiErrorPayload> {
    const message = apiErrorPayload.message
        || apiErrorPayload.error
        || 'Request failed';

    const config: AxiosRequestConfig = {
        url: fetchConfig.url,
        method: fetchConfig.method ?? 'GET',
        params: fetchConfig.params ?? {},
    };

    const response: AxiosResponse<IApiErrorPayload> = {
        data: apiErrorPayload,
        status: apiErrorPayload.statusCode,
        statusText: message,
        headers: {},
        config,
    };

    const error = new Error(message) as AxiosError<IApiErrorPayload>;

    error.name = 'AxiosError';
    error.config = config;
    error.code = undefined;
    error.request = {};
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = () => ({
        message: error.message,
        name: error.name,
        code: undefined,
        config: error.config,
        status: error.response?.status,
        stack: error.stack,
    });

    return error;
}
