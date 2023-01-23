import configureMockStore from 'redux-mock-store';

import {
    formInitialize,
    FORM_INITIALIZE,
    FORM_CHANGE,
    FORM_SET_ERRORS,
    formChange,
    formSetErrors,
    FORM_SUBMIT,
    formSubmit,
    FORM_SET_SUBMITTING,
    formSetSubmitting,
    FORM_RESET,
    formReset,
    FORM_HARD_RESET,
    formHardReset,
    formDestroy,
    FORM_DESTROY,
    FORM_ARRAY_ADD,
    formArrayAdd,
    FORM_ARRAY_REMOVE,
    formArrayRemove,
} from '../../src/actions/form';

import prepareMiddleware from '../storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});
const mockFormId = 'mockFormId';

describe('form actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('formInitialize', () => {
        const values = {
            value1: 'orange',
            value2: 'green',
        };

        const expectedActions = [
            {
                type: FORM_INITIALIZE,
                formId: mockFormId,
                values,
            },
        ];

        store.dispatch(formInitialize(mockFormId, values));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('formChange', () => {
        it('without value', () => {
            const nameOrObject = {
                object: true,
            };

            const expectedActions = [
                {
                    formId: mockFormId,
                    type: FORM_CHANGE,
                    value: null,
                    nameOrObject,
                },
            ];

            store.dispatch(formChange(mockFormId, nameOrObject));
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with value', () => {
            const value = 'Ivan';
            const name = 'userName';

            const expectedActions = [
                {
                    formId: mockFormId,
                    type: FORM_CHANGE,
                    value,
                    nameOrObject: name,
                },
            ];

            store.dispatch(formChange(mockFormId, name, value));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('formSetErrors', () => {
        const errors = {
            message: "It's crashed",
        };

        const expectedActions = [
            {
                formId: mockFormId,
                type: FORM_SET_ERRORS,
                errors,
            },
        ];

        store.dispatch(formSetErrors(mockFormId, errors));
        expect(store.getActions()).toEqual(expectedActions);
    });
    it('formSubmit', () => {
        const expectedActions = [
            {
                formId: mockFormId,
                type: FORM_SUBMIT,
            },
        ];

        store.dispatch(formSubmit(mockFormId));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('formSetSubmitting', () => {
        it('true condition', () => {
            const isSubmitting = true;

            const expectedActions = [
                {
                    formId: mockFormId,
                    isSubmitting,
                    type: FORM_SET_SUBMITTING,
                },
            ];

            store.dispatch(formSetSubmitting(mockFormId, true));
            expect(store.getActions()).toEqual(expectedActions);
        });
        it('false condition', () => {
            const isSubmitting = false;

            const expectedActions = [
                {
                    formId: mockFormId,
                    isSubmitting,
                    type: FORM_SET_SUBMITTING,
                },
            ];

            store.dispatch(formSetSubmitting(mockFormId, false));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('formReset', () => {
        const expectedActions = [
            {
                formId: mockFormId,
                type: FORM_RESET,
            },
        ];

        store.dispatch(formReset(mockFormId));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('formHardReset', () => {
        const expectedActions = [
            {
                formId: mockFormId,
                type: FORM_HARD_RESET,
            },
        ];

        store.dispatch(formHardReset(mockFormId));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('formDestroy', () => {
        const expectedActions = [
            {
                type: FORM_DESTROY,
                formId: mockFormId,
            },
        ];

        store.dispatch(formDestroy(mockFormId));
        expect(store.getActions()).toEqual(expectedActions);
    });
    it('formArrayAdd', () => {
        const name = 'Contacts';
        const rowsCount = 10;

        const initialValues = {
            value1: 'value1',
            value2: 'value2',
        };

        const expectedActions = [
            {
                type: FORM_ARRAY_ADD,
                formId: mockFormId,
                name,
                rowsCount,
                initialValues,
            },
        ];

        store.dispatch(
            formArrayAdd(mockFormId, name, rowsCount, initialValues),
        );
        expect(store.getActions()).toEqual(expectedActions);
    });
    it('formArrayRemove', () => {
        const name = 'PhoneNumbers';
        const index = 32;

        const expectedActions = [
            {
                type: FORM_ARRAY_REMOVE,
                formId: mockFormId,
                name,
                index,
            },
        ];

        store.dispatch(formArrayRemove(mockFormId, name, index));
        expect(store.getActions()).toEqual(expectedActions);
    });
});
