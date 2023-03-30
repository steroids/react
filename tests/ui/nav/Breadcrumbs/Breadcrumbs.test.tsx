import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import {getElementByClassName, JSXWrapper} from '../../../helpers';
import Breadcrumbs from '../../../../src/ui/nav/Breadcrumbs/Breadcrumbs';
import BreadcrumbsMockView from './BreadcrumbsMockView';

describe('Breadcrumbs tests', () => {
    const props = {
        view: BreadcrumbsMockView,
    };

    const expectedBreadcrumbsClass = 'BreadcrumbsView';

    it('should be in the document and have a class', () => {
        const {container} = render(JSXWrapper(Breadcrumbs, props));
        const breadcrumbs = getElementByClassName(container, expectedBreadcrumbsClass);

        expect(breadcrumbs).toBeInTheDocument();
    });

    it('should be correct rendering of items', () => {
        const items = [
            {id: 'root', title: 'Home'},
            {id: 'react', title: 'Frontend React'},
            {id: 'ui', title: 'Ui'},
        ];
        const {container, getByText} = render(JSXWrapper(Breadcrumbs, {
            ...props,
            items,
        }));

        items.forEach(item => expect(getByText(item.title)).toBeInTheDocument());
    });

    it('should be correct rendering of items and replacing the last title', () => {
        const items = [
            {id: 'root', title: 'Home'},
            {id: 'react', title: 'Frontend React'},
            {id: 'ui', title: 'Ui'},
        ];
        const pageTitle = 'Custom text';
        const {getByText, queryByText} = render(JSXWrapper(Breadcrumbs, {
            ...props,
            items,
            pageTitle,
        }));
        const titleOne = getByText('Home');
        const titleTwo = getByText('Frontend React');
        const titleThree = queryByText('Ui');
        const titleReplace = getByText(pageTitle);

        expect(titleOne).toBeInTheDocument();
        expect(titleTwo).toBeInTheDocument();
        expect(titleThree).not.toBeInTheDocument();
        expect(titleReplace).toBeInTheDocument();
    });
});
