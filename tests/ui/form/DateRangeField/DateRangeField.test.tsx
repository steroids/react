import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import DateRangeField, {IDateRangeFieldProps} from '../../../../src/ui/form/DateRangeField/DateRangeField';
import DateRangedMockView from './DateRangeFieldMockView';
import DateField from '../../../../src/ui/form/DateField/DateField';

describe('DateRangeField tests', () => {
    const expectedDateRangeFieldClassName = 'DateRangeFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: IDateRangeFieldProps = {
        view: DateRangedMockView,
        size: 'lg',
        className: externalClass,
        isOpened: true,
        style: externalStyle,
        placeholder: 'This is a placeholder',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(DateRangeField, props));
        const dateRangeField = getElementByClassName(container, expectedDateRangeFieldClassName);
        expect(dateRangeField).toBeInTheDocument();
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(DateRangeField, props));
        const dateRangeField = getElementByClassName(container, expectedDateRangeFieldClassName);
        expect(dateRangeField).toHaveClass(`${expectedDateRangeFieldClassName}_size_${props.size}`);
    });

    it('should have external styles and class', () => {
        const {container} = render(JSXWrapper(DateRangeField, props));
        const dateRangeField = getElementByClassName(container, expectedDateRangeFieldClassName);
        expect(dateRangeField).toHaveClass(externalClass);
        expect(dateRangeField).toHaveStyle(externalStyle);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(DateRangeField, {
            ...props,
            disabled: true,
        }));

        const dateRangeField = getElementByClassName(container, expectedDateRangeFieldClassName);
        expect(dateRangeField).toHaveClass(`${expectedDateRangeFieldClassName}_disabled`);
    });
});
