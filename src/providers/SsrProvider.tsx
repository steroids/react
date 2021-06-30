import * as React from 'react';
import {PropsWithChildren} from 'react';

export interface ISsr {
    history?: {
        initialEntries: string[],
    },
    staticContext?: any,
}

export const SsrProviderContext = React.createContext<ISsr>(null);

export interface ISsrProviderProps extends ISsr, PropsWithChildren<any> {}

export default function SsrProvider(props: ISsrProviderProps): JSX.Element {
    return (
        <SsrProviderContext.Provider value={{
            history: props.history,
            staticContext: props.staticContext,
        }}>
            {props.children}
        </SsrProviderContext.Provider>
    );
}
