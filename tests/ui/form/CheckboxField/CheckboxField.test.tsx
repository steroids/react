import '@testing-library/jest-dom';
import CheckboxFieldMockView from './CheckboxFieldMockView';
import CheckboxField, {ICheckboxFieldViewProps} from '../../../../src/ui/form/CheckboxField/CheckboxField';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('CheckboxField tests', () => {
    const props: ICheckboxFieldViewProps = {
        view: CheckboxFieldMockView,

        inputProps: {
            name: 'checkbox-test',
            type: 'checkbox',
            checked: false,
            onChange: () => {},
            disabled: false,
        },
    };

    const expectedCheckboxClass = 'CheckboxFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(CheckboxField, props));
        const checkbox = getElementByClassName(container, expectedCheckboxClass);

        expect(checkbox).toBeInTheDocument();
    });

    it('should have external class name and style', () => {
        const externalClassName = 'external-class-test';
        const externalStyle = {
            width: '30px',
        };

        const {container} = render(JSXWrapper(CheckboxField, {
            ...props,
            className: externalClassName,
            style: externalStyle,
        }));

        const checkbox = getElementByClassName(container, externalClassName);

        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toHaveStyle(externalStyle);
    });

    it('should have label', () => {
        const label = 'label';

        const {getByText} = render(JSXWrapper(CheckboxField, {
            ...props,
            label,
        }));

        const checkbox = getByText(label);

        expect(checkbox).toBeInTheDocument();
    });

    it('should have name', () => {
        const {container} = render(JSXWrapper(CheckboxField, props));
        const input = getElementByClassName(container, `${expectedCheckboxClass}__input`);

        expect(input).toHaveAttribute('name', 'checkbox-test');
    });
});
