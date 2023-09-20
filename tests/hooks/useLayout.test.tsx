import React from 'react';
import configureMockStore from 'redux-mock-store';
import * as authActions from '../../src/actions/auth';
import * as routerActions from '../../src/actions/router';
import * as fieldsActions from '../../src/actions/fields';
import componentsMock from '../mocks/componentsMock';
import prepareMiddleware from '../mocks/storeMiddlewareMock';
import useLayout, {
    STATUS_OK,
    STATUS_LOADING,
    STATUS_NOT_FOUND,
    STATUS_ACCESS_DENIED,
    STATUS_HTTP_ERROR,
    HTTP_STATUS_CODES,
    runInitAction,
    ILayout,
} from '../../src/hooks/useLayout';
import useSelector from '../../src/hooks/useSelector';
import useDispatch from '../../src/hooks/useDispatch';
import useComponents from '../../src/hooks/useComponents';
import useSsr from '../../src/hooks/useSsr';
import renderHookWithStore from '../renderHookWithStore';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

jest.mock('../../src/hooks/useSelector');
jest.mock('../../src/hooks/useDispatch');
jest.mock('../../src/hooks/useComponents');
jest.mock('../../src/hooks/useSsr');

const mockedUseDispatch = (useDispatch as jest.Mock);
const mockedUseSelector = (useSelector as jest.Mock);
const mockedUseComponents = (useComponents as jest.Mock);
const mockedUseSsr = (useSsr as jest.Mock);
const mockedGoToRoute = jest.spyOn(routerActions, 'goToRoute');

describe('useLayout Hook', () => {
    const MOCKED_ROUTE = {
        roles: ['admin'],
        id: 'admin-route-id',
    };

    const MOCKED_USER = {
        role: 'user',
    };

    const MOCKED_ADMIN = {
        role: 'admin',
    };

    const mockedDispatch = jest.fn();

    beforeEach(() => {
        mockedUseDispatch.mockReturnValue(mockedDispatch);
        mockedUseComponents.mockReturnValue(jest.fn());
        jest.clearAllMocks();
    });

    it('should return status "loading" when initializing', () => {
        mockedUseSelector.mockReturnValueOnce({
            route: null,
            user: null,
            data: null,
            isInitialized: false,
            initializeCounter: 0,
            redirectPageId: null,
            loginRouteId: null,
        });

        const {result} = renderHookWithStore(useLayout, store);

        expect(result.current.status).toBe(STATUS_LOADING);
        expect(result.current.error).toBeNull();
        expect(result.current.data).toBeNull();
    });

    it('should return status "ok" when initialized', async () => {
        mockedUseSelector.mockReturnValue({
            route: MOCKED_ROUTE,
            user: MOCKED_ADMIN,
            data: null,
            isInitialized: true,
            initializeCounter: 1,
            redirectPageId: null,
            loginRouteId: null,
        });

        const {result} = renderHookWithStore(useLayout, store);

        expect(result.current.status).toBe(STATUS_OK);
        expect(result.current.error).toBeNull();
        expect(result.current.data).toBeNull();
    });

    it('should return data', async () => {
        const mockedData = 'mocked data';

        mockedUseSelector.mockReturnValue({
            route: MOCKED_ROUTE,
            user: MOCKED_ADMIN,
            data: mockedData,
            isInitialized: true,
            initializeCounter: 1,
            redirectPageId: null,
            loginRouteId: null,
        });

        const {result} = renderHookWithStore(useLayout, store);

        expect(result.current.data).toBe(mockedData);
    });

    it('should handle HTTP error correctly', async () => {
        const useStateSpy = jest.spyOn(React, 'useState');

        const mockedError = new Error('Test HTTP error');
        const setStateMock = jest.fn();
        const useSateMock: any = (useState: any) => [mockedError, setStateMock];
        useStateSpy.mockImplementationOnce(useSateMock);

        mockedUseSelector.mockReturnValue({
            route: MOCKED_ROUTE,
            user: MOCKED_ADMIN,
            data: null,
            isInitialized: true,
            initializeCounter: 1,
            redirectPageId: null,
            loginRouteId: null,
        });

        const {result} = renderHookWithStore(useLayout, store);

        expect(result.current.status).toBe(STATUS_HTTP_ERROR);
        expect(result.current.error).toBe(mockedError);

        useStateSpy.mockClear();
    });

    it('should handle not found route correctly', () => {
        mockedUseSelector.mockReturnValueOnce({
            route: null,
            user: null,
            data: null,
            isInitialized: true,
            initializeCounter: 0,
            redirectPageId: null,
            loginRouteId: null,
        });

        const {result} = renderHookWithStore(useLayout, store);

        expect(result.current.status).toBe(STATUS_NOT_FOUND);
    });

    it('should handle access denied route correctly', () => {
        mockedUseSelector.mockReturnValueOnce({
            route: MOCKED_ROUTE,
            user: null,
            data: null,
            isInitialized: true,
            initializeCounter: 1,
            redirectPageId: null,
            loginRouteId: null,
        });

        const {result} = renderHookWithStore(useLayout, store);

        expect(result.current.status).toBe(STATUS_ACCESS_DENIED);
    });

    it('should dispatch goToRoute if user does not have access for this page', () => {
        const loginRouteId = 'login-route-id';

        mockedUseSelector.mockReturnValueOnce({
            route: MOCKED_ROUTE,
            user: null,
            data: null,
            isInitialized: true,
            initializeCounter: 0,
            redirectPageId: null,
            loginRouteId,
        });

        renderHookWithStore(useLayout, store);

        expect(mockedGoToRoute).toHaveBeenCalledWith(loginRouteId);
    });

    it('should dispatch setUser(null) when call without initAction', () => {
        mockedUseSelector.mockReturnValueOnce({
            route: MOCKED_ROUTE,
            user: MOCKED_USER,
            data: null,
            isInitialized: true,
            initializeCounter: 0,
            redirectPageId: null,
            loginRouteId: null,
        });
        const mockedSetUser = jest.spyOn(authActions, 'setUser');

        renderHookWithStore(useLayout, store);

        expect(mockedSetUser).toHaveBeenCalledWith(null);
    });

    it('should dispatch init(true) when call with initAction', () => {
        mockedUseSelector.mockReturnValueOnce({
            route: MOCKED_ROUTE,
            user: MOCKED_USER,
            data: null,
            isInitialized: true,
            initializeCounter: 0,
            redirectPageId: null,
            loginRouteId: null,
        });
        const mockRunInitAction = jest.fn();
        const mockedInitAction = jest.spyOn(authActions, 'init');

        renderHookWithStore<ILayout>(() => useLayout(mockRunInitAction), store);

        expect(mockedInitAction).toHaveBeenCalledWith(true);
    });

    it('should call initAction', async () => {
        mockedUseSelector.mockReturnValueOnce({
            route: MOCKED_ROUTE,
            user: MOCKED_ADMIN,
            data: null,
            isInitialized: true,
            initializeCounter: 0,
            redirectPageId: 'route1',
            loginRouteId: null,
        });
        const mockRunInitAction = jest.fn().mockResolvedValue(1);

        const {rerender} = renderHookWithStore<ILayout>(() => useLayout(mockRunInitAction), store);

        mockedUseSelector.mockReturnValueOnce({
            route: MOCKED_ROUTE,
            user: MOCKED_ADMIN,
            data: null,
            isInitialized: true,
            initializeCounter: 1,
            redirectPageId: 'route1',
            loginRouteId: null,
        });

        rerender();

        expect(mockRunInitAction).toHaveBeenCalledTimes(1);
    });

    it('should handle ssr', async () => {
        mockedUseSelector.mockReturnValue({
            route: MOCKED_ROUTE,
            user: MOCKED_ADMIN,
            data: null,
            isInitialized: true,
            initializeCounter: 1,
            redirectPageId: null,
            loginRouteId: null,
        });

        process.env.IS_SSR = 'true';

        const ssrContextValue = {
            staticContext: {
                statusCode: '',
            },
        };

        mockedUseSsr.mockReturnValue(ssrContextValue);

        const {result} = renderHookWithStore<ILayout>(useLayout, store);

        expect(mockedUseSsr).toHaveBeenCalledTimes(1);
        expect(result.current.status).toBe(STATUS_OK);
        expect(ssrContextValue.staticContext.statusCode).toBe(HTTP_STATUS_CODES[result.current.status]);

        process.env.IS_SSR = undefined;
    });
});

describe('runInitAction', () => {
    const MOCKED_CONFIG = {
        http: {
            accessToken: 'token',
        },
        meta: {
            defaultTypes: {
                type: 'test-type-id',
            },
            defaultKey: 'default-key',
        },
    };

    const MOCKED_META = {
        LanguageEnum: {
            attributes: [
                {
                    id: 'ru',
                    label: 'Russian',
                },
            ],
        },
    };

    const MOCKED_USER = {
        name: 'John',
    };

    const MOCKED_RESULT = {
        config: MOCKED_CONFIG,
        meta: MOCKED_META,
        user: MOCKED_USER,
    };

    const mockedRunInitAction = jest.fn().mockResolvedValue(MOCKED_RESULT);
    const mockedDispatch = jest.fn();

    const mockedSetMeta = jest.spyOn(fieldsActions, 'setMeta');
    const mockedSetUser = jest.spyOn(authActions, 'setUser');
    const mockedSetData = jest.spyOn(authActions, 'setData');

    beforeEach(async () => {
        await runInitAction(mockedRunInitAction, componentsMock, mockedDispatch);
    });

    it('should call the initAction function with the correct arguments', async () => {
        expect(mockedRunInitAction).toHaveBeenCalledWith(null, mockedDispatch, componentsMock);
    });

    it('should call setAccessToken with result value', async () => {
        expect(componentsMock.http.setAccessToken).toHaveBeenCalledWith(MOCKED_CONFIG.http.accessToken);
    });

    it('should add fields to component object', async () => {
        expect(componentsMock.meta.defaultTypes).toEqual(MOCKED_CONFIG.meta.defaultTypes);
    });

    it('should replace component object by result object', async () => {
        expect(componentsMock.meta.defaultKey).toEqual(MOCKED_CONFIG.meta.defaultKey);
    });

    it('should call meta.setModel', async () => {
        expect(componentsMock.meta.setModel).toHaveBeenCalledWith('LanguageEnum', MOCKED_META.LanguageEnum);
    });

    it('should dispatch setMeta', async () => {
        expect(mockedSetMeta).toHaveBeenCalledWith(MOCKED_META);
    });

    it('should dispatch setData with fulfilled result', async () => {
        expect(mockedSetData).toHaveBeenCalledWith(MOCKED_RESULT);
    });

    it('should dispatch setUser', async () => {
        expect(mockedSetUser).toHaveBeenCalledWith(MOCKED_USER);
    });
});
