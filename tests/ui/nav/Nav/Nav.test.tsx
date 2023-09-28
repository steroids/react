import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';
import {JSXWrapper, getElementByClassName, render} from '../../../helpers';
import Nav, {INavProps} from '../../../../src/ui/nav/Nav/Nav';

describe('Nav tests', () => {
    const expectedButtonViewClass = 'ButtonView';

    const items = [
        {id: 1, label: 'One'},
        {id: 2, label: 'Two'},
        {id: 3, label: 'Three'},
    ];

    it('should be in the document', () => {
        const {container} = render(JSXWrapper(Nav, {
            items,
        }));

        const navButtons = container.querySelectorAll(`.${expectedButtonViewClass}__label`);
        expect(navButtons).toHaveLength(items.length);
        expect(navButtons[0]).toHaveTextContent('One');
        expect(navButtons[1]).toHaveTextContent('Two');
        expect(navButtons[2]).toHaveTextContent('Three');
    });

    it('should have external className', () => {
        const externalClass = 'class-test';
        const expectedParentNodeClass = 'NavButtonView';
        const {container} = render(JSXWrapper<INavProps>(Nav, {items, className: externalClass}));
        const parentNode = getElementByClassName(container, expectedParentNodeClass);
        expect(parentNode).toHaveClass(externalClass);
    });

    it('sets the active tab based on activeTab prop', () => {
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
            activeTab: 2,
        }));

        const activeNav = getElementByClassName(container, 'NavButtonView__list-item_active');
        expect(activeNav).toBeInTheDocument();
    });

    it('changes active tab on click', () => {
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
        }));

        const navElement = getElementByClassName(container, 'ButtonView');
        fireEvent.click(navElement);
        const firstNav = getElementByClassName(container, 'NavButtonView__list-item');
        expect(firstNav).toHaveClass('NavButtonView__list-item_active');
    });

    it('calls onChange callback on nav change', () => {
        const handleChange = jest.fn();
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
            onChange: handleChange,
        }));

        const navElement = getElementByClassName(container, 'ButtonView');
        fireEvent.click(navElement);

        expect(handleChange).toHaveBeenCalled();
    });

    it('should render Nav component with icon layout', () => {
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
            layout: 'icon',
        }));

        const expectedIconLayoutClass = 'NavIconView';
        const iconNavParentNode = getElementByClassName(container, expectedIconLayoutClass);
        expect(iconNavParentNode).toBeInTheDocument();
    });

    it('should render Nav component with link layout', () => {
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
            layout: 'link',
        }));

        const expectedLinkLayoutClass = 'NavLinkView';
        const linkNavParentNode = getElementByClassName(container, expectedLinkLayoutClass);
        expect(linkNavParentNode).toBeInTheDocument();
    });

    it('should render Nav component with tabs layout', () => {
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
            layout: 'tabs',
        }));

        const expectedTabsLayoutClass = 'NavTabsView';
        const tabsNavParentNode = getElementByClassName(container, expectedTabsLayoutClass);
        expect(tabsNavParentNode).toBeInTheDocument();
    });

    it('should render Nav component with navbar layout', () => {
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
            layout: 'navbar',
        }));

        const expectedNavBarLayoutClass = 'NavBarView';
        const navBarParentNode = getElementByClassName(container, expectedNavBarLayoutClass);
        expect(navBarParentNode).toBeInTheDocument();
    });

    it('should render Nav component with list layout', () => {
        const {container} = render(JSXWrapper<INavProps>(Nav, {
            items,
            layout: 'list',
        }));

        const expectedListLayoutClass = 'NavListView';
        const listParentNode = getElementByClassName(container, expectedListLayoutClass);
        expect(listParentNode).toBeInTheDocument();
    });

    describe('should have disabled items with different layouts', () => {
        const itemsWithDisabledOne = [
            {id: 1, label: 'One', disabled: true},
            {id: 2, label: 'Two'},
            {id: 3, label: 'Three'},
        ];

        it('button', () => {
            const {container, debug} = render(JSXWrapper<INavProps>(Nav, {items: itemsWithDisabledOne}));

            const firstNavElement = getElementByClassName(container, expectedButtonViewClass);

            expect(firstNavElement).toHaveClass(`${expectedButtonViewClass}_disabled`);
        });

        it('icon', () => {
            const {container} = render(JSXWrapper<INavProps>(Nav, {items: itemsWithDisabledOne, layout: 'icon'}));

            const firstNavElement = getElementByClassName(container, expectedButtonViewClass);

            expect(firstNavElement).toHaveClass(`${expectedButtonViewClass}_disabled`);
        });

        it('link', () => {
            const {container} = render(JSXWrapper<INavProps>(Nav, {items: itemsWithDisabledOne, layout: 'link'}));

            const firstNavElement = getElementByClassName(container, expectedButtonViewClass);

            expect(firstNavElement).toHaveClass(`${expectedButtonViewClass}_disabled`);
        });

        it('tabs', () => {
            const {container} = render(JSXWrapper<INavProps>(Nav, {items: itemsWithDisabledOne, layout: 'tabs'}));

            const firstNavElement = getElementByClassName(container, expectedButtonViewClass);

            expect(firstNavElement).toHaveClass(`${expectedButtonViewClass}_disabled`);
        });

        it('navbar', () => {
            const {container} = render(JSXWrapper<INavProps>(Nav, {items: itemsWithDisabledOne, layout: 'navbar'}));

            const firstNavElement = getElementByClassName(container, expectedButtonViewClass);

            expect(firstNavElement).toHaveClass(`${expectedButtonViewClass}_disabled`);
        });

        it('list', () => {
            const {container} = render(JSXWrapper<INavProps>(Nav, {items: itemsWithDisabledOne, layout: 'list'}));

            const firstNavElement = getElementByClassName(container, expectedButtonViewClass);

            expect(firstNavElement).toHaveClass(`${expectedButtonViewClass}_disabled`);
        });
    });
});
