import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';
import SwitcherField from '../../../../src/ui/form/SwitcherField/SwitcherField';
import SwitcherFieldMockView from './SwitcherFieldMockView';

describe('SwitcherField tests', () => {
    const expectedSwitcherFieldClassName = 'SwitcherFieldView';
    const externalClassName = 'test-class';

    const externalStyles = {
        width: '30px',
    };

    const itemWithObjectLabel = {
        id: 2,
        label: {
            checked: 'checkedLabel',
            unchecked: 'uncheckedLabel',
        },
    };

    const props = {
        view: SwitcherFieldMockView,
        className: externalClassName,
        style: externalStyles,
        size: 'lg',
    };

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(SwitcherField, props));
        const switcherField = getElementByClassName(container, expectedSwitcherFieldClassName);
        expect(switcherField).toBeInTheDocument();
    });

    it('should have external className and styles', () => {
        const {container} = render(JSXWrapper(SwitcherField, props));
        const switcherField = getElementByClassName(container, expectedSwitcherFieldClassName);

        expect(switcherField).toHaveClass(externalClassName);
        expect(switcherField).toHaveStyle(externalStyles);
    });

    it('should item with object label change label after click', () => {
        const {container, getByText} = render(JSXWrapper(SwitcherField, {
            ...props,
            label: {
                checked: 'checkedLabel',
                unchecked: 'uncheckedLabel',
            },
        }));

        const switcherItemWithUncheckedLabel = getByText(itemWithObjectLabel.label.unchecked);
        expect(switcherItemWithUncheckedLabel).toBeInTheDocument();

        const switcherItemInput = getElementByTag(container, 'input');
        fireEvent.click(switcherItemInput);

        const switcherItemWithCheckedLabel = getByText(itemWithObjectLabel.label.checked);
        expect(switcherItemWithCheckedLabel).toBeInTheDocument();
    });
});
