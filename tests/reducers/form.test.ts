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
    const defaultInitialState = {};
    let initialState = {...defaultInitialState};

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    it('reducer without formId', () => {
        const action = {
            type: 'any',
        };

        initialState = {
            10: {
                fields: {
                    name: {
                        type: 'text',
                        autocomplete: true,
                    },
                },
            },
        };

        const expectedState = {...initialState};
        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('FORM_CHANGE', () => {
        it('with nameOrObject as string', () => {
            const formId = '10';
            const nameOrObject = 'email';

            const action = {
                type: FORM_CHANGE,
                formId,
                nameOrObject,
                value: {
                    10: {
                        type: 'text',
                        autocomplete: true,
                    },
                },
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
            const formId = '10';
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
                        1: {
                            type: 'text',
                            autocomplete: false,
                        },
                    },
                },
            };

            const expectedState = {
                ...initialState,
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });

        it('with nameOrObject as object and should return new state', () => {
            const formId = '10';

            const nameOrObject = {
                3: {
                    type: 'number',
                    autocomplete: true,
                },
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
                        1: {
                            type: 'text',
                            autocomplete: false,
                        },
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
        it('with errors', () => {
            const formId = '5';

            const action = {
                type: FORM_SET_ERRORS,
                formId,
                errors: {
                    1: 'Incorrect login or email',
                },
            };

            initialState = {
                [formId]: {
                    isInvalid: false,
                    isSubmitting: false,
                },
            };

            const expectedState = {
                [formId]: {
                    isInvalid: true,
                    errors: action.errors,
                    isSubmitting: false,
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });

        it('without errors', () => {
            const formId = '5';

            const action = {
                type: FORM_SET_ERRORS,
                formId,
                errors: {},
            };

            initialState = {
                [formId]: {
                    isInvalid: false,
                    isSubmitting: false,
                },
            };

            const expectedState = {
                [formId]: {
                    isInvalid: false,
                    errors: action.errors,
                    isSubmitting: false,
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    it('FORM_INITIALIZE', () => {
        const formId = '10';

        const action = {
            type: FORM_INITIALIZE,
            formId,
            values: {
                someValue: {
                    id: 1,
                },
            },
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

    describe('FORM_SUBMIT', () => {
        it('with submitCounter', () => {
            const formId = '15';

            const action = {
                type: FORM_SUBMIT,
                formId,
            };

            initialState = {
                [formId]: {
                    isSubmitting: true,
                    isInvalid: false,
                    submitCounter: 10,
                },
            };

            const expectedState = {
                [formId]: {
                    isSubmitting: true,
                    isInvalid: false,
                    submitCounter: 11,
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });

        it('without submitCounter', () => {
            const formId = '15';

            const action = {
                type: FORM_SUBMIT,
                formId,
            };

            initialState = {
                [formId]: {
                    isSubmitting: true,
                    isInvalid: false,
                },
            };

            const expectedState = {
                [formId]: {
                    isSubmitting: true,
                    isInvalid: false,
                    submitCounter: 1,
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    it('FORM_SET_SUBMITTING', () => {
        const formId = '0';

        const action = {
            type: FORM_SET_SUBMITTING,
            formId,
            isSubmitting: false,
        };

        initialState = {
            [formId]: {
                isInvalid: true,
            },
        };

        const expectedState = {
            [formId]: {
                isInvalid: true,
                isSubmitting: false,
            },
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('FORM_RESET', () => {
        it('with initialValues', () => {
            const formId = '32';

            const action = {
                type: FORM_RESET,
                formId,
            };

            initialState = {
                [formId]: {
                    initialValues: {
                        name: {
                            type: 'text',
                            autocomplete: true,
                            data: {
                                id: '15',
                            },
                        },
                    },
                    isSubmitting: false,
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
            const formId = '32';

            const action = {
                type: FORM_RESET,
                formId,
            };

            initialState = {
                [formId]: {
                    isSubmitting: false,
                },
            };

            const expectedState = {
                [formId]: {
                    ...initialState[formId],
                    values: {},
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    it('FORM_HARD_RESET', () => {
        const formId = '15';

        const action = {
            type: FORM_HARD_RESET,
            formId,
        };

        initialState = {
            [formId]: {
                errors: {
                    1: 'Password is weak',
                },
                isSubmitting: true,
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
        const formId = '10';

        const action = {
            type: FORM_DESTROY,
            formId,
        };

        initialState = {
            [formId]: {
                values: {
                    name: {
                        type: 'text',
                        autoComplete: true,
                    },
                },
            },
        };

        const expectedState = {
            [formId]: null,
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('FORM_ARRAY_ADD', () => {
        it('without name and initialValues', () => {
            const formId = '10';

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
            const formId = '10';
            const name = 'telephone';

            const action = {
                type: FORM_ARRAY_ADD,
                formId,
                rowsCount: 1,
                name,
                initialValues: {},
            };

            initialState = {
                [formId]: {
                    isSubmitting: false,
                    values: {
                        [name]: {
                            autocomplete: true,
                        },
                    },
                },
            };

            const expectedState = {
                [formId]: {
                    isSubmitting: false,
                    values: {
                        [name]: [initialState[formId].values[name], {}],
                    },
                },
            };

            expect(form(initialState, action)).toEqual(expectedState);
        });
    });

    it('FORM_ARRAY_REMOVE', () => {
        const formId = '87';
        const index = '1';
        const valueName = 'telephone';

        const creditCardValue = {
            1: {
                show: false,
            },
        };

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
                        [index]: {
                            autoComplete: true,
                        },
                    },
                    creditCard: creditCardValue,
                },
            },
        };

        const expectedState = {
            [formId]: {
                values: {
                    creditCard: creditCardValue,
                    [valueName]: {},
                },
            },
        };

        expect(form(initialState, action)).toEqual(expectedState);
    });

    describe('formSelector', () => {
        it('with correct formId', () => {
            const formId = '1';
            const selector = ({values}) => values;

            const globalState = {
                form: {
                    [formId]: {
                        values: {
                            someValue: 'someValue',
                        },
                    },
                },
            };

            const expectedResult = globalState.form[formId].values;

            expect(formSelector(globalState, formId, selector)).toEqual(
                expectedResult,
            );
        });

        it('with incorrect formId', () => {
            const formId = '0';
            const selector = (currentForm) => currentForm;

            const globalState = {
                form: {
                    10: {
                        values: {
                            someValue: 'someValue',
                        },
                    },
                },
            };

            const expectedSelectData = {};

            expect(formSelector(globalState, formId, selector)).toEqual(
                expectedSelectData,
            );
        });
    });

    describe('getFormValues', () => {
        it('should return values', () => {
            const formId = '0';

            const formValues = {
                fields: {
                    name: {
                        type: 'text',
                        autocomplete: true,
                    },
                },
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
            const formId = '0';

            const globalState = {
                form: {
                    15: {
                        values: {
                            fields: {
                                name: {
                                    type: 'text',
                                    autocomplete: true,
                                },
                                telephone: {
                                    type: 'tel',
                                    autocomplete: false,
                                },
                            },
                        },
                    },
                },
            };

            const emptyFormValues = null;
            expect(getFormValues(globalState, formId)).toEqual(emptyFormValues);
        });
    });
});
