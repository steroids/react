import '@testing-library/jest-dom';
import {render} from '../../../customRender';
import Pagination, {IPaginationProps} from '../../../../src/ui/list/Pagination/Pagination';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';

describe('Pagination tests', () => {
    const props = {
        list: {
            total: 100,
            page: 2,
            pageSize: 10,
        },
        aroundCount: 5,
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
        const expectedPagesCount = 8;
        const pages = container.querySelectorAll(`.${expectedPaginationButtonClass}__page`);
        expect(pages.length).toBe(expectedPagesCount);
    });

    it('should have steps buttons', () => {
        const {container, debug} = render(JSXWrapper(Pagination, {
            ...props,
            showSteps: true,
            showEdgeSteps: true,
        }));

        const expectedStepButtonsCount = 4;
        const steps = container.querySelectorAll(`.${expectedPaginationButtonClass}__page_step`);

        expect(steps.length).toBe(expectedStepButtonsCount);
    });

    it('should have disabled class', () => {
        const {container} = render(JSXWrapper(Pagination, {
            ...props,
            disabled: true,
        }));

        const expectedDisabledPagesCount = 8;
        const disabledPages = container.querySelectorAll(`.${expectedPaginationButtonClass}__page_disabled`);

        expect(disabledPages.length).toBe(expectedDisabledPagesCount);
    });
});
