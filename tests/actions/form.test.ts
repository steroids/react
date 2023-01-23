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
const mockNumber = 5;

describe('form actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('formInitialize', () => {
        const mockValues = {
            value1: 'orange',
            value2: 'green',
        };

        const expectedActions = [
            {
                type: FORM_INITIALIZE,
                formId: mockFormId,
                values: mockValues,
            },
        ];

        store.dispatch(formInitialize(mockFormId, mockValues));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('formChange', () => {
        it('without value', () => {
            const mockObject = {
                object: true,
            };

            const expectedActions = [
                {
                    formId: mockFormId,
                    type: FORM_CHANGE,
                    value: null,
                    nameOrObject: mockObject,
                },
            ];

            store.dispatch(formChange(mockFormId, mockObject));
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('with value', () => {
            const mockValue = 'Ivan';
            const mockName = 'Anatoliy';

            const expectedActions = [
                {
                    formId: mockFormId,
                    type: FORM_CHANGE,
                    value: mockValue,
                    nameOrObject: mockName,
                },
            ];

            store.dispatch(formChange(mockFormId, mockName, mockValue));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('formSetErrors', () => {
        const mockError = {
            message: "It's crashed",
        };

        const expectedActions = [
            {
                formId: mockFormId,
                type: FORM_SET_ERRORS,
                errors: mockError,
            },
        ];

        store.dispatch(formSetErrors(mockFormId, mockError));
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
            const expectedActions = [
                {
                    formId: mockFormId,
                    isSubmitting: true,
                    type: FORM_SET_SUBMITTING,
                },
            ];

            store.dispatch(formSetSubmitting(mockFormId, true));
            expect(store.getActions()).toEqual(expectedActions);
        });
        it('false condition', () => {
            const expectedActions = [
                {
                    formId: mockFormId,
                    isSubmitting: false,
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
        const mockName = 'Contact';

        const mockInitialValues = {
            value1: 'value1',
            value2: 'value2',
        };

        const expectedActions = [
            {
                type: FORM_ARRAY_ADD,
                formId: mockFormId,
                name: mockName,
                rowsCount: mockNumber,
                initialValues: mockInitialValues,
            },
        ];

        store.dispatch(
            formArrayAdd(mockFormId, mockName, mockNumber, mockInitialValues),
        );
        expect(store.getActions()).toEqual(expectedActions);
    });
    it('formArrayRemove', () => {
        const mockName = 'Phone';

        const expectedActions = [
            {
                type: FORM_ARRAY_REMOVE,
                formId: mockFormId,
                name: mockName,
                index: mockNumber,
            },
        ];

        store.dispatch(formArrayRemove(mockFormId, mockName, mockNumber));
        expect(store.getActions()).toEqual(expectedActions);
    });
});
