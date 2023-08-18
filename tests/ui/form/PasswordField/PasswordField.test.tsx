import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
import PasswordField, {IPasswordFieldProps} from '../../../../src/ui/form/PasswordField/PasswordField';
import PasswordFieldMockView from './PasswordFieldMockView';

describe('PasswordField tests', () => {
    const props = {
        view: PasswordFieldMockView,
        showSecurityBar: true,
        showSecurityIcon: true,
        inputProps: {
            disabled: true,
            name: 'password-test',
            type: 'password',
            placeholder: 'Password',
        },
        size: 'md',

    } as IPasswordFieldProps;

    const expectedPasswordFieldClass = 'PasswordFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(PasswordField, props));
        const passwordField = getElementByClassName(container, expectedPasswordFieldClass);
        expect(passwordField).toBeInTheDocument();
    });

    it('should have right attributes', () => {
        const {container} = render(JSXWrapper(PasswordField, props));

        const input = getElementByTag(container, 'input');

        expect(input).toHaveAttribute('type', 'password');
        expect(input).toHaveAttribute('name', 'password-test');
        expect(input).toHaveAttribute('placeholder', 'Password');
        expect(input).toHaveAttribute('disabled');
    });

    it('should have right classes', () => {
        const {container} = render(JSXWrapper(PasswordField, props));

        const passwordField = getElementByClassName(container, expectedPasswordFieldClass);

        expect(passwordField).toHaveClass(expectedPasswordFieldClass);
        expect(passwordField).toHaveClass(`${expectedPasswordFieldClass}_size_md`);
        expect(passwordField).toHaveClass(`${expectedPasswordFieldClass}_disabled`);
    });

    it('should have security bar', () => {
        const {container} = render(JSXWrapper(PasswordField, props));
        const securityBar = getElementByClassName(container, `${expectedPasswordFieldClass}__security-bar`);
        expect(securityBar).toBeInTheDocument();
    });

    it('should have controls', () => {
        const {container} = render(JSXWrapper(PasswordField, props));
        const eyeIcon = getElementByClassName(container, `${expectedPasswordFieldClass}__icon-eye`);
        expect(eyeIcon).toBeInTheDocument();
    });

    it('should have filled className after typeing', () => {
        const {container} = render(JSXWrapper(PasswordField, props));

        const input = getElementByTag(container, 'input');

        fireEvent.change(input, {target: {value: 'test'}});

        const passwordFieldWithFilledClass = getElementByClassName(container, `${expectedPasswordFieldClass}_filled`);

        expect(passwordFieldWithFilledClass).toBeInTheDocument();
    });
});
