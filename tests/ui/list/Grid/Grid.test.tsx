import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Grid, {IGridProps} from '../../../../src/ui/list/Grid/Grid';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import GridMockView from './GridMockView';
import CheckboxColumnView from '../../../../src/ui/list/CheckboxColumn/CheckboxColumn';
import ContentColumnMockView from './ContentColumnMockView';
import InputField from '../../../../src/ui/form/InputField/InputField';

describe('Grid tests', () => {
    const expectedGridClass = 'GridView';
    const expectedContentColumnClass = 'ContentColumnView';
    const expectedColumnsCount = 1;

    const item = {
        id: 1,
        name: 'Ivan',
        secondName: 'Ivanov',
        icon: 'mockIcon',
        url: 'https://kozhindev.com',
        pic: 'https://i.ibb.co/ZSSgW75/image-9.jpg',
    };

    const items = [
        item,
    ];

    const props = {
        items,
        view: GridMockView,
        hasAlternatingColors: true,
        size: 'md',

    } as IGridProps;

    it('should be in the document', () => {
        const columns = [{
            label: 'Name',
            attribute: 'name',
        }];

        const {container} = render(JSXWrapper(Grid, {
            ...props,
            columns,
            listId: 'test1',
        }));

        const grid = getElementByClassName(container, expectedGridClass);
        const columnElements = container.querySelectorAll(`.${expectedGridClass}__column`);

        expect(grid).toBeInTheDocument();
        expect(columnElements.length).toBe(expectedColumnsCount);
    });

    it('should have correct classes', () => {
        const columns = [{
            label: 'Name',
            attribute: 'name',
        }];

        const {container} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test2',
            columns,
        }));

        const gridSize = getElementByClassName(container, `${expectedGridClass}_size_md`);
        const alternatingColors = getElementByClassName(container, `${expectedGridClass}_alternatingColors`);

        expect(gridSize).toBeInTheDocument();
        expect(alternatingColors).toBeInTheDocument();
    });

    it('should be checkbox column', () => {
        const columns = [{
            label: 'Checkbox',
            attribute: 'name',
            valueView: CheckboxColumnView,
        }];

        const {container} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test3',
            columns,
        }));

        const expectedCheckboxFieldClass = 'CheckboxFieldView';
        const checkboxField = getElementByClassName(container, expectedCheckboxFieldClass);
        expect(checkboxField).toBeInTheDocument();
    });

    it('should be icon column', () => {
        const columns = [{
            label: 'Icon',
            icon: {
                attribute: 'icon',
                isLeft: true,
            },
            valueView: ContentColumnMockView,
        }];

        const {container} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test4',
            columns,
        }));

        const iconColumns = container.querySelectorAll(`.${expectedContentColumnClass}__icon`);

        expect(iconColumns.length).toBe(expectedColumnsCount);
    });

    it('should be link column', () => {
        const columns = [{
            label: 'Link',
            link: {
                attribute: 'name',
                urlAttribute: 'url',
            },
            valueView: ContentColumnMockView,
        }];

        const {container} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test5',
            columns,
        }));

        const linkColumn = getElementByClassName(container, `${expectedContentColumnClass}__link`);

        expect(linkColumn).toBeInTheDocument();
        expect(linkColumn).toHaveAttribute('href', item.url);
    });

    it('should be subtitle column', () => {
        const columns = [{
            label: 'Subtitle',
            attribute: 'name',
            subtitleAttribute: 'secondName',
            valueView: ContentColumnMockView,
        }];

        const {container} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test6',
            columns,
        }));

        const columnValue = getElementByClassName(container, `${expectedContentColumnClass}__value`);
        const columnSubtitle = getElementByClassName(container, `${expectedContentColumnClass}__subtitle`);

        expect(columnValue).toBeInTheDocument();
        expect(columnSubtitle).toBeInTheDocument();
    });

    it('should be picture column', () => {
        const columns = [{
            label: 'With picture left',
            attribute: 'name',
            picture: {
                attribute: 'pic',
                isLeft: true,
            },
            valueView: ContentColumnMockView,
        }];

        const {container} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test7',
            columns,
        }));

        const pictureColumn = getElementByClassName(container, `${expectedContentColumnClass}__picture`);
        const isLeftContent = getElementByClassName(container, `${expectedContentColumnClass}_isLeft`);

        expect(pictureColumn).toBeInTheDocument();
        expect(isLeftContent).toBeInTheDocument();
    });

    it('should have other props', () => {
        const columns = [{
            attribute: 'name',
        }];

        const searchForm = {
            layout: 'table',
            fields: [
                {
                    label: 'Name',
                    attribute: 'name',
                    component: InputField,
                },
            ],
        };

        const {container, getByText} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test8',
            columns,
            itemsIndexing: true,
            searchForm,
            pagination: true,
        }));

        const indexingHead = getByText('№');
        const searchFormElement = getElementByClassName(container, 'InputFieldView');
        const pagination = getElementByClassName(container, 'PaginationButtonView');

        expect(indexingHead).toBeInTheDocument();
        expect(searchFormElement).toBeInTheDocument();
        expect(pagination).toBeInTheDocument();
    });
});
