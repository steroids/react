import React, {PropsWithChildren} from 'react';
import {renderHook} from '@testing-library/react';
import type {RenderOptions} from '@testing-library/react';
import {Provider} from 'react-redux';
import {createStore, PreloadedState} from 'redux';
import asyncReducers from '../src/reducers';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<any>
    store?: any
}

export default function renderHookWithStore<
    T
>(
    hook: (args?: any) => T,
    {
        preloadedState = {},
        store = createStore(asyncReducers, preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {},
) {
    function Wrapper({children}: PropsWithChildren<object>): JSX.Element {
        return <Provider store={store}>{children}</Provider>;
    }

    return {store, ...renderHook(hook, {wrapper: Wrapper, ...renderOptions})};
}
