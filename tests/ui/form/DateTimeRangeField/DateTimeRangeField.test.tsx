import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import DateTimeRangeField, {IDateTimeRangeFieldProps} from '../../../../src/ui/form/DateTimeRangeField/DateTimeRangeField';
import DateTimeRangeFieldMockView from './DateTimeRangeFieldMockView';

describe('DateTimeRangeField tests', () => {
    const expectedDateTimeFieldClassName = 'DateTimeRangeFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: IDateTimeRangeFieldProps = {
        view: DateTimeRangeFieldMockView,
        size: 'lg',
        className: externalClass,
        isOpened: true,
        style: externalStyle,
        placeholder: 'This is a placeholder',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(DateTimeRangeField, props));
        const dateTimeRange = getElementByClassName(container, expectedDateTimeFieldClassName);
        expect(dateTimeRange).toBeInTheDocument();
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(DateTimeRangeField, props));
        const dateTimeRange = getElementByClassName(container, expectedDateTimeFieldClassName);
        expect(dateTimeRange).toHaveClass(`${expectedDateTimeFieldClassName}_size_${props.size}`);
    });

    it('should have external styles and class', () => {
        const {container} = render(JSXWrapper(DateTimeRangeField, props));
        const dateTimeRange = getElementByClassName(container, expectedDateTimeFieldClassName);

        expect(dateTimeRange).toHaveClass(externalClass);
        expect(dateTimeRange).toHaveStyle(externalStyle);
    });

    it('should have placeholder', () => {
        const {container} = render(JSXWrapper(DateTimeRangeField, props));
        const dateTimeRange = getElementByClassName(container, `${expectedDateTimeFieldClassName}__input`);
        expect(dateTimeRange).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(DateTimeRangeField, {
            ...props,
            disabled: true,
        }));

        const dateTimeRange = getElementByClassName(container, expectedDateTimeFieldClassName);
        expect(dateTimeRange).toHaveClass(`${expectedDateTimeFieldClassName}_disabled`);
    });

    //TODO ACTION
});
