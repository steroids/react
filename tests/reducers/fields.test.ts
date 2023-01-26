import fields, {
    getDataProviderItems,
    getEnumLabels,
    getModel,
    isMetaFetched,
    IFieldsState,
    normalizeName,
} from '../../src/reducers/fields';
import {
    FIELDS_DATA_PROVIDER_SET_ITEMS,
    FIELDS_SET_META,
} from '../../src/actions/fields';

const mockWarn = jest.spyOn(console, 'warn');

describe('fields reducers', () => {
    const defaultInitialState: IFieldsState = {
        props: {},
        dataProvider: {},
        meta: null,
    };

    let initialState = {...defaultInitialState};

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    it('normalizeName', () => {
        const name = '\\1\\2\\3';

        const expectedResult = '1.2.3';

        expect(normalizeName(name)).toBe(expectedResult);
    });

    it('FIELDS_SET_META', () => {
        const action = {
            type: FIELDS_SET_META,
            meta: {
                meta1: {
                    className: 'orange',
                },
            },
        };

        initialState = {
            dataProvider: {},
            props: {},
            meta: {
                meta2: {
                    className: 'black',
                },
            },
        };

        const expectedState = {
            ...initialState,
            meta: {
                ...initialState.meta,
                ...action.meta,
                meta1: {
                    className: 'meta1',
                },
            },
        };

        expect(fields(initialState, action)).toEqual(expectedState);
    });

    it('FIELDS_DATA_PROVIDER_SET_ITEMS', () => {
        const dataProvider = {
            unknownApi: 'api',
        };

        const action = {
            type: FIELDS_DATA_PROVIDER_SET_ITEMS,
            dataProviderId: 'dataProviderId',
            items: {
                item1: 'item1',
                item2: 'item2',
                item3: 'item3',
            },
        };

        initialState = {
            ...initialState,
            dataProvider,
        };

        const expectedState = {
            ...initialState,
            dataProvider: {
                ...dataProvider,
                [action.dataProviderId]: action.items,
            },
        };

        expect(fields(initialState, action)).toEqual(expectedState);
    });

    describe('isMetaFetched', () => {
        it('with empty meta', () => {
            const state = {
                fields: {
                    meta: null,
                },
            };

            const expectedResult = false;

            expect(isMetaFetched(state)).toBe(expectedResult);
        });

        it('with fulfilled meta', () => {
            const state = {
                fields: {
                    meta: {
                        description: 'This page is designed for dinosaurs',
                    },
                },
            };

            const expectedResult = true;

            expect(isMetaFetched(state)).toBe(expectedResult);
        });
    });
    describe('getEnumLabels', () => {
        it('with fulfilled labels', () => {
            const name = 'megaLabels';
            const labels = {
                label1: 'label1',
                label2: 'label2',
            };

            const state = {
                fields: {
                    meta: {
                        [name]: {
                            labels,
                        },
                    },
                },
            };

            const expectedResult = labels;

            expect(getEnumLabels(state, name)).toEqual(expectedResult);
        });
        it('without labels', () => {
            const name = 'megaLabels';
            const state = {
                fields: {
                    meta: {},
                },
            };

            const expectedResult = null;

            expect(getEnumLabels(state, name)).toEqual(expectedResult);
        });
    });
    describe('getModel', () => {
        it('with name not string', () => {
            const state = {};
            const name = 10;

            const expectedResult = name;

            expect(getModel(state, name)).toBe(expectedResult);
        });
        it('without name argument', () => {
            const state = {};

            const expectedResult = null;

            expect(getModel(state, undefined)).toBe(expectedResult);
        });
        it('with meta', () => {
            const name = 'description';
            const description = 'This page about apples';

            const state = {
                fields: {
                    meta: {
                        [name]: description,
                    },
                },
            };

            const expectedResult = description;

            expect(getModel(state, name)).toEqual(expectedResult);
        });
        it('without meta', () => {
            const name = 'description';
            const consoleWarnFirstArgument = 'Steroids: Not found model meta:';
            const consoleWarnSecondArgument = name;
            const consoleWarnCallCount = 1;

            const state = {
                fields: {
                    meta: {},
                },
            };

            const expectedResult = null;

            expect(getModel(state, name)).toEqual(expectedResult);
            expect(mockWarn).toHaveBeenCalledTimes(consoleWarnCallCount);
            expect(mockWarn).toHaveBeenCalledWith(
                consoleWarnFirstArgument,
                consoleWarnSecondArgument,
            );
        });
    });

    describe('getDataProviderItems', () => {
        it('with correct dataProviderId', () => {
            const dataProviderId = 'helperApi';
            const dataProviderValue = 'status';

            const state = {
                fields: {
                    dataProvider: {
                        [dataProviderId]: dataProviderValue,
                    },
                },
            };

            const expectedResult = dataProviderValue;

            expect(getDataProviderItems(state, dataProviderId)).toEqual(
                expectedResult,
            );
        });
        it('with incorrect dataProviderId', () => {
            const dataProviderId = 'helperApi';

            const state = {
                fields: {
                    dataProvider: {
                        unknownApi: 'info',
                    },
                },
            };

            const expectedResult = null;

            expect(getDataProviderItems(state, dataProviderId)).toBe(
                expectedResult,
            );
        });
    });
});
