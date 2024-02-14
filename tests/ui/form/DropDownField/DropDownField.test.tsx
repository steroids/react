import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import DropDownField, {IDropDownFieldViewProps} from '../../../../src/ui/form/DropDownField/DropDownField';
import DropDownFieldMockView from './DropDownFieldMockView';

describe('DropDownField tests', () => {
    const defaultItemToSelectAllLabel = 'Все';

    const items = [
        {
            id: 1,
            label: 'First',
            items: [{
                id: 22,
                label: 'InnerItem',
            }],
        },
        {
            id: 2,
            label: 'Second',
        },
    ];

    const props = {
        color: 'warning',
        size: 'lg',
        placeholder: 'placeholder',
        multiple: true,
        showReset: true,
        itemsContent: {
            type: 'checkbox',
        },
        groupAttribute: 'items',
        items,
        view: DropDownFieldMockView,
    } as IDropDownFieldViewProps;

    const expectedDropDownFieldClassName = 'DropDownFieldView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(DropDownField, props));
        const component = getElementByClassName(container, expectedDropDownFieldClassName);
        expect(component).toBeInTheDocument();
    });

    it('should have placeholder', () => {
        const {getByText} = render(JSXWrapper(DropDownField, props));
        const placeholderText = getByText(String(props.placeholder));
        expect(placeholderText).toBeInTheDocument();
    });

    it('should have items with correct type', () => {
        const {container} = render(JSXWrapper(DropDownField, props));

        const dropDownTriggerElement = getElementByClassName(container, `${expectedDropDownFieldClassName}__selected-items`);

        fireEvent.click(dropDownTriggerElement);

        const inputs = container.querySelectorAll('input');

        inputs.forEach(input => expect(input.type).toBe('checkbox'));
    });

    it('should have correct color and size', () => {
        const {container} = render(JSXWrapper(DropDownField, props));
        const component = getElementByClassName(container, `${expectedDropDownFieldClassName}`);
        expect(component).toHaveClass(`${expectedDropDownFieldClassName}_size_lg`);
        expect(component).toHaveClass(`${expectedDropDownFieldClassName}_warning`);
    });

    it('should have selected items after select options', () => {
        const {container, getByText} = render(JSXWrapper(DropDownField, props));
        const totalItemClicksCount = 2;
        const dropDownTriggerElement = getElementByClassName(container, `${expectedDropDownFieldClassName}__selected-items`);

        fireEvent.click(dropDownTriggerElement);
        fireEvent.click(getByText('InnerItem'));
        fireEvent.click(getByText('Second'));

        const itemsCounter = getByText(`Выбрано (${totalItemClicksCount})`);

        expect(itemsCounter).toBeInTheDocument();
    });

    it('should have autoComplete with placeholder', () => {
        const searchPlaceholder = 'search';
        const {container} = render(JSXWrapper(DropDownField, {
            ...props,
            autoComplete: true,
            searchPlaceholder,
        }));

        const dropDownTriggerElement = getElementByClassName(container, `${expectedDropDownFieldClassName}__selected-items`);

        fireEvent.click(dropDownTriggerElement);

        const search = getElementByClassName(container, `${expectedDropDownFieldClassName}__search`);
        const searchInput = getElementByClassName(container, `${expectedDropDownFieldClassName}__search-input`) as HTMLInputElement;

        expect(search).toBeInTheDocument();
        expect(searchInput).toBeInTheDocument();
        expect(searchInput.placeholder).toBe(searchPlaceholder);
    });

    it('should have group', () => {
        const {container} = render(JSXWrapper(DropDownField, props));
        const dropDownTriggerElement = getElementByClassName(container, `${expectedDropDownFieldClassName}__selected-items`);

        fireEvent.click(dropDownTriggerElement);
        const group = getElementByClassName(container, 'DropDownItemView__group');

        expect(group).toBeInTheDocument();
    });

    it('should have all item', () => {
        const {container, getByText} = render(JSXWrapper(DropDownField, {
            ...props,
            itemToSelectAll: true,
        }));

        const dropDownTriggerElement = getElementByClassName(container, `${expectedDropDownFieldClassName}__selected-items`);

        fireEvent.click(dropDownTriggerElement);

        expect(getByText(defaultItemToSelectAllLabel)).toBeInTheDocument();
    });

    it('should have custom all item', () => {
        const customAllLabel = 'custom all';

        const {container, getByText} = render(JSXWrapper(DropDownField, {
            ...props,
            itemToSelectAll: {
                id: 'all',
                label: customAllLabel,
            },
        }));

        const dropDownTriggerElement = getElementByClassName(container, `${expectedDropDownFieldClassName}__selected-items`);

        fireEvent.click(dropDownTriggerElement);
        expect(getByText(customAllLabel)).toBeInTheDocument();
    });

    it('should clear selected items on button click', async () => {
        const expectedSelectedItemLabel = items[0].label;

        const {container, getByText} = render(JSXWrapper(DropDownField, {
            ...props,
            selectedIds: [items[0].id],
        }));

        expect(getByText(expectedSelectedItemLabel)).toBeInTheDocument();

        const dropDownResetElement = getElementByClassName(container, `${expectedDropDownFieldClassName}__icon-close`);

        fireEvent.click(dropDownResetElement);

        expect(getByText(props.placeholder)).toBeInTheDocument();
    });
});
