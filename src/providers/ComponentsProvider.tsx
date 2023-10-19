import * as React from 'react';
import {PropsWithChildren} from 'react';
import {IHttpComponent} from 'src/components/HttpComponent';
import {IHtmlComponent} from 'src/components/HtmlComponent';
import {IWebSocketComponent} from 'src/components/WebSocketComponent';
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
    store?: any,
    ui?: IUiApplicationComponent,
    resource?: IResourceComponent,
    ws?: IWebSocketComponent,
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
