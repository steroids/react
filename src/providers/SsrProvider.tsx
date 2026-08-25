import {createContext, PropsWithChildren, useMemo} from 'react';

export interface IPreloadedData {
    [configId: string]: any,
}

export interface IPreloadedErrors {
    [configId: string]: any,
}

// v6 has no equivalent to v5's <StaticRouter context>: the host app passes in a plain object,
// which is mutated during rendering and read back after renderToString() to build the response
// (status code, redirect target) - this interface only describes that contract, it does not
// come from react-router
export interface IStaticContext {
    statusCode?: number,
    action?: string,
    url?: string,
    [key: string]: any,
}

export interface ISsr {
    history?: {
        initialEntries: string[],
    },
    staticContext?: IStaticContext,
    preloadedData?: IPreloadedData,
    preloadedErrors?: IPreloadedErrors,
}

export const SsrProviderContext = createContext<ISsr>(null);

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
