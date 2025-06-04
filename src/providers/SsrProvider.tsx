import * as React from 'react';
import {PropsWithChildren} from 'react';
import {StaticRouterContext} from 'react-router';

export interface IPreloadedData {
    [configId: string]: any,
}

export interface ISsr {
    history?: {
        initialEntries: string[],
    },
    staticContext?: StaticRouterContext,
    preloadedData?: IPreloadedData,
}

export const SsrProviderContext = React.createContext<ISsr>(null);

export interface ISsrProviderProps extends ISsr, PropsWithChildren<any> {}

export default function SsrProvider(props: ISsrProviderProps): JSX.Element {
    const providerValue = React.useMemo(() => ({
        history: props.history,
        staticContext: props.staticContext,
        preloadedData: props.preloadedData,
    }), [props.history, props.preloadedData, props.staticContext]);

    return (
        <SsrProviderContext.Provider value={providerValue}>
            {props.children}
        </SsrProviderContext.Provider>
    );
}
