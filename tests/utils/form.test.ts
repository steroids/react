import {cleanEmptyObject} from '../../src/utils/form';

describe('form utils', () => {
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
