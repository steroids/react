import '@testing-library/jest-dom';
import {useSelector} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import useList, * as listHelpers from '../../src/hooks/useList';
import * as normalizeEmpty from '../../src/ui/list/Empty/Empty';
import * as paginationSize from '../../src/ui/list/PaginationSize/PaginationSize';
import * as pagination from '../../src/ui/list/Pagination/Pagination';
import * as layoutNames from '../../src/ui/list/LayoutNames/LayoutNames';
import {renderHook} from '../helpers';
import {listInit, listSetItems} from '../../src/actions/list';
import {defaultConfig} from '../../src/hooks/useList';
import prepareMiddleware from '../mocks/storeMiddlewareMock';

const {normalizeSortProps, getDefaultSearchModel} = listHelpers;

describe('normalizeSortProps function', () => {
    it('should return a normalized sort object', () => {
        const sortProps = {
            enable: true,
            attribute: 'sort',
            defaultValue: 'asc',
        };

        const normalizedSortProps = normalizeSortProps(sortProps);

        expect(normalizedSortProps).toEqual(sortProps);
    });

    it('should return a default normalized sort object if sort props is false', () => {
        const sortProps = false;
        const expectedNormalizedSortProps = {
            ...defaultConfig.sort,
        };

        const normalizedSortProps = normalizeSortProps(sortProps);

        expect(normalizedSortProps).toEqual(expectedNormalizedSortProps);
    });
});

describe('getDefaultSearchModel function', () => {
    it('should return a default search model object', () => {
        const parameters = {
            paginationProps: {
                enable: true,
                attribute: 'page',
                defaultValue: 1,
            },
            paginationSizeProps: {
                enable: true,
                attribute: 'pageSize',
                defaultValue: 10,
            },
            sort: {
                enable: true,
                attribute: 'sort',
                defaultValue: 'asc',
            },
            layoutNamesProps: {
                enable: true,
                attribute: 'layout',
                defaultValue: 'list',
            },
        };

        const expectedAttributes = [
            {
                type: 'number',
                attribute: 'page',
                defaultValue: 1,
            },
            {
                type: 'number',
                attribute: 'pageSize',
                defaultValue: 10,
            },
            {
                type: 'string',
                jsType: 'string[]',
                attribute: 'sort',
                defaultValue: 'asc',
            },
            {
                type: 'string',
                attribute: 'layout',
                defaultValue: 'list',
            },
        ];

        const searchModel = getDefaultSearchModel(parameters);

        expect(searchModel).toBeDefined();
        expect(searchModel.attributes).toEqual(expectedAttributes);
    });

    it('should return a default search model object without disabled attributes', () => {
        const parameters = {
            paginationProps: {enable: false},
            paginationSizeProps: {
                enable: true,
                attribute: 'pageSize',
                defaultValue: 10,
            },
            sort: {enable: false},
            layoutNamesProps: {
                enable: true,
                attribute: 'layout',
                defaultValue: 'list',
            },
        };

        const expectedEnabledAttributes = [
            {
                type: 'number',
                attribute: 'pageSize',
                defaultValue: 10,
            },
            {
                type: 'string',
                attribute: 'layout',
                defaultValue: 'list',
            },
        ];

        const searchModel = getDefaultSearchModel(parameters);

        expect(searchModel).toBeDefined();
        expect(searchModel.attributes).toEqual(expectedEnabledAttributes);
    });

    it('should return an empty array if all parameters are disabled', () => {
        const parameters = {
            paginationProps: {enable: false},
            paginationSizeProps: {enable: false},
            sort: {enable: false},
            layoutNamesProps: {enable: false},
        };
        const expectedEmptyAttributes = [];

        const searchModel = getDefaultSearchModel(parameters);

        expect(searchModel).toBeDefined();
        expect(searchModel.attributes).toEqual(expectedEmptyAttributes);
    });
});

const normalizeSortPropsSpy = jest.spyOn(listHelpers, 'normalizeSortProps');
const getDefaultSearchModelSpy = jest.spyOn(listHelpers, 'getDefaultSearchModel');
const createInitialValuesSpy = jest.spyOn(listHelpers, 'createInitialValues');
const normalizeEmptyPropsSpy = jest.spyOn(normalizeEmpty, 'normalizeEmptyProps');
const normalizePaginationSizePropsSpy = jest.spyOn(paginationSize, 'normalizePaginationSizeProps');
const normalizePaginationPropsSpy = jest.spyOn(pagination, 'normalizePaginationProps');
const normalizeLayoutNamesPropsSpy = jest.spyOn(layoutNames, 'normalizeLayoutNamesProps');

jest.mock('react-redux', () => ({
    __esModule: true,
    // @ts-ignore
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

const dispatch = jest.fn();
const observerMiddleware = () => (next) => (action) => {
    if (dispatch) {
        dispatch(action);
    }
    return next(action);
};
const mockStore = configureMockStore([observerMiddleware, prepareMiddleware]);

const mockedUseSelector = (useSelector as jest.Mock);
const implementMockedUseSelectorWithStore = (store: any) => mockedUseSelector.mockImplementationOnce(callback => callback(store));

describe('useList hook', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    const expectedInstanceOfObject = Object;

    const listId = 'list-id';
    const mockedListData = 'list from store';
    const mockedListStore = {
        list: {
            lists: {
                [listId]: mockedListData,
            },
        },
    };

    const mockedFetchedListStore = {
        list: {
            lists: {
                [listId]: {
                    isFetched: true,
                },
            },
        },
    };

    const renderUseListWithFetchedList = (props) => {
        const store = mockStore({
            ...mockedFetchedListStore,
        });
        implementMockedUseSelectorWithStore(mockedFetchedListStore);

        const {result} = renderHook(() => useList({
            listId,
            ...props,
        }), {
            store: {
                store,
            },
        });

        return result;
    };

    const enabledProp = {
        enable: true,
    };

    const disabledProp = {
        enable: false,
    };

    it('should return an object with properties', () => {
        const store = mockStore({
            ...mockedListStore,
        });
        implementMockedUseSelectorWithStore(mockedListStore);

        const expectedPaginationPosition = 'bottom';
        const expectedPaginationSizePosition = 'top';
        const expectedLayoutNamesPosition = 'top';

        const {result, rerender} = renderHook(() => useList({listId}), {
            store: {
                store,
            },
        });

        const {
            list,
            model,
            searchModel,
            paginationPosition,
            paginationSizePosition,
            layoutNamesPosition,
            renderList,
            renderEmpty,
            renderPagination,
            renderPaginationSize,
            renderLayoutNames,
            renderSearchForm,
            onFetch,
            onSort,
        } = result.current;

        expect(list).toBeDefined();
        expect(model).toBeNull();
        expect(searchModel).toBeInstanceOf(expectedInstanceOfObject);
        expect(paginationPosition).toBe(expectedPaginationPosition);
        expect(paginationSizePosition).toBe(expectedPaginationSizePosition);
        expect(layoutNamesPosition).toBe(expectedLayoutNamesPosition);
        expect(renderList).toBeInstanceOf(Function);
        expect(renderEmpty).toBeInstanceOf(Function);
        expect(renderPagination).toBeInstanceOf(Function);
        expect(renderPaginationSize).toBeInstanceOf(Function);
        expect(renderLayoutNames).toBeInstanceOf(Function);
        expect(renderSearchForm).toBeInstanceOf(Function);
        expect(onFetch).toBeInstanceOf(Function);
        expect(onSort).toBeInstanceOf(Function);
    });

    it('should get list from store', () => {
        const store = mockStore({
            ...mockedListStore,
        });
        implementMockedUseSelectorWithStore(mockedListStore);

        const {result} = renderHook(() => useList({listId}), {
            store: {
                store,
            },
        });

        expect(result.current.list).toEqual(mockedListData);
    });

    it('should dispatch list init', () => {
        const expectedPayload = {
            listId,
            action: null,
            actionMethod: 'get',
            onFetch: undefined,
            onError: undefined,
            condition: undefined,
            scope: undefined,
            items: null,
            sourceItems: null,
            total: undefined,
            isRemote: true,
            primaryKey: 'id',
            formId: listId,
            loadMore: false,
            pageAttribute: 'page',
            pageSizeAttribute: 'pageSize',
            sortAttribute: 'sort',
            layoutAttribute: 'layout',
            hasInfiniteScroll: null,
            defaultPageValue: 1,
        };
        const expectedActions = [
            listInit(listId, expectedPayload),
            expect.any(Function),
        ];

        const store = mockStore({});

        renderHook(() => useList({listId}), {
            store: {
                store,
            },
        });

        expect(dispatch).toHaveBeenCalledWith(expectedActions);
    });

    it('should dispatch list set items with initial items', () => {
        const initialItems = [
            {
                id: 1,
                name: 'html',
            },
        ];
        const expectedActions = [
            expect.any(Object),
            listSetItems(listId, initialItems),
        ];

        renderHook(() => useList({
            listId,
            initialItems,
        }));

        expect(dispatch).toHaveBeenCalledWith(expectedActions);
    });

    it('should call normalizeSortProps with parameters', () => {
        renderHook(() => useList({sort: enabledProp}));

        expect(normalizeSortPropsSpy).toHaveBeenCalledWith(enabledProp);
    });

    it('should call normalizeEmptyProps with parameters', () => {
        renderHook(() => useList({empty: enabledProp}));

        expect(normalizeEmptyPropsSpy).toHaveBeenCalledWith(enabledProp);
    });

    it('should return "Empty" component if empty is enabled', () => {
        const result = renderUseListWithFetchedList({empty: enabledProp});

        const renderedEmpty = result.current.renderEmpty();

        expect(renderedEmpty).toBeInstanceOf(expectedInstanceOfObject);
    });

    it('should return null component if empty is disabled', () => {
        const {result} = renderHook(() => useList({empty: disabledProp}));

        const renderedEmpty = result.current.renderEmpty();

        expect(renderedEmpty).toBeNull();
    });

    it('should call normalizePaginationSizeProps with parameters', () => {
        renderHook(() => useList({paginationSize: enabledProp}));

        expect(normalizePaginationSizePropsSpy).toHaveBeenCalledWith(enabledProp);
    });

    it('should return "PaginationSize" component if pagination size is enabled', () => {
        const result = renderUseListWithFetchedList({paginationSize: enabledProp});

        const renderedPaginationSize = result.current.renderPaginationSize();

        expect(renderedPaginationSize).toBeInstanceOf(expectedInstanceOfObject);
    });

    it('should return null if pagination size is disabled', () => {
        const {result} = renderHook(() => useList({paginationSize: disabledProp}));

        const renderedPaginationSize = result.current.renderPaginationSize();

        expect(renderedPaginationSize).toBeNull();
    });

    it('should call normalizePaginationProps with parameters', () => {
        renderHook(() => useList({pagination: enabledProp}));

        expect(normalizePaginationPropsSpy).toHaveBeenCalledWith(enabledProp);
    });

    it('should return "Pagination" component if pagination is enabled', () => {
        const result = renderUseListWithFetchedList({pagination: enabledProp});

        const renderedPagination = result.current.renderPagination();

        expect(renderedPagination).toBeInstanceOf(expectedInstanceOfObject);
    });

    it('should return null if pagination is disabled', () => {
        const {result} = renderHook(() => useList({pagination: disabledProp}));

        const renderedPagination = result.current.renderPagination();

        expect(renderedPagination).toBeNull();
    });

    it('should call normalizeLayoutNamesProps with parameters', () => {
        renderHook(() => useList({layout: enabledProp}));

        expect(normalizeLayoutNamesPropsSpy).toHaveBeenCalledWith(enabledProp);
    });

    it('should render "LayoutNames"', () => {
        const {result} = renderHook(() => useList({layout: enabledProp}));

        const renderedLayoutNames = result.current.renderLayoutNames();

        expect(renderedLayoutNames).toBeInstanceOf(expectedInstanceOfObject);
    });

    it('should render a search form', () => {
        const {result} = renderHook(() => useList({listId}));

        const renderedSearchForm = result.current.renderSearchForm();

        expect(renderedSearchForm).toBeInstanceOf(expectedInstanceOfObject);
    });

    it('should call createInitialValues', () => {
        renderHook(() => useList({listId}));

        expect(createInitialValuesSpy).toHaveBeenCalled();
    });

    it('should return "renderList" handler to render "Form" component', () => {
        const mockedChildNode = <div />;

        const {result} = renderHook(() => useList({listId}));

        const {renderList} = result.current;
        const renderedList = renderList(mockedChildNode);

        expect(renderedList).toBeInstanceOf(expectedInstanceOfObject);
    });

    it('should return a null if model is not exist', () => {
        const {result} = renderHook(() => useList({
            listId,
            model: 'model',
        }));

        expect(result.current.model).toBeDefined();
        expect(result.current.model).toBeNull();
    });

    it('should call "getDefaultSearchModel"', () => {
        renderHook(() => useList({listId}));

        expect(getDefaultSearchModelSpy).toHaveBeenCalled();
    });
});
