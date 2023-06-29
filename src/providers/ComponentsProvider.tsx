import * as React from 'react';
import {PropsWithChildren} from 'react';
import {IUiComponent} from 'src/components/UiComponent';
import {IResourceComponent} from '../components/ResourceComponent';

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
    ui?: IUiComponent,
    resource?: IResourceComponent,
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
