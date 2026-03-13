import '@testing-library/jest-dom';
import RadioListFieldMockView from './RadioListFieldMockView';
import RadioListField from '../../../../src/ui/form/RadioListField/RadioListField';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';

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
    };

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
});
