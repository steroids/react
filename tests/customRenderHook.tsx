import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook, RenderHookOptions} from '@testing-library/react';
import useApplication from '../src/hooks/useApplication';
import HtmlComponent from '../src/components/HtmlComponent';

const customRenderHook = <T, >(
    hook: (args?: any) => T,
    config?: any,
    options?: Omit<RenderHookOptions<any>, 'wrapper'>,
) => {
    function MockApplication({children}: {children: React.ReactNode}) {
        const {renderApplication} = useApplication({
            layoutView: () => require('./mocks/mockLayout').default,
            components: {
                html: {
                    className: HtmlComponent,
                },
                store: {
                    reducers: require('../src/reducers/index').default,
                    ...config?.store,
                },
                metrics: {
                    className: jest.fn(),
                },
            },
            screen: {},
        });

        return renderApplication(children);
    }

    return renderHook(hook, {wrapper: MockApplication, ...options});
};

export {customRenderHook as renderHook};
