import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';

import TextFieldMockView from './TextFieldMockView';
import TextField, {ITextFieldViewProps} from '../../../../src/ui/form/TextField/TextField';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';

describe('TextField tests', () => {
    const externalClassName = 'TextFieldExternalClass';

    const props: ITextFieldViewProps = {
        inputProps: {
            disabled: true,
            required: false,
            name: 'name',
            onChange: jest.fn(),
            placeholder: 'placeholder',
            value: 'value',
            onKeyUp: jest.fn(),
        },
        required: true,
        onClear: jest.fn(),
        placeholder: 'placeholder',
        className: externalClassName,
        view: TextFieldMockView,
    };

    const expectedTextFieldClass = 'TextFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(TextField, props));
        const textField = getElementByClassName(container, expectedTextFieldClass);

        expect(textField).toBeInTheDocument();
    });

    it('should have external className', () => {
        const {container} = render(JSXWrapper(TextField, props));
        const textField = getElementByClassName(container, expectedTextFieldClass);

        expect(textField).toBeInTheDocument();
        expect(textField).toHaveClass(externalClassName);
    });

    it('should have right placeholder', () => {
        const {container} = render(JSXWrapper(TextField, props));
        const textArea = getElementByTag(container, 'textarea');

        expect(textArea).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should have name attribute and value', () => {
        const {container, getByText} = render(JSXWrapper(TextField, props));
        const textArea = getElementByTag(container, 'textarea');
        const value = getByText(props.inputProps.value);

        expect(textArea).toHaveAttribute('name', props.inputProps.name);
        expect(value).toBeInTheDocument();
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(TextField, props));
        const textArea = getElementByTag(container, 'textarea');

        expect(textArea).toBeDisabled();
    });

    describe('actions', () => {
        const mockedOnChange = jest.fn();
        const mockedOnKeyUp = jest.fn();
        const mockedOnClear = jest.fn();

        const actionProps: ITextFieldViewProps = {
            inputProps: {
                disabled: true,
                required: false,
                name: 'name',
                onChange: mockedOnChange,
                placeholder: 'placeholder',
                value: 'value',
                onKeyUp: mockedOnKeyUp,
            },
            view: TextFieldMockView,
            showClose: true,
            onClear: mockedOnClear,
        };

        it('should call onChange', () => {
            const {container} = render(JSXWrapper(TextField, actionProps));
            const textArea = getElementByTag(container, 'textarea');
            const expectedChangeCallCount = 1;

            fireEvent.change(textArea, {target: {value: '1'}});

            expect(mockedOnChange.mock.calls.length).toBe(expectedChangeCallCount);
        });

        it('should call onKeyUp', () => {
            const {container} = render(JSXWrapper(TextField, actionProps));
            const textArea = getElementByTag(container, 'textarea');
            const expectedKeyUpCallCount = 1;

            fireEvent.keyUp(textArea, {key: 'Enter'});

            expect(mockedOnKeyUp.mock.calls.length).toBe(expectedKeyUpCallCount);
        });
    });
});
