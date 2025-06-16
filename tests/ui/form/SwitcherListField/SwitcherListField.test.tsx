import '@testing-library/jest-dom';
import {ICheckboxListFieldProps} from '../../../../src/ui/form/CheckboxListField/CheckboxListField';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import SwitcherFieldMockView from '../SwitcherField/SwitcherFieldMockView';
import SwitcherListField from '../../../../src/ui/form/SwitcherListField/SwitcherListField';
import SwitcherListFieldMockView from './SwitcherListFieldMockView';

describe('SwitcherListField tests', () => {
    const expectedSwitcherListFieldClass = 'SwitcherListFieldView';

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
        view: SwitcherListFieldMockView,
        itemView: SwitcherFieldMockView,
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(SwitcherListField, props));
        const switcherListField = getElementByClassName(container, expectedSwitcherListFieldClass);
        expect(switcherListField).toBeInTheDocument();
    });

    it('should render inputs', () => {
        const {container} = render(JSXWrapper(SwitcherListField, props));
        const inputs = container.querySelectorAll('input');
        expect(inputs).toHaveLength(items.length);
    });
});
