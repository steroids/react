import * as React from 'react';
import {Provider} from 'react-redux';
import _merge from 'lodash-es/merge';
import {useCallback} from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import localeData from 'dayjs/plugin/localeData';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isToday from 'dayjs/plugin/isToday';
import {IHttpComponentConfig} from 'src/components/HttpComponent';
import {IWebSocketComponentConfig} from 'src/components/WebSocketComponent';
import ThemeProvider, {IThemeProviderProps} from '../providers/ThemeProvider';
import ClientStorageComponent from '../components/ClientStorageComponent';
import HtmlComponent from '../components/HtmlComponent';
import StoreComponent from '../components/StoreComponent';
import UiComponent from '../components/UiComponent';
import MetaComponent from '../components/MetaComponent';
import ComponentsProvider, {IComponents} from '../providers/ComponentsProvider';
import Router, {IRouteItem, IRouterProps} from '../ui/nav/Router/Router';
import MetricsComponent from '../components/MetricsComponent';
import ScreenProvider, {IScreenProviderProps} from '../providers/ScreenProvider';
import useComponents from './useComponents';
import {IFetchConfig} from '../hooks/useFetch';

export interface IComponentConfig {
    className: any,
    [key: string]: any,
}

/**
 * Application HOC
 * Обертка над корневым компонентом приложения, используется только в `Application.tsx`. Добавляет через React Context
 * компоненты приложения и конфигурирует их.
 */
export interface IApplicationHookConfig {
    components?: {
        clientStorage?: any,
        html?: IComponentConfig,
        http?: IHttpComponentConfig & IComponentConfig,
        locale?: any,
        store?: any,
        ui?: any,
        resource?: any,
        ws?: IWebSocketComponentConfig & IComponentConfig,
        pushNotification?: any,
        meta?: any,

        [key: string]: {
            className: any,
            [key: string]: any,
        } | any,
    } | any,
    onInit?: (components: IComponents) => void,
    useGlobal?: boolean,
    reducers?: any,
    routes?: () => IRouteItem,
    layoutView?: () => CustomView,
    layoutProps?: Record<string, unknown>,
    screen?: Omit<IScreenProviderProps, 'children'>,
    theme?: Omit<IThemeProviderProps, 'children'>;

    routerProps?: IRouterProps,
    /**
     * These fetch configurations will be used to preload and store for no matter what route matched in case of SSR
     */
    defaultFetches?: IFetchConfig[],
}

export interface IApplicationHookResult {
    renderApplication: (children?: any) => JSX.Element,
    components: IComponents,
}

export const defaultComponents = {
    clientStorage: {
        className: ClientStorageComponent,
    },
    html: {
        className: HtmlComponent,
    },
    //http: {
    //    className: HttpComponent,
    //},
    //locale: {
    //    className: LocaleComponent,
    //},
    meta: {
        className: MetaComponent,
    },
    store: {
        className: StoreComponent,
    },
    ui: {
        className: UiComponent,
    },
    metrics: {
        className: MetricsComponent,
    },
};

export default function useApplication(config: IApplicationHookConfig = {}): IApplicationHookResult {
    const useGlobal = config.useGlobal !== false;

    //Extending dayjs / day.js with modules that used in steroids
    dayjs.extend(relativeTime);
    dayjs.extend(customParseFormat);
    dayjs.extend(localizedFormat);
    dayjs.extend(utc);
    dayjs.extend(localeData);
    dayjs.extend(isToday);

    let components: IComponents = useComponents();

    if (useGlobal && !process.env.IS_SSR) {
        components = window.SteroidsComponents || null;
    }

    // Create components
    if (!components) {
        components = {};
        const componentsConfig = _merge({}, defaultComponents, config.components);
        Object.keys(componentsConfig).forEach(name => {
            if (typeof componentsConfig[name] === 'function') {
                componentsConfig[name] = {className: componentsConfig[name]};
            }

            const {className, ...componentConfig} = componentsConfig[name];

            // Append reducers to store
            if (name === 'store') {
                if (config.reducers) {
                    componentConfig.reducers = config.reducers;
                }
            }

            // eslint-disable-next-line new-cap
            components[name] = new className(components, componentConfig);
        });

        window.SteroidsComponents = components;

        // Init callback
        if (config.onInit) {
            config.onInit(components);
        }
    }

    // Application wrapper
    const renderApplication = useCallback((children = null) => {
        let content = children;

        // Wrap in routes
        if (config.routes) {
            content = (
                <Router
                    routes={config.routes()}
                    wrapperView={config.layoutView()}
                    wrapperProps={config.layoutProps}
                    {...config.routerProps}
                />
            );
        }

        if (config.screen) {
            content = (
                <ScreenProvider {...config.screen}>
                    {content}
                </ScreenProvider>
            );
        }

        if (config.theme) {
            content = (
                <ThemeProvider {...config.theme}>
                    {content}
                </ThemeProvider>
            );
        }

        if (!(useGlobal || process.env.IS_SSR)) {
            content = (
                <ComponentsProvider components={components}>
                    {content}
                </ComponentsProvider>
            );
        }

        return (
            <Provider store={components.store.store}>
                {content}
            </Provider>
        );
    }, [components, config, useGlobal]);

    return {renderApplication, components};
}
