import * as React from 'react';
import {PropsWithChildren, useMemo} from 'react';
import {StaticRouterContext} from 'react-router';

export interface IPreloadedData {
    [configId: string]: any,
}

export interface IPreloadedErrors {
    [configId: string]: any,
}

export interface ISsr {
    history?: {
        initialEntries: string[],
    },
    staticContext?: StaticRouterContext,
    preloadedData?: IPreloadedData,
    preloadedErrors?: IPreloadedErrors,
}

export const SsrProviderContext = React.createContext<ISsr>(null);

export interface ISsrProviderProps extends ISsr, PropsWithChildren<any> {}

export default function SsrProvider(props: ISsrProviderProps): JSX.Element {
    const value = useMemo(() => ({
        history: props.history,
        staticContext: props.staticContext,
        preloadedData: props.preloadedData,
    }), [props.history, props.preloadedData, props.staticContext]);

    return (
        <SsrProviderContext.Provider value={value}>
            {props.children}
        </SsrProviderContext.Provider>
    );
}
