import React, {ReactElement} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, RenderOptions} from '@testing-library/react';
import useApplication from '../src/hooks/useApplication';
import HtmlComponent from '../src/components/HtmlComponent';

function AllTheProviders({children}: {children: React.ReactNode}) {
    const {renderApplication} = useApplication({
        components: {
            html: {
                className: HtmlComponent,
            },
            store: {
                reducers: require('../src/reducers/index').default,
            },
        },
        onInit: ({ui}) => {
            ui.addViews(require('@steroidsjs/bootstrap/index').default);
            ui.addIcons(require('@steroidsjs/bootstrap/icon/fontawesome').default);
        },
    });

    return renderApplication(children);
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options});

export {customRender as render};
