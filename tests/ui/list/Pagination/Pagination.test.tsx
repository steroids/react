import '@testing-library/jest-dom';
import PaginationButtonMockView from './PaginationButtonMockView';
import PaginationMoreMockView from './PaginationMoreMockView';
import Pagination, {IPaginationProps} from '../../../../src/ui/list/Pagination/Pagination';
import {getElementByClassName, JSXWrapper, render} from '../../../helpers';

describe('Pagination tests', () => {
    const props = {
        list: {
            total: 100,
            page: 1,
            pageSize: 10,
        },
        aroundCount: 5,
        view: PaginationButtonMockView,
    } as IPaginationProps;

    const expectedPaginationMoreClass = 'PaginationMoreView';
    const expectedPaginationButtonClass = 'PaginationButtonView';

    it('default should be in the document', () => {
        const {container} = render(JSXWrapper(Pagination, props));
        const component = getElementByClassName(container, expectedPaginationButtonClass);
        expect(component).toBeInTheDocument();
    });

    it('more button should be in the document', () => {
        const {container} = render(JSXWrapper(Pagination, {
            ...props,
            loadMore: true,
            view: PaginationMoreMockView,
        }));

        const component = getElementByClassName(container, expectedPaginationMoreClass);
        expect(component).toBeInTheDocument();
    });

    it('should be ellipsis in the document', () => {
        const {getByText} = render(JSXWrapper(Pagination, props));
        const ellipsis = getByText('...');
        expect(ellipsis).toBeInTheDocument();
    });

    it('should have buttons', () => {
        const {container} = render(JSXWrapper(Pagination, props));

        const expectedPagesCount = 7;
        const pages = container.querySelectorAll(`.${expectedPaginationButtonClass}__page`);
        expect(pages.length).toBe(expectedPagesCount);
    });

    it('should have steps buttons', () => {
        const {container} = render(JSXWrapper(Pagination, {
            ...props,
            showSteps: true,
            showEdgeSteps: true,
        }));

        const expectedStepButtonsCount = 4;
        const steps = container.querySelectorAll(`.${expectedPaginationButtonClass}__page_hasIcon`);

        expect(steps.length).toBe(expectedStepButtonsCount);
    });

    it('should have disabled class', () => {
        const {container} = render(JSXWrapper(Pagination, {
            ...props,
            showSteps: true,
            showEdgeSteps: true,
        }));

        const expectedDisabledPagesCount = 2;
        const disabledPages = container.querySelectorAll(`.${expectedPaginationButtonClass}__page_disabled`);

        expect(disabledPages.length).toBe(expectedDisabledPagesCount);
    });
});
