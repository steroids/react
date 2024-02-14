import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/react';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';
import GridMockView from '../Grid/GridMockView';
import TreeColumnView from './TreeColumnMockView';
import {addTreeColumnFieldsToFirstColumn, ITreeTableProps} from '../../../../src/ui/list/TreeTable/TreeTable';
import TreeTableMock from './TreeTableMock';

describe('addTreeColumnFieldsToFirstColumn function', () => {
    it('should add tree column fields to first column', () => {
        const columns = [
            {
                label: 'Name',
                attribute: 'name',
            },
            {
                label: 'Surname',
                attribute: 'surname',
            },
        ];

        const levelPadding = 32;

        const expectedColumns = [
            {
                label: 'Name',
                attribute: 'name',
                valueView: 'TreeColumnView',
                headerClassName: 'TreeColumnHeader',
                levelPadding,
            },
            {
                label: 'Surname',
                attribute: 'surname',
            },
        ];

        const result = addTreeColumnFieldsToFirstColumn(columns, levelPadding);

        expect(result).toEqual(expectedColumns);
    });
});

JSON.parse = jest.fn().mockImplementationOnce(() => ({}));

describe('TreeTable tests', () => {
    const expectedTreeColumnViewClass = 'TreeItemView';
    const expectedTreeColumnHeaderClass = 'TreeColumnHeader';
    const expectedToggleItemName = 'Jane';
    const tagImg = 'img';

    const columns = [
        {
            label: 'Name',
            attribute: 'name',
            valueView: TreeColumnView,
        },
        {
            label: 'Surname',
            attribute: 'surname',
        },
    ];

    const items = [
        {
            id: 1,
            name: 'Ivan',
            surname: 'Ivanov',
            items: [{
                id: 3,
                name: 'Jane',
                surname: 'Doer',
            }],
        },
        {
            id: 2,
            name: 'John',
            surname: 'Doe',
        },
    ];

    const props = {
        items,
        view: GridMockView,
        listId: 'TreeTable',
        hasAlternatingColors: true,
        size: 'md',
        levelPadding: 32,
        alwaysOpened: false,
        saveInClientStorage: false,
    } as ITreeTableProps;

    it('should add tree view to the first column', () => {
        const expectedTreeColumnsCount = items.length;

        const {container} = render(JSXWrapper(TreeTableMock, {
            ...props,
            columns,
        }));

        const treeColumnHeaderClass = getElementByClassName(container, expectedTreeColumnHeaderClass);
        expect(treeColumnHeaderClass).toBeInTheDocument();

        const treeColumnClass = getElementByClassName(container, expectedTreeColumnViewClass);
        expect(treeColumnClass).toBeInTheDocument();

        const treeColumnElements = container.querySelectorAll(`.${expectedTreeColumnViewClass}`);
        expect(treeColumnElements.length).toBe(expectedTreeColumnsCount);
    });

    it('should be in the document', () => {
        const expectedTreeColumnsCount = items.length;

        const {container} = render(JSXWrapper(TreeTableMock, {
            ...props,
            columns,
        }));

        const treeColumnClass = getElementByClassName(container, expectedTreeColumnViewClass);
        expect(treeColumnClass).toBeInTheDocument();

        const treeColumnElements = container.querySelectorAll(`.${expectedTreeColumnViewClass}`);
        expect(treeColumnElements.length).toBe(expectedTreeColumnsCount);
    });

    it('should have correct classes', () => {
        const {container, getByRole} = render(JSXWrapper(TreeTableMock, {
            ...props,
            columns,
        }));

        //const role = getByRole('');

        //const treeColumnSize = getElementByClassName(container, `${expectedTreeColumnViewClass}_size_md`);
        const treeColumnIcon = getElementByClassName(container, `${expectedTreeColumnViewClass}__icon`);
        const treeColumnItem = getElementByClassName(container, `${expectedTreeColumnViewClass}__item`);

        //expect(treeColumnSize).toBeInTheDocument();
        expect(treeColumnIcon).toBeInTheDocument();
        expect(treeColumnItem).toBeInTheDocument();
    });

    it('should show nested items by click', async () => {
        const {container, queryByText} = render(JSXWrapper(TreeTableMock, {
            ...props,
            columns,
        }));

        expect(queryByText(expectedToggleItemName)).not.toBeInTheDocument();

        const iconButton = getElementByTag(container, tagImg);

        fireEvent.click(iconButton);

        expect(queryByText(expectedToggleItemName)).toBeInTheDocument();
    });

    it('should hide nested items by click', async () => {
        const {container, queryByText} = render(JSXWrapper(TreeTableMock, {
            ...props,
            columns,
        }));

        const iconButton = getElementByTag(container, tagImg);

        fireEvent.click(iconButton);

        expect(queryByText(expectedToggleItemName)).toBeInTheDocument();

        fireEvent.click(iconButton);

        expect(queryByText(expectedToggleItemName)).not.toBeInTheDocument();
    });
});
