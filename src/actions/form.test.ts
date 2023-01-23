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
} from './form';

import prepareMiddleware from '../../tests/storeMiddlewareMock';

const mockStore = configureMockStore([prepareMiddleware]);
const store = mockStore({});

describe('form actions', () => {
    beforeEach(() => {
        store.clearActions();
    });

    it('formInitialize', () => {
        const expectedActions = [
            {
                type: FORM_INITIALIZE,
                formId: '0',
                values: {},
            },
        ];

        store.dispatch(formInitialize('0', {}));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('formChange', () => {
        it('without value', () => {
            const expectedActions = [
                {
                    formId: '0',
                    type: FORM_CHANGE,
                    value: null,
                    nameOrObject: {},
                },
            ];

            store.dispatch(formChange('0', {}));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('formSetErrors', () => {
        const expectedActions = [
            {
                formId: '0',
                type: FORM_SET_ERRORS,
                errors: {},
            },
        ];

        store.dispatch(formSetErrors('0', {}));
        expect(store.getActions()).toEqual(expectedActions);
    });
    it('formSubmit', () => {
        const expectedActions = [
            {
                formId: '0',
                type: FORM_SUBMIT,
            },
        ];

        store.dispatch(formSubmit('0'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('formSetSubmitting', () => {
        it('true condition', () => {
            const expectedActions = [
                {
                    formId: '0',
                    isSubmitting: true,
                    type: FORM_SET_SUBMITTING,
                },
            ];

            store.dispatch(formSetSubmitting('0', true));
            expect(store.getActions()).toEqual(expectedActions);
        });
        it('false condition', () => {
            const expectedActions = [
                {
                    formId: '0',
                    isSubmitting: false,
                    type: FORM_SET_SUBMITTING,
                },
            ];

            store.dispatch(formSetSubmitting('0', false));
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('formReset', () => {
        const expectedActions = [
            {
                formId: '0',
                type: FORM_RESET,
            },
        ];

        store.dispatch(formReset('0'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('formHardReset', () => {
        const expectedActions = [
            {
                formId: '0',
                type: FORM_HARD_RESET,
            },
        ];

        store.dispatch(formHardReset('0'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('formDestroy', () => {
        const expectedActions = [
            {
                type: FORM_DESTROY,
                formId: '0',
            },
        ];

        store.dispatch(formDestroy('0'));
        expect(store.getActions()).toEqual(expectedActions);
    });
    it('formArrayAdd', () => {
        const name = 'Contact';

        const expectedActions = [
            {
                type: FORM_ARRAY_ADD,
                formId: '0',
                name,
                rowsCount: 4,
                initialValues: {},
            },
        ];

        store.dispatch(formArrayAdd('0', name, 4, {}));
        expect(store.getActions()).toEqual(expectedActions);
    });
    it('formArrayRemove', () => {
        const name = 'Contact';

        const expectedActions = [
            {
                type: FORM_ARRAY_REMOVE,
                formId: '0',
                name,
                index: 5,
            },
        ];

        store.dispatch(formArrayRemove('0', name, 5));
        expect(store.getActions()).toEqual(expectedActions);
    });
});
