import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook, RenderHookOptions} from '@testing-library/react';
import MockApplication, {IMockApplicationConfig} from '../mocks/mockApplication';

const customRenderHook = <T, >(
    hook: (args?: any) => T,
    config?: IMockApplicationConfig,
    options?: Omit<RenderHookOptions<any>, 'wrapper'>,
) => {
    const Wrapper = ({children}: {children: React.ReactNode, }) => MockApplication({
        children,
        config,
    });

    return renderHook(hook, {
        wrapper: Wrapper,
        ...options,
    });
};

export {customRenderHook as renderHook};
