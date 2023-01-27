import fields, {
    isMetaFetched,
    IFieldsState,
    normalizeName,
} from '../../../src/reducers/fields';
import {
    FIELDS_DATA_PROVIDER_SET_ITEMS,
    FIELDS_SET_META,
} from '../../../src/actions/fields';

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
                meta1: {},
            },
        };

        initialState = {
            ...defaultInitialState,
            meta: {
                meta2: {
                    someMeta: 'someMeta',
                },
            },
        };

        const expectedState = {
            ...initialState,
            meta: {
                ...initialState.meta,
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
});
