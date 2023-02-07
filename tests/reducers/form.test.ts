import {
    FORM_ARRAY_ADD,
    FORM_ARRAY_REMOVE,
    FORM_CHANGE,
    FORM_DESTROY,
    FORM_HARD_RESET,
    FORM_INITIALIZE,
    FORM_RESET,
    FORM_SET_ERRORS,
    FORM_SET_SUBMITTING,
    FORM_SUBMIT,
} from '../../src/actions/form';
import form, {formSelector, getFormValues} from '../../src/reducers/form';

describe('form reducers', () => {
    let initialState = {};

    beforeEach(() => {
        initialState = {};
    });

    it('reducer without formId', () => {
        const action = {
            type: 'any',
        };

        initialState = {
            isWithoutFormId: true
        };

        expect(form(initialState, action)).toEqual(initialState);
    });

    it('FORM_INITIALIZE', () => {
        const formId = 'formId';

        const action = {
            type: FORM_INITIALIZE,
            formId,
            values: 'testEmail'
        };

        initialState = {
            [formId]: {},
        };

        const expectedState = {
            [formId]: {
                errors: {},
                isInvalid: false,
                isSubmitting: false,
                values: action.values,
                initialValues: action.values,
            },
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('FORM_CHANGE', () => {
        it('with nameOrObject as string', () => {
            const formId = 'formId';
            const nameOrObject = 'email';

            const action = {
                type: FORM_CHANGE,
                formId,
                nameOrObject,
                value: 'testEmail'
            };

            initialState = {
                [formId]: {
                    isSubmitting: false,
                },
            };

            const expectedState = {
                [formId]: {
                    values: {
                        [nameOrObject]: action.value,
                    },
                    isSubmitting: false,
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });

        it('with nameOrObject as object and should return initial state', () => {
            const formId = 'formId';
            const nameOrObject = {};

            const action = {
                type: FORM_CHANGE,
                formId,
                nameOrObject,
            };

            initialState = {
                [formId]: {
                    isSubmitting: false,
                    values: {
                        someValue: 'someValue',
                    },
                },
            };

            expect(form(initialState, action)).toEqual(initialState);
        });

        it('with nameOrObject as object and should return new state', () => {
            const formId = 'formId';

            const nameOrObject = {
                someValue: 'someValue'
            };

            const action = {
                type: FORM_CHANGE,
                formId,
                nameOrObject,
            };

            initialState = {
                [formId]: {
                    isSubmitting: false,
                    values: {
                        someValue: 'someValue'
                    },
                },
            };

            const expectedState = {
                [formId]: {
                    ...initialState[formId],
                    values: {
                        ...initialState[formId].values,
                        ...nameOrObject,
                    },
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    describe('FORM_SET_ERRORS', () => {
        const formId = 'formId';

        const getInitialState = () => ({
            [formId]: {
                isInvalid: false,
            },
        })

        it('with errors', () => {
            const action = {
                type: FORM_SET_ERRORS,
                formId,
                errors: {
                    1: 'Incorrect login or email',
                },
            };

            const state = getInitialState();

            const expectedState = {
                [formId]: {
                    isInvalid: true,
                    errors: action.errors,
                },
            };

            expect(form(state, action)).toEqual(expectedState);
        });

        it('without errors', () => {
            const action = {
                type: FORM_SET_ERRORS,
                formId,
                errors: {},
            };

            const state = getInitialState();

            const expectedState = {
                [formId]: {
                    isInvalid: false,
                    errors: action.errors,
                },
            };

            expect(form(state, action)).toEqual(expectedState);
        });
    });

    describe('FORM_SUBMIT', () => {
        const formId = 'formId';

        const action = {
            type: FORM_SUBMIT,
            formId,
        };


        it('with submitCounter', () => {
            initialState = {
                [formId]: {
                    submitCounter: 10,
                },
            };

            const expectedState = {
                [formId]: {
                    submitCounter: 11,
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });

        it('without submitCounter', () => {
            initialState = {
                [formId]: {},
            };

            const expectedState = {
                [formId]: {
                    submitCounter: 1,
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    it('FORM_SET_SUBMITTING', () => {
        const formId = 'formId';

        const action = {
            type: FORM_SET_SUBMITTING,
            formId,
            isSubmitting: false,
        };

        initialState = {
            [formId]: {},
        };

        const expectedState = {
            [formId]: {
                isSubmitting: action.isSubmitting,
            },
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('FORM_RESET', () => {
        const formId = 'formId';

        const action = {
            type: FORM_RESET,
            formId,
        };


        it('with initialValues', () => {
            initialState = {
                [formId]: {
                    initialValues: {
                        someValue: 'someValue'
                    },
                },
            };

            const expectedState = {
                [formId]: {
                    ...initialState[formId],
                    values: {
                        ...initialState[formId].initialValues,
                    },
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });

        it('without initialValues', () => {
            initialState = {
                [formId]: {},
            };

            const expectedState = {
                [formId]: {
                    values: {},
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    it('FORM_HARD_RESET', () => {
        const formId = 'formId';

        const action = {
            type: FORM_HARD_RESET,
            formId,
        };

        initialState = {
            [formId]: {
                isInvalid: true,
            },
        };

        const expectedState = {
            [formId]: {
                initialValues: null,
                values: {},
                errors: {},
                isInvalid: false,
                isSubmitting: false,
            },
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    it('FORM_DESTROY', () => {
        const formId = 'formId';

        const action = {
            type: FORM_DESTROY,
            formId,
        };

        initialState = {
            [formId]: {
                values: {
                    someValue: 'someValue'
                },
            },
        };

        const expectedState = {
            [formId]: null,
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('FORM_ARRAY_ADD', () => {
        const formId = 'formId';

        it('without name and initialValues', () => {
            const action = {
                type: FORM_ARRAY_ADD,
                formId,
                rowsCount: 3,
                initialValues: {},
            };

            initialState = {
                [formId]: {
                    isSubmitting: false,
                },
            };

            const expectedState = {...initialState};
            expect(form(initialState, action)).toEqual(expectedState);
        });

        it('without initialValues and with name', () => {
            const telephoneName = 'telephone';
            const telephoneValue = '88005553535'

            const action = {
                type: FORM_ARRAY_ADD,
                formId,
                rowsCount: 1,
                name: telephoneName,
                initialValues: {},
            };

            initialState = {
                [formId]: {
                    values: {
                        [telephoneName]: telephoneValue,
                    },
                },
            };

            const expectedState = {
                [formId]: {
                    values: {
                        [telephoneName]: [telephoneValue, {}],
                    },
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    it('FORM_ARRAY_REMOVE', () => {
        const formId = 'formId';
        const index = '1';
        const valueName = 'telephone';


        const action = {
            type: FORM_ARRAY_REMOVE,
            name: valueName,
            formId,
            index,
        };

        initialState = {
            [formId]: {
                values: {
                    [valueName]: {
                        [index]: '424242'
                    },
                },
            },
        };

        const expectedState = {
            [formId]: {
                values: {
                    [valueName]: {},
                },
            },
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('formSelector', () => {
        it('with correct formId', () => {
            const existingFormId = 'existingFormId';
            const formValues = {someValue: 'someValue'};

            const selector = ({values}) => values;

            const globalState = {
                form: {
                    [existingFormId]: {
                        values: formValues
                    },
                },
            };

            expect(formSelector(globalState, existingFormId, selector)).toEqual(formValues);
        });

        it('with incorrect formId', () => {
            const notExistingFormId = 'notExistingFormId';
            const selector = (currentForm) => currentForm;

            const globalState = {
                form: {
                    existingFormId: {},
                },
            };

            const emptyForm = {};
            expect(formSelector(globalState, notExistingFormId, selector)).toEqual(emptyForm);
        });
    });

    describe('getFormValues', () => {
        it('should return values', () => {
            const formId = 'formId';

            const formValues = {
                someValue: 'someValue'
            };

            const globalState = {
                form: {
                    [formId]: {
                        values: formValues,
                    },
                },
            };

            expect(getFormValues(globalState, formId)).toEqual(formValues);
        });

        it('should return null', () => {
            const notExistingFormId = 'notExistingFormId';

            const globalState = {
                form: {
                    existingFormId: {
                        values: {
                            someValue: 'someValue'
                        },
                    },
                },
            };

            const emptyFormValues = null;
            expect(getFormValues(globalState, notExistingFormId)).toEqual(emptyFormValues);
        });
    });
});
