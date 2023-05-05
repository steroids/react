import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {IBemHocInput} from '../../../../src/hoc/bem';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import SwitcherField, {ISwitcherFieldProps} from '../../../../src/ui/form/SwitcherField/SwitcherField';
import SwitcherFieldMockView from './SwitcherFieldMockView';

describe('SwitcherField tests', () => {
    const expectedSwitcherFieldClassName = 'SwitcherFieldView';
    const externalClassName = 'test-class';

    const externalStyles = {
        width: '30px',
    };

    const itemWithDefaultLabel = {
        id: 1,
        label: 'First',
    };

    const itemWithObjectLabel = {
        id: 2,
        label: {
            checked: 'checkedLabel',
            unchecked: 'uncheckedLabel',
        },
    };

    const items = [
        itemWithDefaultLabel, itemWithObjectLabel,
    ];

    const props: ISwitcherFieldProps & IBemHocInput = {
        view: SwitcherFieldMockView,
        className: externalClassName,
        style: externalStyles,
        items,
        size: 'lg',

        inputProps: {
            name: 'switcher-test',
            type: 'checkbox',
            checked: false,
            onChange: () => { },
            disabled: false,
        },
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

    it('should have items', () => {
        const {container} = render(JSXWrapper(SwitcherField, props));
        const switcherItems = container.querySelectorAll(`.${expectedSwitcherFieldClassName}__switcher`);
        expect(switcherItems.length).toBe(items.length);
    });

    it('items should have correct size', () => {
        const {container} = render(JSXWrapper(SwitcherField, props));
        const switcherItems = container.querySelectorAll(`.${expectedSwitcherFieldClassName}__switcher_size_${props.size}`);
        expect(switcherItems.length).toBe(items.length);
    });

    it('should item with object label change label after click', () => {
        const {container, getByText} = render(JSXWrapper(SwitcherField, {
            ...props,
            items: [itemWithObjectLabel],
        }));

        const switcherItemInput = getElementByClassName(container, `${expectedSwitcherFieldClassName}__input`);
        fireEvent.click(switcherItemInput);

        const switcherItemWithChangedText = getByText(itemWithObjectLabel.label.checked);
        expect(switcherItemWithChangedText).toBeInTheDocument();
    });
});
