import React, {ReactElement} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, renderHook, RenderOptions} from '@testing-library/react';
import useApplication from '../src/hooks/useApplication';
import HtmlComponent from '../src/components/HtmlComponent';
import HttpComponent from '../src/components/HttpComponent';
import LocaleComponent from '../src/components/LocaleComponent';

export function AllTheProviders({children}: {children: React.ReactNode}) {
    const {renderApplication} = useApplication({
        layoutView: () => require('./mockLayout').default,
        components: {
            locale: LocaleComponent,
            html: {
                className: HtmlComponent,
            },
            http: {
                className: HttpComponent,
            },
            store: {
                reducers: require('../src/reducers/index').default,
            },
        },
        screen: {},
        onInit: ({ui}) => {
            ui.addViews(require('./ui/index').default);
            ui.addFields(require('./ui/fields').default);
            ui.addIcons(require('./ui/content/Icon/mockIcon').default);
        },
    });

    return renderApplication(children);
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options});

export {customRender as render};
