import {cleanEmptyObject, mergeLayoutProp, normalizeLayout} from '../../src/utils/form';

describe('form utils', () => {
    describe('normalizeLayout', () => {
        it('layout as object', () => {
            const layout = {
                hasBlackBars: true,
                width: 1024,
                height: 768,
            };

            expect(normalizeLayout(layout)).toEqual(layout);
        });

        it('layout as not object', () => {
            const layout = 'layout';

            const expectedNormalizedLayout = {
                [layout]: 'layout',
            };

            expect(normalizeLayout(layout)).toEqual(expectedNormalizedLayout);
        });
    });

    describe('mergeLayoutProp', () => {
        const firstLayout = {
            hasBlackBars: true,
            width: 1024,
        };

        const secondLayout = {
            hasRedElements: true,
            height: 768,
        };

        it('default behavior', () => {
            const expectedLayout = {
                ...firstLayout,
                ...secondLayout,
            };

            expect(mergeLayoutProp(firstLayout, secondLayout)).toEqual(expectedLayout);
        });

        it('secondLayout is false state', () => {
            const expectedEmptyLayout = null;
            const falsyLayout = false;
            expect(mergeLayoutProp(firstLayout, falsyLayout)).toEqual(expectedEmptyLayout);
        });
    });

    describe('cleanEmptyObject', () => {
        const plainObject = {
            value: null,
            configurable: true,
            enumerable: true,
            writable: true,
        };

        it('with object not empty', () => {
            const objectWithoutEmptyValues = {
                color: '#000',
                hasVoice: true,
                hasTail: true,
                hasSword: true,
            };

            expect(cleanEmptyObject(objectWithoutEmptyValues)).toEqual(objectWithoutEmptyValues);
        });

        it('with all object properties null', () => {
            const objectWithEmptyValues = {
                form: null,
                shape: null,
            };

            const emptyObject = null;
            expect(cleanEmptyObject(objectWithEmptyValues)).toBe(emptyObject);
        });

        it('with plain object', () => {
            expect(cleanEmptyObject({plainObject})).toEqual({plainObject});
        });

        it('with array', () => {
            const objectWithArrayValue = {
                array: [plainObject],
            };

            expect(cleanEmptyObject(objectWithArrayValue)).toEqual(objectWithArrayValue);
        });
    });
});

//TODO Providers
