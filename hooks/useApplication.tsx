import * as React from 'react';
import {Provider} from 'react-redux';
import _merge from 'lodash-es/merge';
import {useCallback} from 'react';
import StoreComponent from '../components/StoreComponent';
import UiComponent from '../components/UiComponent';
import {IComponentsHookOutput} from './components';

declare global {
    interface Window {
        SteroidsComponents: IComponentsHookOutput,
    }
}

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
    }
    onInit?: (components: IComponentsHookOutput) => void,
    useGlobal?: boolean,
}

export interface IApplicationHookResult {
    renderApplication: (children: any) => JSX.Element,
    components: IComponentsHookOutput,
}

export const ComponentsContext = React.createContext({} as IComponentsHookOutput);

const defaultComponents = {
    //clientStorage: {
    //    className: ClientStorageComponent,
    //},
    //html: {
    //    className: HtmlComponent,
    //},
    //http: {
    //    className: HttpComponent,
    //},
    //locale: {
    //    className: LocaleComponent,
    //},
    //meta: {
    //    className: MetaComponent,
    //},
    store: {
        className: StoreComponent,
    },
    ui: {
        className: UiComponent,
    },
};

export default function useApplication(config: IApplicationHookConfig = {}): IApplicationHookResult {
    let components: IComponentsHookOutput;

    // Store global (in global mode)
    const useGlobal = config.useGlobal !== false && typeof window !== 'undefined';
    if (useGlobal) {
        components = window.SteroidsComponents || null;
    }

    // Create components
    if (!components) {
        components = {};

        const componentsConfig = _merge({}, defaultComponents, config.components);
        Object.keys(componentsConfig).forEach(name => {
            const {className, ...componentConfig} = componentsConfig[name];
            // eslint-disable-next-line new-cap
            components[name] = new className(components, componentConfig);
        });

        if (useGlobal) {
            window.SteroidsComponents = components;
        }

        // Init callback
        if (config.onInit) {
            config.onInit(components);
        }
    }

    // Application wrapper
    const renderApplication = useCallback((children) => {
        const content = useGlobal
            ? children
            : (
                <ComponentsContext.Provider value={components}>
                    {children}
                </ComponentsContext.Provider>
            );

        return (
            <Provider store={components.store.store}>
                {content}
            </Provider>
        );
    }, [components, useGlobal]);

    return {renderApplication, components};
}
