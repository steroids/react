import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';

import NumberFieldMockView from './NumberFieldMockView';
import NumberField, {INumberFieldViewProps} from '../../../../src/ui/form/NumberField/NumberField';
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
    } as INumberFieldViewProps;

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

    it('should have filled class', () => {
        const {container} = render(JSXWrapper(NumberField, props));

        const input = getElementByTag(container, 'input');

        fireEvent.change(input, {target: {value: '1'}});

        const component = getElementByClassName(container, `${expectedNumberFieldClassName}_filled`);

        expect(component).toBeInTheDocument();
    });
});
