import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import CheckboxListField, {ICheckboxListFieldProps} from '../../../../src/ui/form/CheckboxListField/CheckboxListField';
import {getElementByClassName, JSXWrapper} from '../../../helpers';

describe('CheckboxListField tests', () => {
    const expectedCheckboxListFieldClass = 'CheckboxListFieldView';

    const items = [
        {
            id: 1,
            label: 'item1',
        },
        {
            id: 2,
            label: 'item2',
        },
        {
            id: 3,
            label: 'item3',
        }];

    const props: ICheckboxListFieldProps = {
        items,
        orientation: 'horizontal',
        size: 'large',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(CheckboxListField, props));
        const checkboxListField = getElementByClassName(container, expectedCheckboxListFieldClass);
        expect(checkboxListField).toBeInTheDocument();
    });
});
