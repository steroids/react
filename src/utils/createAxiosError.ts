import {AxiosError} from 'axios';

interface ValidationError {
    statusCode: number,
    error?: string,
    message?: string,
    errors?: Record<string, unknown>,
}

export function createAxiosError(validationError: ValidationError): AxiosError {
    const error = new Error(validationError.message || validationError.error || 'Request failed') as AxiosError;

    error.isAxiosError = true;
    error.response = {
        data: validationError,
        status: validationError.statusCode,
        statusText: validationError.message || validationError.error || 'Unknown error',
        headers: {},
        config: {},
    };
    error.code = validationError.error;

    return error;
}
