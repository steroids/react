import * as React from 'react';
import {PropsWithChildren} from 'react';

import {IClientStorageComponent} from '../components/ClientStorageComponent';
import {IHtmlComponent} from '../components/HtmlComponent';
import {IHttpComponent} from '../components/HttpComponent';
import {ILocaleComponent} from '../components/LocaleComponent';
import {IMetaComponent} from '../components/MetaComponent';
import {IResourceComponent} from '../components/ResourceComponent';
import {IStoreComponent} from '../components/StoreComponent';
import {IUiApplicationComponent} from '../components/UiComponent';
import {IWebSocketComponent} from '../components/WebSocketComponent';

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
