import {createContext, PropsWithChildren, useMemo} from 'react';

export interface IPreloadedData {
    [configId: string]: any,
}

export interface IPreloadedErrors {
    [configId: string]: any,
}

/**
 * The shape of the object the host app passes in for SSR: it is mutated
 * during rendering (e.g. by route components that need to set a status code or a
 * redirect) and read back after renderToString() to build the actual HTTP response.
 */
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
