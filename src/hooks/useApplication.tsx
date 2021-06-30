import * as React from 'react';
import {Provider} from 'react-redux';
import _merge from 'lodash-es/merge';
import {useCallback} from 'react';
import ClientStorageComponent from '../components/ClientStorageComponent';
import HtmlComponent from '../components/HtmlComponent';
import StoreComponent from '../components/StoreComponent';
import UiComponent from '../components/UiComponent';
import MetaComponent from '../components/MetaComponent';
import {IComponents} from '../providers/ComponentsProvider';
import Router, {IRouteItem} from '../ui/nav/Router/Router';
import MetricsComponent from '../components/MetricsComponent';
import ScreenProvider, {IScreenProviderProps} from '../providers/ScreenProvider';
import useComponents from './useComponents';

/**
 * Application HOC
 * Обертка над корневым компонентом приложения, используется только в `Application.tsx`. Добавляет через React Context
 * компоненты приложения и конфигурирует их.
 */
export interface IApplicationHookConfig {
    components?: {
        [key: string]: {
            className: any,
            [key: string]: any,
        } | any,
    } | any
    onInit?: (components: IComponents) => void,
    useGlobal?: boolean,
    reducers?: any,
    routes?: () => IRouteItem,
    layoutView?: () => CustomView,
    layoutProps?: Record<string, unknown>,
    screen?: boolean | Omit<IScreenProviderProps, 'children'>
}

export interface IApplicationHookResult {
    renderApplication: (children?: any) => JSX.Element,
    components: IComponents,
}

const defaultComponents = {
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
    const componentsContext = useComponents();

    let components: IComponents;

    if (process.env.IS_SSR) {
        components = componentsContext;
    } else {
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

        return (
            <Provider store={components.store.store}>
                {content}
            </Provider>
        );
    }, [components, config]);

    return {renderApplication, components};
}
