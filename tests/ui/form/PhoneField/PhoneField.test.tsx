import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';

import PhoneFieldMockView from './PhoneFieldMockView';
import PhoneField, {ICountryPhoneMask} from '../../../../src/ui/form/PhoneField/PhoneField';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';

describe('PhoneField tests', () => {
    const mockPhoneMasks = [
        {
            id: 'RU',
            label: 'Россия',
            phoneCode: '+7',
            phoneMask: ['+', '7', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, '-', /\d/, /\d/],
        },
        {
            id: 'US',
            label: 'США',
            phoneCode: '+1',
            phoneMask: ['+', '1', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
        },
    ] as unknown as ICountryPhoneMask[];

    const props = {
        view: PhoneFieldMockView,
        attribute: 'phone',
        value: '',
        onChange: jest.fn(),
        initialCountryCode: 'RU',
        phoneMasks: mockPhoneMasks,
        showClear: true,
        className: 'externalClass',
        placeholder: 'placeholder',
        size: 'sm',
        inputProps: {
            name: 'phone',
        },
    };

    const expectedPhoneFieldClass = 'PhoneFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(PhoneField, props));
        const phoneField = getElementByClassName(container, expectedPhoneFieldClass);
        expect(phoneField).toBeInTheDocument();
    });

    it('should have correct attributes', () => {
        const {container} = render(JSXWrapper(PhoneField, props));

        const input = getElementByTag(container, 'input');

        expect(input).toHaveAttribute('name', props.inputProps?.name);
        expect(input).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should have external class', () => {
        const {container} = render(JSXWrapper(PhoneField, props));
        const phoneField = getElementByClassName(container, expectedPhoneFieldClass);
        expect(phoneField).toHaveClass(props.className);
    });

    it('should have correct classes', () => {
        const {container} = render(JSXWrapper(PhoneField, props));

        const phoneField = getElementByClassName(container, expectedPhoneFieldClass);

        expect(phoneField).toHaveClass(expectedPhoneFieldClass);
        expect(phoneField).toHaveClass(`${expectedPhoneFieldClass}_size_sm`);
        expect(phoneField).toHaveClass(`${expectedPhoneFieldClass}_hasClearIcon`);
    });

    it('should have icons', () => {
        const {container} = render(JSXWrapper(PhoneField, {
            ...props,
            value: '+7 999 123 45-67',
        }));

        const clearIcon = getElementByClassName(container, `${expectedPhoneFieldClass}__icon-clear`);
        const addonBefore = getElementByClassName(container, `${expectedPhoneFieldClass}__addon-before`);

        expect(clearIcon).toBeInTheDocument();
        expect(addonBefore).toBeInTheDocument();
    });

    it('should show clear icon when showClear is true and input has value', () => {
        const {container} = render(JSXWrapper(PhoneField, {
            ...props,
            showClear: true,
            value: '+7 999 123 45-67',
        }));

        const clearIcon = getElementByClassName(container, `${expectedPhoneFieldClass}__icon-clear`);
        expect(clearIcon).toBeInTheDocument();
    });

    it('should not show clear icon when showClear is false', () => {
        const {container} = render(JSXWrapper(PhoneField, {
            ...props,
            showClear: false,
            value: '+7 999 123 45-67',
        }));

        const clearIcon = container.querySelector(`.${expectedPhoneFieldClass}__icon-clear`);
        expect(clearIcon).not.toBeInTheDocument();
    });

    it('should clear field on clear icon click', () => {
        const onChange = jest.fn();
        const {container} = render(JSXWrapper(PhoneField, {
            ...props,
            showClear: true,
            value: '+7 999 123 45-67',
            onChange,
        }));

        const clearIcon = getElementByClassName(container, `${expectedPhoneFieldClass}__icon-clear`);
        fireEvent.click(clearIcon);

        expect(onChange).toHaveBeenCalledWith('');
    });

    it('should apply phone mask on input', async () => {
        const expectedFormatted = '+7 999 123 45-67';
        const onChange = jest.fn();
        const {container} = render(JSXWrapper(PhoneField, {
            ...props,
            onChange,
        }));
        const input = getElementByClassName(container, `${expectedPhoneFieldClass}__input`) as HTMLInputElement;

        fireEvent.input(input, {
target: {
value: '79991234567',
},
});

        await waitFor(() => {
            expect(onChange).toHaveBeenCalled();
        });

        const lastCallValue = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0];
        expect(lastCallValue).toBe(expectedFormatted);
    });

    it('should limit input by mask when extra digits are entered', async () => {
        const expectedFormatted = '+7 999 123 45-67';
        const onChange = jest.fn();
        const {container} = render(JSXWrapper(PhoneField, {
            ...props,
            onChange,
        }));
        const input = getElementByClassName(container, `${expectedPhoneFieldClass}__input`) as HTMLInputElement;

        fireEvent.input(input, {
target: {
value: '79991234567890123',
},
});

        await waitFor(() => {
            expect(onChange).toHaveBeenCalled();
        });

        const lastCallValue = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0];
        expect(lastCallValue).toBe(expectedFormatted);
    });

    it('should have filled class after typing', () => {
        const {container} = render(JSXWrapper(PhoneField, props));

        const input = getElementByClassName(container, `${expectedPhoneFieldClass}__input`);

        fireEvent.change(input, {
target: {
value: 'test',
},
});

        waitFor(() => {
            const phoneField = getElementByClassName(container, expectedPhoneFieldClass);

            expect(phoneField).toHaveClass(`${expectedPhoneFieldClass}_filled`);
        });
    });

    it('should be disabled', () => {
        const expectedDisabledPhoneFieldClassName = 'PhoneFieldView_disabled';

        const {container} = render(JSXWrapper(PhoneField, {
            ...props,
            disabled: true,
        }));

        const input = getElementByClassName(container, `${expectedPhoneFieldClass}__input`);

        expect(input).toHaveAttribute('disabled');

        fireEvent.change(input, {
target: {
value: 'test',
},
});

        waitFor(() => {
            const phoneField = getElementByClassName(container, expectedPhoneFieldClass);

            expect(phoneField).toHaveClass(expectedDisabledPhoneFieldClassName);
        });
    });

    it('should clear input when country is changed', async () => {
        const onChange = jest.fn();
        const {container, getByText} = render(
            JSXWrapper(PhoneField, {
                ...props,
                value: '+7 999 123 45-67',
                onChange,
            }, true),
        );

        const selectedItems = getElementByClassName(container, 'DropDownCountySelectView__selected-items');
        fireEvent.click(selectedItems);

        await waitFor(() => {
            expect(getByText('США')).toBeInTheDocument();
        });
        fireEvent.click(getByText('США'));

        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
        const clearedValue = lastCall.length === 2 ? lastCall[1] : lastCall[0];
        expect(clearedValue).toBe('');
    });
});
