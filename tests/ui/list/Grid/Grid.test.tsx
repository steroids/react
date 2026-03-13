import '@testing-library/jest-dom';
import {waitFor} from '@testing-library/react';

import CheckboxColumnMockView from './CheckboxColumnMockView';
import ContentColumnMockView from './ContentColumnMockView';
import DiagramColumnMockView from './DiagramColumnMockView';
import GridMockView from './GridMockView';
import InputField from '../../../../src/ui/form/InputField/InputField';
import Grid, {IGridProps} from '../../../../src/ui/list/Grid/Grid';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

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
            valueView: CheckboxColumnMockView,
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

    it('should have other props', async () => {
        const paginationItems = [
            {
                id: 1,
                name: 'Max',
            },
            {
                id: 2,
                name: 'Eva',
            },
            {
                id: 3,
                name: 'Sam',
            },
        ];

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

        const {container, getByText, rerender} = render(JSXWrapper(Grid, {
            ...props,
            listId: 'test8',
            columns,
            items: paginationItems,
            itemsIndexing: true,
            searchForm,
            pagination: true,
            paginationSize: {
                enable: false,
                defaultValue: 2,
                sizes: [1, 2, 3],
            },
        }));

        const indexingHead = getByText('№');
        const searchFormElement = getElementByClassName(container, 'InputFieldView');

        expect(indexingHead).toBeInTheDocument();
        expect(searchFormElement).toBeInTheDocument();

        await waitFor(() => {
            const pagination = getElementByClassName(container, 'PaginationButtonView');
            expect(pagination).toBeInTheDocument();
        });
    });

    describe('should be diagram column', () => {
        const expectedDiagramColumnClassName = 'DiagramColumnView';

        it('should be horizontal diagrams', () => {
            const horizontalItems = [
                {
                    id: 1,
                    percentage: 50,
                },
                {
                    id: 2,
                    percentage: 30,
                },
            ];
            const horizontalColumns = [
                {
                    label: 'Horizontal',
                    valueView: 'DiagramColumnView',
                    diagram: {
                        type: 'horizontal',
                        items: [
                            {
                                color: 'secondary',
                                percentageAttribute: 'percentage',
                            },
                        ],
                    },
                },
            ];

            const {container} = render(JSXWrapper(Grid, {
                ...props,
                items: horizontalItems,
                columns: horizontalColumns,
                valueView: DiagramColumnMockView,
                listId: 'test9',
            }));

            const diagrams = container.querySelectorAll(`.${expectedDiagramColumnClassName}`);

            expect(diagrams.length).toBe(horizontalItems.length);
            diagrams.forEach((diagram) => {
                expect(diagram).toHaveClass(`${expectedDiagramColumnClassName}_type_horizontal`);
            });
        });

        it('should be vertical diagrams', () => {
            const verticalItems = [
                {
                    id: 1,
                    health: 25,
                    hunger: 35,
                    damage: 45,
                    mana: 55,
                },
                {
                    id: 2,
                    health: 25,
                    hunger: 35,
                    damage: 45,
                    mana: 55,
                },
            ];

            const verticalColumns = [
                {
                    label: 'Vertical',
                    valueView: 'DiagramColumnView',
                    diagram: {
                        type: 'vertical',
                        items: [
                            {
                                color: 'success',
                                percentageAttribute: 'health',
                            },
                            {
                                color: 'warning',
                                percentageAttribute: 'hunger',
                            },
                            {
                                color: 'danger',
                                percentageAttribute: 'damage',
                            },
                            {
                                color: 'secondary',
                                percentageAttribute: 'mana',
                            },
                        ],
                    },
                },
            ];

            const {container} = render(JSXWrapper(Grid, {
                ...props,
                items: verticalItems,
                columns: verticalColumns,
                valueView: DiagramColumnMockView,
                listId: 'test10',
            }));

            const diagrams = container.querySelectorAll(`.${expectedDiagramColumnClassName}`);

            expect(diagrams.length).toBe(verticalItems.length);
            diagrams.forEach((diagram) => {
                expect(diagram).toHaveClass(`${expectedDiagramColumnClassName}_type_vertical`);
            });
        });

        it('should be circle diagrams', () => {
            const circleItems = [
                {
                    id: 1,
                    name: 'John',
                    health: 25,
                    hunger: 35,
                    damage: 45,
                    mana: 55,
                },
                {
                    id: 2,
                    name: 'John',
                    health: 25,
                    hunger: 35,
                    damage: 45,
                    mana: 55,
                },
            ];

            const circleColumns = [
                {
                    label: 'Circle with subtitle',
                    valueView: 'DiagramColumnView',
                    diagram: {
                        type: 'circle',
                        items: [
                            {
                                color: 'success',
                                percentageAttribute: 'health',
                            },
                            {
                                color: 'warning',
                                percentageAttribute: 'hunger',
                            },
                            {
                                color: 'danger',
                                percentageAttribute: 'damage',
                            },
                            {
                                color: 'secondary',
                                percentageAttribute: 'mana',
                            },
                        ],
                    },
                    subtitleAttribute: 'name',
                },
            ];

            const {container} = render(JSXWrapper(Grid, {
                ...props,
                listId: 'test11',
                items: circleItems,
                columns: circleColumns,
                valueView: DiagramColumnMockView,
            }));

            const diagrams = container.querySelectorAll(`.${expectedDiagramColumnClassName}`);

            expect(diagrams.length).toBe(circleItems.length);
            diagrams.forEach((diagram) => {
                expect(diagram).toHaveClass(`${expectedDiagramColumnClassName}_type_circle`);
            });
        });
    });
});
