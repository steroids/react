import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Field from '../../../../src/ui/form/Field/Field';
import {getElementByClassName, JSXWrapper} from '../../../helpers';

describe('Field tests', () => {
    const props = {
        testId: 'tooltip-test',
        attribute: 'field',
        component: 'PasswordField',
    };

    const wrapper = JSXWrapper(Field, props);

    it('should be in the document', () => {
        const {getByTestId} = render(wrapper);
        const tooltip = getByTestId(props.testId);

        expect(tooltip).toBeInTheDocument();
    });
});
