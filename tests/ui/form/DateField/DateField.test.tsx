import '@testing-library/jest-dom';
import DateFieldMockView from './DateFieldMockView';
import DateField, {IDateFieldProps} from '../../../../src/ui/form/DateField/DateField';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('DateField tests', () => {
    const expectedDateFieldClassName = 'DateFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: IDateFieldProps = {
        view: DateFieldMockView,
        size: 'lg',
        className: externalClass,
        isOpened: true,
        style: externalStyle,
        placeholder: 'This is a placeholder',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(DateField, props));
        const dateField = getElementByClassName(container, expectedDateFieldClassName);
        expect(dateField).toBeInTheDocument();
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(DateField, props));
        const dateField = getElementByClassName(container, expectedDateFieldClassName);
        expect(dateField).toHaveClass(`${expectedDateFieldClassName}_size_${props.size}`);
    });

    it('should have external styles and class', () => {
        const {container} = render(JSXWrapper(DateField, props));
        const dateField = getElementByClassName(container, expectedDateFieldClassName);

        expect(dateField).toHaveClass(externalClass);
        expect(dateField).toHaveStyle(externalStyle);
    });

    it('should have placeholder', () => {
        const {container} = render(JSXWrapper(DateField, props));
        const dateFieldInput = getElementByClassName(container, `${expectedDateFieldClassName}__input`);
        expect(dateFieldInput).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(DateField, {
            ...props,
            disabled: true,
        }));

        const dateField = getElementByClassName(container, expectedDateFieldClassName);
        expect(dateField).toHaveClass(`${expectedDateFieldClassName}_disabled`);
    });

    //TODO ACTION
});
