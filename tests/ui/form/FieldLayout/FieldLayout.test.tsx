import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import FieldLayoutMockView from './FieldLayoutMockView';
import FieldLayout from '../../../../src/ui/form/FieldLayout/FieldLayout';

describe('FieldLayout tests', () => {
    const props = {
        view: FieldLayoutMockView,
        required: true,
        size: 'small',
        children: 'test-children',
        label: 'test-label',
        hint: 'test-hint',
    };

    const expectedFieldLayoutClass = 'FieldLayoutView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(FieldLayout, props));
        const fieldLayout = getElementByClassName(container, expectedFieldLayoutClass);

        expect(fieldLayout).toBeInTheDocument();
    });

    it('should have correct hint: content, class, size', () => {
        const {container} = render(JSXWrapper(FieldLayout, props));
        const hint = getElementByClassName(container, `${expectedFieldLayoutClass}__hint`);

        expect(hint).toHaveClass(`${expectedFieldLayoutClass}__hint_size_${props.size}`);
    });

    it('should have correct children: content, class', () => {
        const {container, getByText} = render(JSXWrapper(FieldLayout, props));
        const childrenClass = getElementByClassName(container, `${expectedFieldLayoutClass}__field`);
        const childrenText = getByText(props.children);

        expect(childrenClass).toBeInTheDocument();
        expect(childrenText).toBeInTheDocument();
    });

    it('should have correct label : content, class, size, required', () => {
        const {container, getByText} = render(JSXWrapper(FieldLayout, props));
        const label = getElementByClassName(container, `${expectedFieldLayoutClass}__label`);
        const labelText = getByText(`${props.label}:`);

        expect(label).toBeInTheDocument();
        expect(labelText).toBeInTheDocument();
        expect(label).toHaveClass(`${expectedFieldLayoutClass}__label_required`);
        expect(label).toHaveClass(`${expectedFieldLayoutClass}__label_size_${props.size}`);
    });

    it('should have correct error: content, class, icon', () => {
        const errors = ['test-error1', 'test-error2', 'test-error3'];

        const {container, getByText} = render(JSXWrapper(FieldLayout, {
            ...props,
            errors,
        }));

        const invalidFeedback = getElementByClassName(container, `${expectedFieldLayoutClass}__invalid-feedback`);
        const errorTextSize = getElementByClassName(container, `${expectedFieldLayoutClass}__error-text_size_${props.size}`);
        const errorMessage = getElementByClassName(container, `${expectedFieldLayoutClass}__error-message`);
        const errorText = getElementByClassName(container, `${expectedFieldLayoutClass}__error-text`);
        const icon = getElementByClassName(container, `${expectedFieldLayoutClass}__icon_error`);
        const errorClasses = [invalidFeedback, errorTextSize, errorMessage, errorText, icon];

        errors.forEach((error) => expect(getByText(error)).toBeInTheDocument());
        errorClasses.forEach((errorClass) => expect(errorClass).toBeInTheDocument());
    });
});
