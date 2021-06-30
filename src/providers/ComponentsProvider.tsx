import * as React from 'react';
import {PropsWithChildren} from 'react';

declare global {
    interface Window {
        SteroidsComponents: IComponents,
    }
}

export interface IComponents {
    api?: any,
    clientStorage?: any,
    html?: any,
    http?: any,
    locale?: any,
    store?: any,
    ui?: any,
    resource?: any,
    ws?: any,
    pushNotification?: any,
    meta?: any,
    [key: string]: any,
}

export interface IComponentsProviderProps extends PropsWithChildren<any> {
    components: IComponents
}

export const ComponentsContext = React.createContext({} as IComponents);

export default function ComponentsProvider(props: IComponentsProviderProps): JSX.Element {
    return (
        <ComponentsContext.Provider value={props.components}>
            {props.children}
        </ComponentsContext.Provider>
    );
}
