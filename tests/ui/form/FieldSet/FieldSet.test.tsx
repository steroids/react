import '@testing-library/jest-dom';
import FieldSetMockView from './FieldSetMockView';
import FieldSet from '../../../../src/ui/form/FieldSet';
import {FormWrapper, getElementByClassName, render} from '../../../helpers';
import InputField from '../InputField/InputFieldMockView';

describe('FieldSet tests', () => {
    const props = {
        view: FieldSetMockView,
        className: 'class-test',
        fields: [
            {
                attribute: 'name',
                component: InputField,
                label: 'Name',
            },
        ],
        label: 'label-test',
        children: 'children-test',
    };

    const expectedFieldSetClass = 'FieldSetView';

    it('should be in the document', () => {
        const {container} = render(FormWrapper(FieldSet, props));
        const fieldSet = getElementByClassName(container, expectedFieldSetClass);
        expect(fieldSet).toBeInTheDocument();
    });

    it('should have correct text content', () => {
        const {container} = render(FormWrapper(FieldSet, props));
        const legend = getElementByClassName(container, `${expectedFieldSetClass}__legend`);
        expect(legend).toHaveTextContent(props.label);
    });

    it('should have className in fieldset', () => {
        const {container} = render(FormWrapper(FieldSet, props));
        const fieldset = getElementByClassName(container, expectedFieldSetClass);
        expect(fieldset).toHaveClass(props.className);
    });

    it('should have children', () => {
        const {container} = render(FormWrapper(FieldSet, props));
        const fieldset = getElementByClassName(container, expectedFieldSetClass);
        expect(fieldset).toHaveTextContent(props.children);
    });
});
