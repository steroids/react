import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import DateField, {IDateFieldProps} from '../../../../src/ui/form/DateField/DateField';
import DateFieldMockView from './DateFieldMockView';

describe('DateField tests', () => {
    const expectedDateFieldClassName = 'DateFieldView';
    const externalClass = 'external-class';
    const externalStyle = {width: '30px'};

    const props: IDateFieldProps = {
        view: DateFieldMockView,
        size: 'lg',
        className: externalClass,
        style: externalStyle,
        // placeholder: 'This is a placeholder',
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
        const {container, debug} = render(JSXWrapper(DateField, props));
        const dateField = getElementByClassName(container, expectedDateFieldClassName);

        console.log(debug());

        expect(dateField).toHaveClass(externalClass);
        expect(dateField).toHaveStyle(externalStyle);
    });

    // it('should have placeholder', () => {
    //     const {container, debug} = render(JSXWrapper(DateField, props));

    //     // console.log(debug());
    // });
});
