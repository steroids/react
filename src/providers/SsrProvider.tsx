import * as React from 'react';
import {PropsWithChildren} from 'react';
import {StaticRouterContext} from 'react-router';

export interface IPreloadedData {
    [configId: string]: any
}

export interface ISsr {
    history?: {
        initialEntries: string[],
    },
    staticContext?: StaticRouterContext,
    preloadedData?: IPreloadedData
}

export const SsrProviderContext = React.createContext<ISsr>(null);

export interface ISsrProviderProps extends ISsr, PropsWithChildren<any> {}

export default function SsrProvider(props: ISsrProviderProps): JSX.Element {
    return (
        <SsrProviderContext.Provider value={{
            history: props.history,
            staticContext: props.staticContext,
            preloadedData: props.preloadedData,
        }}
        >
            {props.children}
        </SsrProviderContext.Provider>
    );
}
