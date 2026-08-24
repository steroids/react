import '@testing-library/jest-dom';
import {fireEvent} from '@testing-library/dom';

import {goToRoute} from '../../../../src/actions/router';
import {useDispatch} from '../../../../src/hooks';
import Router from '../../../../src/ui/nav/Router';
import {getElementByClassName, getElementByTag, JSXWrapper, render} from '../../../helpers';
import LoaderMockView from '../../layout/Loader/LoaderMockView';

describe('Router tests', () => {
    const textPage = 'Contacts page';
    const props = {
        wrapperView: 'test-wrapper',
        autoScrollTop: false,
        children: 'test',
        routes: {
            id: 'home',
            path: '/',
            exact: true,
            redirectTo: false,
            component: LoaderMockView,
            componentProps: {
                color: 'gray',
            },
            items: [
                {
                    id: 'contacts',
                    path: '/contacts',
                    component: () => <div>{textPage}</div>,
                },
            ],
        },
    };

    const expectedLoaderClass = 'LoaderView__loader';

    // Each test builds its own route tree/expected location; without this reset every test
    // after the first reuses the same global StoreComponent (window.SteroidsComponents),
    // so navigation performed by an earlier test leaks into later ones via the shared
    // browser history/location.
    beforeEach(() => {
        global.window.SteroidsComponents = undefined;
        window.history.replaceState(null, '', '/');
        window.scrollTo = jest.fn();
    });

    it('should be component/componentProps and wrapper', () => {
        const {container} = render(JSXWrapper(Router, props));
        const wrapper = getElementByTag(container, props.wrapperView);
        const component = getElementByClassName(container, expectedLoaderClass);

        expect(wrapper).toBeInTheDocument();
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass(`${expectedLoaderClass}_color_${props.routes.componentProps.color}`);
    });

    it('should redirect', () => {
        props.routes.redirectTo = true;
        const {getByText} = render(JSXWrapper(Router, props));
        const component = getByText(textPage);

        expect(component).toBeInTheDocument();
    });

    it('should redirect to a route given as an explicit string path', () => {
        const redirectTargetText = 'Redirect target page';

        const redirectProps = {
            wrapperView: 'test-wrapper',
            routes: {
                id: 'home',
                path: '/',
                exact: true,
                redirectTo: '/target',
                items: [
                    {
                        id: 'target',
                        path: '/target',
                        component: () => <div>{redirectTargetText}</div>,
                    },
                ],
            },
        };

        const {getByText} = render(JSXWrapper(Router, redirectProps));

        expect(getByText(redirectTargetText)).toBeInTheDocument();
    });

    it('should render a nested layout together with the active child page', () => {
        const parentLayoutText = 'Parent layout';
        const childPageText = 'Child page';

        const nestedProps = {
            wrapperView: 'test-wrapper',
            routes: {
                id: 'parent',
                path: '/',
                exact: false,
                component: (componentProps: {children?: any}) => (
                    <div>
                        <span>{parentLayoutText}</span>
                        {componentProps.children}
                    </div>
                ),
                items: [
                    {
                        id: 'child',
                        path: '/',
                        exact: true,
                        component: () => <div>{childPageText}</div>,
                    },
                ],
            },
        };

        const {getByText} = render(JSXWrapper(Router, nestedProps));

        expect(getByText(parentLayoutText)).toBeInTheDocument();
        expect(getByText(childPageText)).toBeInTheDocument();
    });

    it('should open a modal route when navigating into it', async () => {
        const modalContentText = 'Modal route content';
        const navigateButtonText = 'Go to modal';

        function NavigateButton() {
            const dispatch = useDispatch();
            return (
                <button
                    type='button'
                    onClick={() => dispatch(goToRoute('modal'))}
                >
                    {navigateButtonText}
                </button>
            );
        }

        const modalProps = {
            wrapperView: 'test-wrapper',
            routes: {
                id: 'home',
                path: '/',
                exact: true,
                component: NavigateButton,
                items: [
                    {
                        id: 'modal',
                        path: '/modal',
                        role: 'modal',
                        component: () => <div>{modalContentText}</div>,
                    },
                ],
            },
        };

        const {getByText, findAllByText} = render(
            JSXWrapper(Router, modalProps, false, true),
            {
                container: document.body,
            },
        );

        fireEvent.click(getByText(navigateButtonText));

        // Navigating into a modal-role route renders it twice: once as the matched page
        // (Router's own Switch/Route output) and once via ModalPortal, since Router.tsx
        // dispatches openModal() as a side effect of the route becoming active.
        const modalOccurrences = await findAllByText(modalContentText);
        expect(modalOccurrences).toHaveLength(2);
    });
});
