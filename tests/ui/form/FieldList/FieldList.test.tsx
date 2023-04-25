import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {render} from '../../../customRender';
import {JSXWrapper, getElementByClassName} from '../../../helpers';
import FieldListMockView from './FieldListMockView';
import FieldListItemMockView from './FieldListItemMockView';
import FieldList from '../../../../src/ui/form/FieldList/FieldList';
import {InputField} from '../../../../src/ui/form';

describe('FieldList tests', () => {
    const titleColum = 'Test title';

    const props = {
        view: FieldListMockView,
        itemView: FieldListItemMockView,
        attribute: 'items',
        className: 'class-test',
        tableClassName: 'table-class-test',
        items: [
            {
                title: titleColum,
                attribute: 'name',
                component: InputField,
                placeholder: 'Test placeholder',
            },
        ],
    };

    const expectedFieldListClass = 'FieldListView';
    const expectedFieldListItemClass = 'FieldListItemView';

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(FieldList, props, false, true));
        const fieldList = getElementByClassName(container, expectedFieldListClass);
        expect(fieldList).toBeInTheDocument();
    });

    it('should have className and tableClassName', () => {
        const {container} = render(JSXWrapper(FieldList, props, false, true));
        const className = getElementByClassName(container, props.className);
        const tableClassName = getElementByClassName(container, props.tableClassName);
        expect(className).toBeInTheDocument();
        expect(tableClassName).toBeInTheDocument();
    });

    it('should have correct item', () => {
        const {container} = render(JSXWrapper(FieldList, props, false, true));
        const item = getElementByClassName(container, expectedFieldListItemClass);
        expect(item).toBeInTheDocument();
    });

    it('should have correct title in column', () => {
        const {getByText} = render(JSXWrapper(FieldList, props, false, true));
        const title = getByText(titleColum);
        expect(title).toBeInTheDocument();
    });

    it('should have button add/remove', () => {
        const showRemove = true;
        const showAdd = true;
        const {container} = render(JSXWrapper(FieldList, {...props, showRemove, showAdd}, false, true));
        const buttonRemove = getElementByClassName(container, `${expectedFieldListItemClass}__remove`);
        const buttonAdd = getElementByClassName(container, `${expectedFieldListClass}__button-add`);
        expect(buttonAdd).toBeInTheDocument();
        expect(buttonRemove).toBeInTheDocument();
    });

    it('should delete item', () => {
        const {container} = render(JSXWrapper(FieldList, props, false, true));
        const buttonRemove = getElementByClassName(container, `${expectedFieldListItemClass}__remove`);
        const item = getElementByClassName(container, expectedFieldListItemClass);

        expect(item).toBeInTheDocument();
        fireEvent.click(buttonRemove);
        const countItems = container.querySelectorAll(`.${expectedFieldListItemClass}`).length;
        expect(countItems).toBe(props.items.length - 1);
    });

    it('should add item', () => {
        const {container} = render(JSXWrapper(FieldList, props, false, true));
        const buttonAdd = getElementByClassName(container, `${expectedFieldListClass}__button-add`);
        const item = getElementByClassName(container, expectedFieldListItemClass);

        expect(item).toBeInTheDocument();
        fireEvent.click(buttonAdd);
        const countItems = container.querySelectorAll(`.${expectedFieldListItemClass}`).length;
        expect(countItems).toBe(props.items.length + 1);
    });

    it('should have class hasAlternatingColors', () => {
        const hasAlternatingColors = true;
        const {container} = render(JSXWrapper(FieldList, {...props, hasAlternatingColors}, false, true));
        const fieldList = getElementByClassName(container, expectedFieldListClass);
        expect(fieldList).toHaveClass(`${expectedFieldListClass}_hasAlternatingColors`);
    });
});
