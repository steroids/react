import '@testing-library/jest-dom';
import axios, {AxiosError} from 'axios';
import {act, renderHook, waitFor} from '@testing-library/react';
import useFetch, {
    normalizeConfig,
    getConfigId,
    defaultFetchHandler,
    fetchData,
    IFetchConfig,
} from '../../src/hooks/useFetch';
import * as fetchHelpers from '../../src/hooks/useFetch';
import useComponents from '../../src/hooks/useComponents';
import useSsr from '../../src/hooks/useSsr';

jest.mock('axios');

describe('normalizeConfig', () => {
    it('should return null if the config is null', () => {
        const expectedResult = null;
        const config = null;

        expect(normalizeConfig(config)).toBe(expectedResult);
    });

    it('should fill in default values for missing properties', () => {
        const config = {
            url: '/user',
        };

        const expectedNormalizedConfig = {
            id: null,
            url: '/user',
            method: 'get',
            params: {},
            options: null,
            onFetch: null,
        };

        const normalizedConfig = normalizeConfig(config);

        expect(normalizedConfig).toEqual(expectedNormalizedConfig);
    });

    it('should override the default values with the provided config', () => {
        const config = {
            url: '/user',
            method: 'get',
            params: {
                name: 'john',
            },
        };

        const expectedNormalizedConfigWithOverrides = {
            id: null,
            url: '/user',
            method: 'get',
            params: {
                name: 'john',
            },
            options: null,
            onFetch: null,
        };

        const normalizedConfig = normalizeConfig(config);

        expect(normalizedConfig).toEqual(expectedNormalizedConfigWithOverrides);
    });
});

describe('getConfigId', () => {
    it('should return null if the config is null', () => {
        const expectedResult = null;
        const config = null;

        expect(getConfigId(config)).toBe(expectedResult);
    });

    it('should return the id if it is present in the config', () => {
        const config = {
            id: 'config-id',
        };

        const configId = getConfigId(config);

        expect(configId).toBe(config.id);
    });

    it('should return the trimmed url if the id is not present in the config', () => {
        const config = {
            url: '/user',
        };

        const expectedConfigId = 'user';

        const configId = getConfigId(config);

        expect(configId).toBe(expectedConfigId);
    });

    it('should log a warning if the id is not present in the config', () => {
        const config = {
            url: '/',
        };

        const expectedErrorMessage = 'Please set id for fetch config, it`s necessary for SSR to work properly';

        const consoleSpy = jest.spyOn(console, 'warn');

        getConfigId(config);

        expect(consoleSpy).toHaveBeenCalledWith(expectedErrorMessage);
    });
});

describe('defaultFetchHandler', () => {
    const mockedFetchedData = {data: 'data'};

    const mockedComponents = {
        http: {
            send: jest.fn(() => Promise.resolve(mockedFetchedData)),
        },
    };

    const mockedConfig = {
        method: 'get',
        url: '/user',
        params: {
            name: 'john',
        },
        options: {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    };

    const addCancelToken = jest.fn();

    it('should return a promise', () => {
        const expectedInstance = Promise;

        const fetchHandler = defaultFetchHandler(mockedConfig, mockedComponents, addCancelToken);

        expect(fetchHandler).toBeInstanceOf(expectedInstance);
    });

    it('should call the http.send method with the correct parameters', () => {
        const cancelToken = expect.any(axios.CancelToken);

        const fetchHandler = defaultFetchHandler(mockedConfig, mockedComponents, addCancelToken);

        fetchHandler.then(() => {
            expect(mockedComponents.http.send).toHaveBeenCalledWith(
                mockedConfig.method,
                mockedConfig.url,
                mockedConfig.params,
                {
                    ...mockedConfig.options,
                    cancelToken,
                },
            );
        });
    });

    it('should return the data from the http.send method', async () => {
        const fetchHandler = defaultFetchHandler(mockedConfig, mockedComponents, addCancelToken);

        const data = await fetchHandler;

        expect(data).toBe(mockedFetchedData.data);
    });
});

describe('fetchData', () => {
    const mockedFetchedData = {data: 'data'};

    const mockedComponents = {
        http: {
            send: jest.fn(() => Promise.resolve(mockedFetchedData)),
        },
    };

    const mockedConfig = {
        method: 'get',
        url: '/user',
    };

    const addCancelToken = jest.fn();

    const onFetchSpy = jest.fn(() => Promise.resolve(mockedFetchedData));

    it('should return a promise', () => {
        const expectedInstance = Promise;

        const fetchDataPromise = fetchData(mockedConfig, mockedComponents, addCancelToken);

        expect(fetchDataPromise).toBeInstanceOf(expectedInstance);
    });

    it('should call the defaultFetchHandler function if the onFetch function is not provided', async () => {
        await fetchData(mockedConfig, mockedComponents, addCancelToken);

        expect(mockedComponents.http.send).toHaveBeenCalled();
    });

    it('should call the the onFetch function if is provided', async () => {
        const config = {
            ...mockedConfig,
            onFetch: onFetchSpy,
        };

        const data = await fetchData(config, mockedComponents, addCancelToken);

        expect(onFetchSpy).toHaveBeenCalledWith(config, mockedComponents, addCancelToken);
        expect(data).toBe(mockedFetchedData);
    });

    it('should return the data from the defaultFetchHandler function', async () => {
        const data = await fetchData(mockedConfig, mockedComponents, addCancelToken);

        expect(data).toBe(mockedFetchedData.data);
    });

    it('should return the data from the onFetch function', async () => {
        const config = {
            ...mockedConfig,
            onFetch: onFetchSpy,
        };

        const data = await fetchData(config, mockedComponents, addCancelToken);

        expect(onFetchSpy).toHaveBeenCalled();
        expect(data).toBe(mockedFetchedData);
    });
});

jest.mock('../../src/hooks/useComponents');
jest.mock('../../src/hooks/useSsr');

const mockedUseComponents = (useComponents as jest.Mock);
const mockedUseSsr = (useSsr as jest.Mock);

describe('useFetch Hook', () => {
    const mockedRawConfig: IFetchConfig = {
        url: '/user',
        method: 'post',
        params: {
            name: 'john',
        },
    };

    const mockedNormalizedConfig = {
        id: null,
        url: '/user',
        method: 'post',
        params: {
            name: 'john',
        },
        options: null,
        onFetch: null,
    };

    const mockedFetchData = jest.spyOn(fetchHelpers, 'fetchData');

    const expectedFetchedData = 'Fetch is fulfilled';

    const mockedConfig = jest.fn();

    const expectedAddCancelToken = expect.any(Function);

    beforeEach(() => {
        mockedUseComponents.mockReturnValue(mockedConfig);
        jest.clearAllMocks();
    });

    it('should return an object with data, isLoading, fetch, and axiosError properties', () => {
        const expectedResult = {
            data: null,
            isLoading: false,
            fetch: expect.any(Function),
            axiosError: null,
        };

        const {result} = renderHook(() => useFetch());

        expect(result.current).toEqual(expectedResult);
    });

    it('should handle errors correctly', async () => {
        const mockedAxiosError: AxiosError = {
            isAxiosError: true,
            message: 'Axios error',
            name: '',
            toJSON: () => ({}),
            config: {},
        };

        mockedFetchData.mockRejectedValue(mockedAxiosError);

        const {result} = renderHook(() => useFetch(mockedRawConfig));

        act(() => {
            result.current.fetch();
        });

        await waitFor(() => {
            const {data, axiosError} = result.current;

            expect(data).toBeNull();
            expect(axiosError.message).toBe(mockedAxiosError.message);
        });
    });

    it('should call fetchData with correct arguments', async () => {
        const {result} = renderHook(() => useFetch(mockedRawConfig));

        act(() => {
            result.current.fetch();
        });

        expect(mockedFetchData).toHaveBeenCalledWith(mockedNormalizedConfig, mockedConfig, expectedAddCancelToken);
    });

    it('should update config in state on raw config updated', async () => {
        const mockedNormalizeConfig = jest.spyOn(fetchHelpers, 'normalizeConfig');

        const mockedNewRawConfig: IFetchConfig = {
            url: '/items',
            method: 'get',
            params: {
                id: 1,
            },
        };

        const expectedNewNormalizedConfig = {
            id: null,
            url: '/items',
            method: 'get',
            params: {
                id: 1,
            },
            options: null,
            onFetch: null,
        };

        const {rerender} = renderHook(({rawConfig}) => useFetch(rawConfig), {
            initialProps: {
                rawConfig: mockedRawConfig,
            },
        });

        expect(mockedNormalizeConfig).toHaveBeenCalledWith(mockedRawConfig);
        expect(mockedFetchData).toHaveBeenCalledWith(mockedNormalizedConfig, mockedConfig, expectedAddCancelToken);

        rerender({rawConfig: mockedNewRawConfig});

        expect(mockedNormalizeConfig).toHaveBeenCalledWith(mockedNewRawConfig);
        expect(mockedFetchData).toHaveBeenCalledWith(expectedNewNormalizedConfig, mockedConfig, expectedAddCancelToken);
    });

    it('should return data when fetch is fulfilled', async () => {
        const expectedResolvedData = 'Fetch is fulfilled';
        const expectedLoadingStatus = false;

        mockedFetchData.mockResolvedValue(expectedResolvedData);

        const {result} = renderHook(() => useFetch(mockedRawConfig));

        await waitFor(() => {
            expect(mockedFetchData).toHaveBeenCalledTimes(1);
        });

        act(() => {
            result.current.fetch();
        });

        await waitFor(() => {
            const {data, isLoading} = result.current;

            expect(mockedFetchData).toHaveBeenCalledTimes(2);
            expect(data).toEqual(expectedResolvedData);
            expect(isLoading).toEqual(expectedLoadingStatus);
        });
    });

    it('should fetch data with new config', async () => {
        const expectedResolvedData = 'Fetch is fulfilled with new config';
        const expectedLoadingStatus = false;
        const newConfig = {
            url: '/post',
            method: 'get',
            params: {
                title: 'mock',
                name: 'john',
            },
        };
        const expectedNewNormalizedConfig = {
            id: null,
            url: '/post',
            method: 'get',
            params: {
                title: 'mock',
                name: 'john',
            },
            options: null,
            onFetch: null,
        };

        mockedFetchData.mockResolvedValue(expectedResolvedData);

        const {result} = renderHook(() => useFetch(mockedRawConfig));

        await waitFor(() => {
            expect(mockedFetchData).toHaveBeenCalledTimes(1);
            expect(mockedFetchData).toHaveBeenCalledWith(mockedNormalizedConfig, mockedConfig, expectedAddCancelToken);
        });

        act(() => {
            result.current.fetch(newConfig);
        });

        await waitFor(() => {
            const {data, isLoading} = result.current;

            expect(mockedFetchData).toHaveBeenCalledWith(expectedNewNormalizedConfig, mockedConfig, expectedAddCancelToken);
            expect(data).toBe(expectedResolvedData);
            expect(isLoading).toBe(expectedLoadingStatus);
        });
    });

    it('should fetch when data is falsy', async () => {
        const expectedLoadingStatus = false;

        mockedFetchData.mockResolvedValue(expectedFetchedData);

        const {result} = renderHook(() => useFetch(mockedRawConfig));

        await waitFor(() => {
            const {data, isLoading} = result.current;

            expect(data).toEqual(expectedFetchedData);
            expect(isLoading).toEqual(expectedLoadingStatus);
        });
    });

    it('should set preloaded data by config id', async () => {
        const mockedGetConfigId = jest.spyOn(fetchHelpers, 'getConfigId');

        process.env.IS_SSR = 'true';

        const preloadedDataId = 'preloaded-id';
        const ssrContextValue = {
            preloadedData: {
                [preloadedDataId]: 'preloaded data',
            },
        };

        const expectedPreloadedData = ssrContextValue.preloadedData[preloadedDataId];

        mockedUseSsr.mockReturnValueOnce(ssrContextValue);
        mockedGetConfigId.mockReturnValue(preloadedDataId);

        const {result} = renderHook(() => useFetch({...mockedRawConfig,
id: preloadedDataId,
url: null}));

        expect(result.current.data).toEqual(expectedPreloadedData);

        process.env.IS_SSR = undefined;
    });
});
