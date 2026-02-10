import '@testing-library/jest-dom';
import BreadcrumbsMockView from './BreadcrumbsMockView';
import Breadcrumbs from '../../../../src/ui/nav/Breadcrumbs/Breadcrumbs';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('Breadcrumbs tests', () => {
    const props = {
        view: BreadcrumbsMockView,
    };

    const title1 = 'Home';
    const title2 = 'Frontend React';
    const title3 = 'Ui';

    const items = [
        {
            id: 'root',
            title: title1,
        },
        {
            id: 'react',
            title: title2,
        },
        {
            id: 'ui',
            title: title3,
        },
    ];

    const expectedBreadcrumbsClass = 'BreadcrumbsView';

    it('should be in the document and have class', () => {
        const {container} = render(JSXWrapper(Breadcrumbs, props));
        const breadcrumbs = getElementByClassName(container, expectedBreadcrumbsClass);

        expect(breadcrumbs).toBeInTheDocument();
    });

    it('should be in the document and have icon', () => {
        const showIcon = true;
        const {container} = render(JSXWrapper(Breadcrumbs, {
            ...props,
            showIcon,
            items,
        }));
        const iconView = getElementByClassName(container, 'IconView');

        expect(iconView).toBeInTheDocument();
    });

    it('should be correct rendering of items', () => {
        const {getByText} = render(JSXWrapper(Breadcrumbs, {
            ...props,
            items,
        }));

        items.forEach(item => expect(getByText(item.title)).toBeInTheDocument());
    });

    it('should be correct rendering of items and replacing the last title', () => {
        const pageTitle = 'Custom text';
        const {getByText, queryByText} = render(JSXWrapper(Breadcrumbs, {
            ...props,
            items,
            pageTitle,
        }));

        const expectedTitles = [
            getByText(title1),
            getByText(title2),
            getByText(pageTitle),
        ];

        const notExistTitle = queryByText(title3);

        expectedTitles.forEach(expectedTitle => expect(expectedTitle).toBeInTheDocument());
        expect(notExistTitle).not.toBeInTheDocument();
    });
});
