import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import TimeField, {ITimeFieldProps} from '../../../../src/ui/form/TimeField/TimeField';

describe('TimeField', () => {
    const expectedTimeFieldClassName = 'TimeFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: ITimeFieldProps = {
        size: 'lg',
        className: externalClass,
        isOpened: true,
        style: externalStyle,
        placeholder: 'This is a placeholder',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(TimeField, props));

        const timeField = getElementByClassName(container, expectedTimeFieldClassName);

        expect(timeField).toBeInTheDocument();
    });

    it('should have correct size', () => {
        const {container} = render(JSXWrapper(TimeField, props));
        const timeField = getElementByClassName(container, expectedTimeFieldClassName);
        expect(timeField).toHaveClass(`${expectedTimeFieldClassName}_size_${props.size}`);
    });

    it('should have placeholder', () => {
        const {container} = render(JSXWrapper(TimeField, props));
        const timeField = getElementByClassName(container, `${expectedTimeFieldClassName}__input`);
        expect(timeField).toHaveAttribute('placeholder', props.placeholder);
    });

    it('should be disabled', () => {
        const {container} = render(JSXWrapper(TimeField, {
            ...props,
            disabled: true,
        }));

        const dateField = getElementByClassName(container, expectedTimeFieldClassName);
        expect(dateField).toHaveClass(`${expectedTimeFieldClassName}_disabled`);
    });

    //TODO Action
});
