import '@testing-library/jest-dom';
import configureMockStore from 'redux-mock-store';
import {useSelector} from 'react-redux';
import * as connectedReactRouter from 'connected-react-router';
import {renderHook} from '../helpers';
import {useAddressBar} from '../../src/hooks';
import {defaultFromStringConverter, defaultToStringConverter, queryRestore, queryReplace} from '../../src/hooks/useAddressBar';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

const ITEM_STUB = null;
const WITH_HASH = true;
const WITHOUT_HASH = false;

describe('defaultFromStringConverter function', () => {
    it('should convert from string correctly', () => {
        const testCases = [
            {value: '123', type: 'number', expectedValue: 123},
            {value: 'true', type: 'boolean', expectedValue: true},
            {value: '1_2_3', type: 'number[]', expectedValue: [1, 2, 3]},
            {value: '1,2,3', type: 'number[]', expectedValue: [0]},
            {value: 'a_b_c', type: 'string[]', expectedValue: ['a', 'b', 'c']},
            {value: undefined, type: 'string', expectedValue: null},
            {value: 123, type: 'unknown', expectedValue: '123'},
            {value: '', type: 'unknown', expectedValue: null},
        ];

        testCases.forEach(({value, type, expectedValue}) => {
            const convertedValue = defaultFromStringConverter(value, type, ITEM_STUB);

            expect(convertedValue).toEqual(expectedValue);
        });
    });
});

describe('defaultToStringConverter', () => {
    it('should convert to string correctly', () => {
        const testCases = [
            {value: 'hello', type: 'string', expectedValue: 'hello'},
            {value: '', type: 'string', expectedValue: null},
            {value: null, type: 'string', expectedValue: null},
            {value: 42, type: 'number', expectedValue: '42'},
            {value: null, type: 'number', expectedValue: null},
            {value: true, type: 'boolean', expectedValue: '1'},
            {value: false, type: 'boolean', expectedValue: null},
            {value: ['one', 'two', 'three'], type: 'string[]', expectedValue: 'one_two_three'},
            {value: [], type: 'string[]', expectedValue: ''},
            {value: null, type: 'string[]', expectedValue: null},
        ];

        testCases.forEach(({value, type, expectedValue}) => {
            const convertedValue = defaultToStringConverter(value, type, ITEM_STUB);

            expect(convertedValue).toEqual(expectedValue);
        });
    });
});

describe('queryRestore', () => {
    const mockLocation = {
        search: '',
        hash: '',
    };

    const mockModel = {
        primaryKey: 'id',
        attributes: [
            'id',
            'name',
            {attribute: 'isActive', fromStringConverter: defaultFromStringConverter, jsType: 'boolean'},
        ],
    };

    it('should restore attributes from query parameters', () => {
        const expectedResult = {
            id: '1',
            name: 'John',
            isActive: true,
        };

        mockLocation.search = '?id=1&name=John&isActive=true';

        const result = queryRestore(mockModel, mockLocation, WITHOUT_HASH);

        expect(result).toEqual(expectedResult);
    });

    it('should restore attributes from hash parameters', () => {
        const expectedResult = {
            id: '2',
            name: 'Jane',
        };

        mockLocation.hash = '#id=2&name=Jane&isActive=false';

        const result = queryRestore(mockModel, mockLocation, WITH_HASH);

        expect(result).toEqual(expectedResult);
    });

    it('should can use custom converter for attributes', () => {
        const expectedResult = {
            isActive: true,
        };

        mockLocation.search = '?isActive=1';

        const customModel = {
            attributes: [{
                attribute: 'isActive',
                fromStringConverter: (value) => value === '1',
                jsType: 'boolean',
            }],
        };

        const result = queryRestore(customModel, mockLocation, WITHOUT_HASH);

        expect(result).toEqual(expectedResult);
    });
});

jest.mock('connected-react-router', () => ({
    __esModule: true,
    // @ts-ignore
    ...jest.requireActual('connected-react-router'),
}));

const replaceSpy = jest.spyOn(connectedReactRouter, 'replace');

describe('queryReplace', () => {
    const mockModel = {
        primaryKey: 'id',
        attributes: [
            'id',
            'name',
            {attribute: 'isActive', toStringConverter: defaultToStringConverter, jsType: 'boolean'},
        ],
    };

    const mockLocation = {
        pathname: '/example',
        search: '',
        hash: '',
    };

    const mockValues = {
        id: 123,
        name: 'John',
        isActive: true,
    };

    beforeEach(() => {
        mockLocation.search = '';
        mockLocation.hash = '';
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should replace query parameters with the given values', () => {
        const expectedQuery = '/example?id=123&isActive=1&name=John';

        queryReplace(mockModel, mockLocation, mockValues, WITHOUT_HASH);

        expect(replaceSpy).toHaveBeenCalledWith(expectedQuery);
    });

    it('should replace hash parameters with the given values', () => {
        const expectedQuery = '#id=123&isActive=1&name=John';
        const expectedResult = [];

        const result = queryReplace(mockModel, mockLocation, mockValues, WITH_HASH);

        expect(mockLocation.hash).toBe(expectedQuery);
        expect(result).toEqual(expectedResult);
    });

    it('should not replace parameters with the same values', () => {
        mockLocation.search = '?id=123&isActive=1&name=John';
        const expectedSearchValue = '?id=123&isActive=1&name=John';

        queryReplace(mockModel, mockLocation, mockValues, WITHOUT_HASH);

        expect(replaceSpy).not.toHaveBeenCalled();
        expect(mockLocation.search).toBe(expectedSearchValue);
    });

    it('should not include parameters with falsy values', () => {
        const defaultValues = {
            id: null,
            name: 'John',
            isActive: null,
        };

        const expectedQuery = '/example?name=John';

        queryReplace(mockModel, mockLocation, defaultValues, WITHOUT_HASH);

        expect(replaceSpy).toHaveBeenCalledWith(expectedQuery);
    });

    it('should can use custom converter for attributes', () => {
        const customModel = {
            attributes: [{
                attribute: 'isActive',
                toStringConverter: (value) => (value ? 'active' : 'inactive'),
                jsType: 'boolean',
            }],
        };
        const localValues = {isActive: true};
        const expectedQuery = '/example?isActive=active';

        queryReplace(customModel, mockLocation, localValues, WITHOUT_HASH);

        expect(replaceSpy).toHaveBeenCalledWith(expectedQuery);
    });
});

jest.mock('react-redux', () => ({
    __esModule: true,
    // @ts-ignore
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

const mockedUseSelector = (useSelector as jest.Mock);
const implementMockedUseSelectorWithStore = (store: any) => mockedUseSelector.mockImplementationOnce(callback => callback(store));

describe('useAddressBar Hook', () => {
    const dispatch = jest.fn();
    const observerMiddleware = () => (next) => (action) => {
        if (dispatch) {
            dispatch(action);
        }
        return next(action);
    };
    const mockStore = configureMockStore([observerMiddleware, prepareMiddleware]);

    const mockedRouterStateWithoutSearch = {
        router: {
            location: {
                pathname: '/documents',
                search: '',
                hash: '',
                key: 'key',
                query: {},
            },
        },
    };

    const mockedRouterStateWithSearch = {
        router: {
            location: {
                pathname: '/documents',
                search: '?page=1&pageSize=50',
                hash: '',
                key: 'key',
            },
        },
    };

    const configWithDisabledProp = {enable: false};
    const configWithEnabledProp = {enable: true};

    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    it('should set initial query to null if config is disabled', () => {
        const store = mockStore({
            ...mockedRouterStateWithoutSearch,
        });

        implementMockedUseSelectorWithStore(mockedRouterStateWithoutSearch);

        const {result} = renderHook(() => useAddressBar(configWithDisabledProp), {
            dispatch,
            store: {
                store,
            },
        });

        expect(result.current.initialQuery).toBeNull();
        expect(result.current.updateQuery).toBeInstanceOf(Function);
    });

    it('should not dispatch the replace query if this query already exist in location', () => {
        const store = mockStore({
            ...mockedRouterStateWithSearch,
        });

        implementMockedUseSelectorWithStore(mockedRouterStateWithSearch);

        const {result, rerender} = renderHook(() => useAddressBar(configWithEnabledProp), {
            dispatch,
            store: {
                store,
            },
        });

        result.current.updateQuery({
            layout: null,
            page: 1,
            pageSize: 50,
            sort: null,
        });

        const expectedNormalizedValues = {page: 1, pageSize: 50};

        expect(dispatch).toHaveBeenCalledWith([]);

        rerender();

        expect(result.current.initialQuery).toEqual(expectedNormalizedValues);
    });

    it('should dispatch the replace query if query is not equal to query from location', () => {
        const store = mockStore({
            ...mockedRouterStateWithSearch,
        });

        implementMockedUseSelectorWithStore(mockedRouterStateWithSearch);

        const expectedAction = {
            type: '@@router/CALL_HISTORY_METHOD',
            payload: {method: 'replace', args: ['/documents?page=2&pageSize=50']},
        };

        const {result, rerender} = renderHook(() => useAddressBar(configWithEnabledProp), {
            dispatch,
            store: {
                store,
            },
        });

        result.current.updateQuery({
            layout: null,
            page: 2,
            pageSize: 50,
            sort: null,
        });

        const expectedNormalizedValues = {page: 2, pageSize: 50};

        expect(dispatch).toHaveBeenCalledWith(expectedAction);

        rerender();

        expect(result.current.initialQuery).toEqual(expectedNormalizedValues);
    });

    it('should restore query using model attributes', () => {
        const store = mockStore({
            ...mockedRouterStateWithSearch,
        });

        implementMockedUseSelectorWithStore(mockedRouterStateWithSearch);

        const mockedProps = {
            enable: true,
            model: {
                primaryKey: 'page',
                attributes: [
                    'page',
                    'pageSize',
                ],
            },
        };

        const expectedRestoredQuery = {
            page: '1',
            pageSize: '50',
        };

        const {result} = renderHook(() => useAddressBar(mockedProps), {
            dispatch,
            store: {
                store,
            },
        });

        expect(result.current.initialQuery).toEqual(expectedRestoredQuery);
    });
});
