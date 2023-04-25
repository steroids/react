import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import FieldSet from '../../../../src/ui/form/FieldSet';
import FieldSetMockView from './FieldSetMockView';
import InputField from '../InputField/InputFieldMockView';

describe('FieldSet tests', () => {
    const props = {
        view: FieldSetMockView,
        fields: [
            {
                attribute: 'name',
                component: InputField,
                label: 'Name',
            },
        ],
        label: 'Label',
    };

    const expectedFieldSetClass = 'FieldSetView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(FieldSet, props));
        const fieldSet = getElementByClassName(container, expectedFieldSetClass);
        screen.debug();
        expect(fieldSet).toBeInTheDocument();
    });
});
