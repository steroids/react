import * as React from 'react';
import {PropsWithChildren} from 'react';
import {IUiApplicationComponent} from 'src/components/UiComponent';
import {ILocaleComponent} from 'src/components/LocaleComponent';
import {IClientStorageComponent} from 'src/components/ClientStorageComponent';
import {IResourceComponent} from '../components/ResourceComponent';

declare global {
    interface Window {
        SteroidsComponents: IComponents,
    }
}

export interface IComponents {
    clientStorage?: IClientStorageComponent,
    html?: any,
    http?: any,
    locale?: ILocaleComponent,
    store?: any,
    ui?: IUiApplicationComponent,
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
