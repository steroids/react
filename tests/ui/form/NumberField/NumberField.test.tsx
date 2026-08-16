import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {waitFor} from '@testing-library/react';

import NumberFieldMockView from './NumberFieldMockView';
import NumberField, {INumberFieldProps} from '../../../../src/ui/form/NumberField/NumberField';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';

describe('NumberField tests', () => {
    const externalClassName = 'external-class-name';
    const hint = 'hint';
    const props = {
        view: NumberFieldMockView,
        className: externalClassName,
        max: 3,
        min: 1,
        hint,
    } as INumberFieldProps;

    const expectedNumberFieldClassName = 'NumberFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(NumberField, props));
        const numberField = getElementByClassName(container, expectedNumberFieldClassName);
        expect(numberField).toBeInTheDocument();
    });

    it('should have the external class name', () => {
        const {container} = render(JSXWrapper(NumberField, props));
        const numberField = getElementByClassName(container, expectedNumberFieldClassName);
        expect(numberField).toHaveClass(externalClassName);
    });

    it('should have the min max attributes', () => {
        const {container} = render(JSXWrapper(NumberField, props));

        const input = getElementByTag(container, 'input');

        expect(input).toHaveAttribute('min', props.min?.toString());
        expect(input).toHaveAttribute('max', props.max?.toString());
    });

    it('should have hint', () => {
        const {getByText} = render(JSXWrapper(NumberField, props));
        const message = getByText(hint);
        expect(message).toBeInTheDocument();
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(NumberField, {
            ...props,
            disabled: true,
        }));

        const component = getElementByClassName(container, `${expectedNumberFieldClassName}_disabled`);

        expect(component).toBeInTheDocument();
    });

    it('should have filled class', async () => {
        const {container} = render(JSXWrapper(NumberField, props));

        const input = getElementByTag(container, 'input');

        fireEvent.input(input, {
            target: {
                value: '1',
            },
        });

        await waitFor(() => {
            const component = getElementByClassName(container, `${expectedNumberFieldClassName}_filled`);
            expect(component).toBeInTheDocument();
        });
    });

    describe('validation', () => {
        const validationCases: Array<[string, Partial<INumberFieldProps>, boolean]> = [
            ['allows an empty optional field', {
                value: '',
            }, true],
            ['rejects an empty required field', {
                value: '',
                required: true,
            }, false],
            ['allows a required field without min and max', {
                value: '5',
                required: true,
            }, true],
            ['rejects a non-numeric value in an optional field', {
                value: 'not-a-number',
            }, false],
            ['rejects a whitespace-only value', {
                value: ' ',
            }, false],
            ['rejects a non-finite value', {
                value: Infinity,
            }, false],
            ['allows a value equal to zero', {
                value: '0',
                required: true,
            }, true],
            ['applies min without max', {
                value: '4',
                min: 5,
            }, false],
            ['allows a value equal to min', {
                value: '5',
                min: 5,
            }, true],
            ['applies max without min', {
                value: '6',
                max: 5,
            }, false],
            ['allows a value equal to max', {
                value: '5',
                max: 5,
            }, true],
            ['rejects a decimal value when decimal is not set', {
                value: '1.2',
            }, false],
            ['rejects a decimal separator when decimal is zero', {
                value: '1.',
                decimal: 0,
            }, false],
            ['allows the configured number of decimal places', {
                value: '1.23',
                decimal: 2,
            }, true],
            ['rejects too many decimal places', {
                value: '1.234',
                decimal: 2,
            }, false],
            ['rejects a negative value when it is forbidden', {
                value: '-1',
                isCanBeNegative: false,
            }, false],
            ['allows a formatted numeric value', {
                value: '1 000.5',
                decimal: 1,
                thousandSeparator: ' ',
            }, true],
        ];

        it.each(validationCases)('%s', async (description, validationProps, expectedValid) => {
            const {container} = render(JSXWrapper(NumberField, {
                view: NumberFieldMockView,
                onChange: jest.fn(),
                ...validationProps,
            }));
            const input = getElementByTag(container, 'input');

            await waitFor(() => {
                if (expectedValid) {
                    expect(input).toBeValid();
                } else {
                    expect(input).toBeInvalid();
                }
            });
        });
    });
});
