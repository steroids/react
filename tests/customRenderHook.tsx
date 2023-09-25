// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook, RenderOptions} from '@testing-library/react';
import {AllTheProviders} from './customRender';

const customRenderHook = <T, >(
    hook: (args?: any) => T,
    options?: Omit<RenderOptions, 'wrapper'>,
) => renderHook(hook, {wrapper: AllTheProviders, ...options});

export {customRenderHook as renderHook};
