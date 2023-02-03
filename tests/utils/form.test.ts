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

        it('lay as not object', () => {
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

        let secondLayout: any = {
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
            secondLayout = false;
            expect(mergeLayoutProp(firstLayout, secondLayout)).toEqual(expectedEmptyLayout);
        });
    });

    describe('cleanEmptyObject', () => {
        const getPlaintObject = () => (Object.create(null, {
            isPlain: {
                value: null,
                configurable: true,
                enumerable: true,
                writable: true,
            },
        }));

        it('with object not empty', () => {
            const entity = {
                color: '#000',
                hasVoice: true,
                hasTail: true,
                hasSword: true,
            };

            expect(cleanEmptyObject(entity)).toBe(entity);
        });

        it('with all object properties null', () => {
            const entity = {
                form: null,
                shape: null,
            };

            const expectedEmptyCleanObject = null;
            expect(cleanEmptyObject(entity)).toEqual(expectedEmptyCleanObject);
        });

        it('with plain Object', () => {
            const plainObject = getPlaintObject();

            const entity = {
                plainObject,
            };

            expect(cleanEmptyObject(entity)).toEqual(entity);
        });

        it('with array', () => {
            const plainObject = getPlaintObject();
            const array = [plainObject];

            const entity = {
                array,
            };

            expect(cleanEmptyObject(entity)).toEqual(entity);
        });
    });
});

//TODO Providers
