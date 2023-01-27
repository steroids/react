import {formSelector} from '../../src/reducers/form';

describe('form reducers', () => {
    const defaultInitialState = {};

    let initialState = {...defaultInitialState};

    beforeEach(() => {
        initialState = {...defaultInitialState};
    });

    it('formSelector', () => {
        const formId = '1';

        const selector = ({values}) => values;

        const globalState = {
            form: {[formId]: {values: {someValue: 'someValue'}}},
        };

        const expectedResult = globalState.form[formId].values;

        expect(formSelector(globalState, formId, selector)).toEqual(
            expectedResult,
        );
    });
});
