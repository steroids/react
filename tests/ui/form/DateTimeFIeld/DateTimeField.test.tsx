import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import DateTimeField, {IDateTimeFieldProps} from '../../../../src/ui/form/DateTimeField/DateTimeField';
import DateTimeFieldMockView from './DateTimeFieldMockView';

describe('DateTimeField tests', () => {
    const expectedDateTimeFieldClassName = 'DateTimeFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: IDateTimeFieldProps = {
        view: DateTimeFieldMockView,
        size: 'lg',
        className: externalClass,
        isOpened: true,
        style: externalStyle,
        placeholder: 'This is a placeholder',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(DateTimeField, props));
        const dateField = getElementByClassName(container, expectedDateTimeFieldClassName);
        expect(dateField).toBeInTheDocument();
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(DateTimeField, props));
        const dateField = getElementByClassName(container, expectedDateTimeFieldClassName);
        expect(dateField).toHaveClass(`${expectedDateTimeFieldClassName}_size_${props.size}`);
    });

    it('should have external styles and class', () => {
        const {container} = render(JSXWrapper(DateTimeField, props));
        const dateField = getElementByClassName(container, expectedDateTimeFieldClassName);

        expect(dateField).toHaveClass(externalClass);
        expect(dateField).toHaveStyle(externalStyle);
    });

    it('should have placeholder', () => {
        const {container} = render(JSXWrapper(DateTimeField, props));
        const dateFieldInput = getElementByClassName(container, `${expectedDateTimeFieldClassName}__input`);
        expect(dateFieldInput).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(DateTimeField, {
            ...props,
            disabled: true,
        }));

        const dateField = getElementByClassName(container, expectedDateTimeFieldClassName);
        expect(dateField).toHaveClass(`${expectedDateTimeFieldClassName}_disabled`);
    });

    //TODO ACTION
});
