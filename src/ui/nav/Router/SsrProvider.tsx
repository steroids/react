import * as React from 'react';
import {PropsWithChildren} from 'react';

interface ISsrProviderContext {
    history?: {
        initialEntries: string[],
    },
    initialState?: any,
    staticContext?: any,
}

export const SsrProviderContext = React.createContext<ISsrProviderContext>(null);

interface ISsrProviderProps extends ISsrProviderContext, PropsWithChildren<any> {}

export default function SsrProvider(props: ISsrProviderProps): JSX.Element {
    return (
        <SsrProviderContext.Provider value={{
            history: props.history,
            initialState: props.initialState,
            staticContext: props.staticContext,
        }}
        >
            {props.children}
        </SsrProviderContext.Provider>
    );
}
