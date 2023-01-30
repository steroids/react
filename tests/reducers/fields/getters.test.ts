import {
    getDataProviderItems,
    getEnumLabels,
    getModel,
} from '../../../src/reducers/fields';

const mockWarn = jest.spyOn(console, 'warn');

describe('fields reducers', () => {
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
            const name = null;

            expect(getModel(state, name)).toBe(expectedResult);
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
