import _omit from 'lodash/omit';
import {cleanEmptyObject, clearErrors} from '../../src/utils/form';

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

    describe('clearErrors', () => {
        let values;
        let prevValues;
        let errors;
        let setErrors;

        beforeEach(() => {
            values = {};
            prevValues = {};
            errors = {
                firstName: 'Error 1',
                secondName: 'Error 2',
                favourites: 'Error 3',
            };
            setErrors = jest.fn();
        });

        afterAll(() => jest.restoreAllMocks());

        it('should not clear errors if no fields have changed', () => {
            values = {firstName: 'John', secondName: 'Doe'};
            prevValues = {firstName: 'John', secondName: 'Doe'};

            clearErrors(values, prevValues, errors, setErrors);

            expect(setErrors).not.toHaveBeenCalled();
        });

        it('should clear errors for changed fields', () => {
            const expectedErrors = _omit(errors, 'firstName');
            values = {firstName: 'Jane', secondName: 'Doe'};
            prevValues = {firstName: 'John', secondName: 'Doe'};

            clearErrors(values, prevValues, errors, setErrors);

            expect(setErrors).toHaveBeenCalledWith(expectedErrors);
        });

        it('should clear errors for changed array field', () => {
            const expectedErrors = _omit(errors, 'favourites');
            values = {favourites: [1, 2]};
            prevValues = {favourites: [1, 2, 3]};

            clearErrors(values, prevValues, errors, setErrors);

            expect(setErrors).toHaveBeenCalledWith(expectedErrors);
        });

        it('should handle empty errors object', () => {
            errors = {};

            clearErrors(values, prevValues, errors, setErrors);

            expect(setErrors).not.toHaveBeenCalled();
        });

        it('should handle empty values object', () => {
            values = {};
            prevValues = {};

            clearErrors(values, prevValues, errors, setErrors);

            expect(setErrors).not.toHaveBeenCalled();
        });
    });
});

//TODO Providers
