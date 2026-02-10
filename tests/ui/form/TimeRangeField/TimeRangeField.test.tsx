import '@testing-library/jest-dom';
import TimeRangeField, {ITimeRangeFieldProps} from '../../../../src/ui/form/TimeRangeField/TimeRangeField';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('TimeRangeField', () => {
    const expectedTimeRangeFieldClassName = 'TimeRangeFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: ITimeRangeFieldProps = {
        size: 'lg',
        className: externalClass,
        isOpened: true,
        style: externalStyle,
        placeholder: 'This is a placeholder',
    };

    it('should be in the document', () => {
        const {container, debug} = render(JSXWrapper(TimeRangeField, {}));

        const timeRangeField = getElementByClassName(container, expectedTimeRangeFieldClassName);
        expect(timeRangeField).toBeInTheDocument();
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(TimeRangeField, props));
        const timeRangeField = getElementByClassName(container, expectedTimeRangeFieldClassName);
        expect(timeRangeField).toHaveClass(`${expectedTimeRangeFieldClassName}_size_${props.size}`);
    });

    it('should have external styles and class', () => {
        const {container} = render(JSXWrapper(TimeRangeField, props));
        const timeRangeField = getElementByClassName(container, expectedTimeRangeFieldClassName);

        expect(timeRangeField).toHaveClass(externalClass);
        expect(timeRangeField).toHaveStyle(externalStyle);
    });

    it('should have placeholder', () => {
        const {container} = render(JSXWrapper(TimeRangeField, props));
        const timeRangeField = getElementByClassName(container, `${expectedTimeRangeFieldClassName}__input`);
        expect(timeRangeField).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(TimeRangeField, {
            ...props,
            disabled: true,
        }));

        const timeRangeField = getElementByClassName(container, expectedTimeRangeFieldClassName);
        expect(timeRangeField).toHaveClass(`${expectedTimeRangeFieldClassName}_disabled`);
    });

    //TODO ACTION
});
