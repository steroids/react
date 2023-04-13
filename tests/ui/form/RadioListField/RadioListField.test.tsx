import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import RadioListField, {IRadioListFieldProps} from '../../../../src/ui/form/RadioListField/RadioListField';
import RadioListFieldMockView from './RadioListFieldMockView';

describe('RadioListField tests', () => {
    const radioLabel = 'radioLabel';

    const props = {
        className: 'test-class',
        view: RadioListFieldMockView,
        items: [
            {
                id: 1,
                label: radioLabel,
            },
        ],
    } as IRadioListFieldProps;

    const expectedRadioListFieldClass = 'RadioListFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(RadioListField, props));
        const radioListField = getElementByClassName(container, expectedRadioListFieldClass);
        expect(radioListField).toBeInTheDocument();
    });

    it('should have external class', () => {
        const {container} = render(JSXWrapper(RadioListField, props));
        const radioListFieldItem = getElementByClassName(container, `${expectedRadioListFieldClass}`);
        expect(radioListFieldItem).toHaveClass(props.className);
    });

    it('should have correct type', () => {
        const {container, debug} = render(JSXWrapper(RadioListField, props));
        const input = getElementByTag(container, 'input');
        expect(input).toHaveAttribute('type', 'radio');
    });

    it('should have correct label', () => {
        const {getByText} = render(JSXWrapper(RadioListField, props));
        const label = getByText(radioLabel);
        expect(label).toBeInTheDocument();
    });

    it('should have checked class after click', () => {
        const {container} = render(JSXWrapper(RadioListField, props));
        const input = getElementByTag(container, 'input');
        fireEvent.click(input);
        expect(input).toHaveClass('RadioFieldView__input_checked');
    });
});
