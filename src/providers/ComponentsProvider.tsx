import * as React from 'react';
import {PropsWithChildren} from 'react';
import {IHttpComponent} from '../components/HttpComponent';
import {IHtmlComponent} from '../components/HtmlComponent';
import {IWebSocketComponent} from '../components/WebSocketComponent';
import {IMetaComponent} from '../components/MetaComponent';
import {IStoreComponent} from '../components/StoreComponent';
import {IClientStorageComponent} from '../components/ClientStorageComponent';
import {ILocaleComponent} from '../components/LocaleComponent';
import {IUiApplicationComponent} from '../components/UiComponent';
import {IResourceComponent} from '../components/ResourceComponent';

declare global {
    interface Window {
        SteroidsComponents: IComponents,
    }
}

export interface IComponents {
    clientStorage?: IClientStorageComponent,
    html?: IHtmlComponent,
    http?: IHttpComponent,
    locale?: ILocaleComponent,
    store?: IStoreComponent,
    ui?: IUiApplicationComponent,
    resource?: IResourceComponent,
    ws?: IWebSocketComponent,
    pushNotification?: any,
    meta?: IMetaComponent,
    [key: string]: any,
}

export interface IComponentsProviderProps extends PropsWithChildren<any> {
    components: IComponents,
}

export const ComponentsContext = React.createContext({} as IComponents);

export default function ComponentsProvider(props: IComponentsProviderProps): JSX.Element {
    return (
        <ComponentsContext.Provider value={props.components}>
            {props.children}
        </ComponentsContext.Provider>
    );
}
