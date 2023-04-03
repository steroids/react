import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {render} from '../../../customRender';
import Field, {IFieldProps} from '../../../../src/ui/form/Field/Field';
import {getElementByClassName, JSXWrapper} from '../../../helpers';

describe('Field tests', () => {
    const props = {
        attribute: 'field',
    } as IFieldProps;

    it('should be in the document with default', () => {
        const {container} = render(JSXWrapper(Field, props));
        const field = getElementByClassName(container, 'InputFieldView');

        expect(field).toBeInTheDocument();
    });

    it('should be in the document with component', () => {
        const component = 'PasswordField';
        const {container} = render(JSXWrapper(Field, {
            ...props,
            component,
        }));
        const fieldComponent = getElementByClassName(container, 'PasswordFieldView');

        expect(fieldComponent).toBeInTheDocument();
    });

    // it('should be in the document with model', () => {
    //     const model = {attributes: [{attribute: 'category', field: 'PasswordField'}]};
    //     const {container} = render(JSXWrapper(Field, {
    //         ...props,
    //         model,
    //     }));
    //     screen.debug();
    //     const fieldModel = getElementByClassName(container, 'PasswordFieldView');

    //     expect(fieldModel).toBeInTheDocument();
    // });
});
