import '@testing-library/jest-dom';
import React from 'react';
import {render} from '../../../customRender';
import Router from '../../../../src/ui/nav/Router';
import {getElementByClassName, getElementByTag, JSXWrapper} from '../../../helpers';
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
            componentProps: {color: 'gray'},
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

    it('should be component/componentProps and wrapper', () => {
        props.routes.redirectTo = false;
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
        const testComponent = getByText(textPage);

        expect(testComponent).toBeInTheDocument();
    });
});
