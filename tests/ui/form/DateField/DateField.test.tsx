import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import DateField, {IDateFieldProps} from '../../../../src/ui/form/DateField/DateField';
import DateFieldMockView from './DateFieldMockView';

describe('DateField tests', () => {
    const console = global.console;

    beforeAll(() => {
        //Workaround with directly dom rendering in document.body
        global.console.error = jest.fn();
    });

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

    // it('should have correct size', () => {
    //     const {container} = render(JSXWrapper(DateField, props));
    //     const dateField = getElementByClassName(container, expectedDateFieldClassName);
    //     expect(dateField).toHaveClass(`${expectedDateFieldClassName}_size_${props.size}`);
    // });

    // it('should have external styles and class', () => {
    //     const {container} = render(JSXWrapper(DateField, props));
    //     const dateField = getElementByClassName(container, expectedDateFieldClassName);

    //     expect(dateField).toHaveClass(externalClass);
    //     expect(dateField).toHaveStyle(externalStyle);
    // });

    // it('should have placeholder', () => {
    //     const {container} = render(JSXWrapper(DateField, props));
    //     const dateFieldInput = getElementByClassName(container, `${expectedDateFieldClassName}__input`);
    //     expect(dateFieldInput).toHaveAttribute('placeholder', props.placeholder);
    // });

    // it('opening calendar after click', () => {
    //     const {container, debug} = render(JSXWrapper(DateField, props, true), {
    //         container: document.body,
    //     });

    //     const dateFieldInput = getElementByClassName(container, `${expectedDateFieldClassName}__input`);
    //     const dateField = getElementByClassName(container, expectedDateFieldClassName);

    //     // userEvent.type(dateFieldInput, 'test', {

    //     // });
    //     fireEvent.change(dateFieldInput, {
    //         target: {
    //             value: '1',
    //         },
    //     });

    //     // userEvent.change(dateFieldInput, {
    //     //     target: {
    //     //         value: '1',
    //     //     },
    //     // });

    //     // userEvent.type(dateFieldInput, '1');

    //     // fireEvent.click(dateField);

    //     console.log(debug());
    // });

    afterAll(() => {
        global.console = console;
    });
});
