import '@testing-library/jest-dom';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';
import Dashboard from '../../../../src/ui/content/Dashboard';
import Grid from '../../../../src/ui/list/Grid';
import GridMockView from '../../list/Grid/GridMockView';

const gridItems = [
    {
        id: 1,
        minimum: '2022',
        peak: '2020',
        technology: 'NW.js',
    },
    {
        id: 2,
        minimum: '2022',
        peak: '2016',
        technology: 'Cordova',
    },
    {
        id: 3,
        minimum: '2022',
        peak: '2017',
        technology: 'Ionic',
    },
];

const columns = [
    {
        label: 'Technology',
        attribute: 'technology',
    },
    {
        label: 'Minimum',
        attribute: 'minimum',
    },
    {
        label: 'Peak',
        attribute: 'peak',
    },
];

const items = [
    {
        title: 'Grid Table',
        iconName: 'mockIcon',
        content: <Grid
            listId='GridInDashboard'
            items={gridItems}
            columns={columns}
            view={GridMockView}
        />,
        col: 12,
    },
    {
        title: 'Data',
        content: <div>Another data description</div>,
        col: 12,
    },
];

describe('Dashboard tests', () => {
    const expectedDashboardWrapperClass = 'FlexGridView';
    const expectedDashboardItemClass = 'DashboardItemView';

    const props = {
        items,
        gap: 16,
        wrap: true,
    };

    it('should render Dashboard', () => {
        const {container} = render(JSXWrapper(Dashboard, props));

        const dashboard = getElementByClassName(container, expectedDashboardWrapperClass);
        const dashboardItem = getElementByClassName(container, expectedDashboardItemClass);

        expect(dashboard).toBeInTheDocument();
        expect(dashboardItem).toBeInTheDocument();
    });

    it('should render dashboard cards', () => {
        const {container} = render(JSXWrapper(Dashboard, props));

        const dashboardElements = container.querySelectorAll(`.${expectedDashboardItemClass}`);

        expect(dashboardElements.length).toEqual(items.length);
    });

    it('should render dashboard card title', () => {
        const firstDashboardItem = items[0];

        const {queryByText} = render(JSXWrapper(Dashboard, props));

        expect(queryByText(firstDashboardItem.title)).toBeInTheDocument();
    });

    it('should render dashboard icon for title', () => {
        const expectedTitleIconClassName = 'IconView';
        const expectedRole = 'img';

        const {getByRole} = render(JSXWrapper(Dashboard, props));

        const titleIcon = getByRole(expectedRole);

        expect(titleIcon.className).toEqual(expectedTitleIconClassName);
    });
});
