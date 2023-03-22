import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import InputField, {IInputFieldViewProps} from '../../../../src/ui/form/InputField/InputField';
import InputFieldMockView from './InputFieldMockView';


describe('InputField tests', () => {
    const props = {
        view: InputFieldMockView,
        showClear: true,
        leadIcon: 'mockIcon',
        className: 'externalClass',
        layout: true,
        placeholder: 'placeholder',
        size: 'sm',
        inputProps: {
            name: 'inputField-test',
        },
    } as IInputFieldViewProps;

    const expectedInputFieldClass = 'InputFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(InputField, props));
        const inputField = getElementByClassName(container, expectedInputFieldClass);
        expect(inputField).toBeInTheDocument();
    });

    it('should have correct attributes', () => {
        const {container} = render(JSXWrapper(InputField, props));

        const input = getElementByTag(container, 'input');

        expect(input).toHaveAttribute('name', props.inputProps.name);
        expect(input).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should have external class', () => {
        const {container} = render(JSXWrapper(InputField, props));
        const inputField = getElementByClassName(container, expectedInputFieldClass);
        expect(inputField).toHaveClass(props.className);
    });

    it('should have correct classes', () => {
        const {container} = render(JSXWrapper(InputField, props));

        const inputField = getElementByClassName(container, expectedInputFieldClass);

        expect(inputField).toHaveClass(expectedInputFieldClass);
        expect(inputField).toHaveClass(`${expectedInputFieldClass}_size_sm`);
        expect(inputField).toHaveClass(`${expectedInputFieldClass}_hasLeadIcon`);
        expect(inputField).toHaveClass(`${expectedInputFieldClass}_hasClearIcon`);
    });

    it('should have icons', () => {
        const {container} = render(JSXWrapper(InputField, props));

        const clearIcon = getElementByClassName(container, `${expectedInputFieldClass}__icon-clear`);
        const leadIcon = getElementByClassName(container, `${expectedInputFieldClass}__lead-icon`);

        expect(clearIcon).toBeInTheDocument();
        expect(leadIcon).toBeInTheDocument();
    });

    it('should have filled class after typing', () => {
        const {container} = render(JSXWrapper(InputField, props));

        const input = getElementByTag(container, 'input');

        fireEvent.change(input, {target: {value: 'test'}});

        const inputField = getElementByClassName(container, expectedInputFieldClass);

        expect(inputField).toHaveClass(`${expectedInputFieldClass}_filled`);
    });
});
