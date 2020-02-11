import * as React from 'react';
import {Provider} from 'react-redux';
import _merge from 'lodash-es/merge';
import ClientStorageComponent from '../components/ClientStorageComponent';
import HtmlComponent from '../components/HtmlComponent';
import HttpComponent from '../components/HttpComponent';
import LocaleComponent from '../components/LocaleComponent';
import StoreComponent from '../components/StoreComponent';
import UiComponent from '../components/UiComponent';
import {IComponentsHocOutput} from './components';

export interface IApplicationHocInput {
}

export interface IApplicationHocOutput {
}

export interface IApplicationHocConfig {
    components?: {
        [key: string]: {
            className: any,
            [key: string]: any,
        },
    }
    onInit?: (...args: any) => any,
}

export const ComponentsContext = React.createContext({} as IComponentsHocOutput);

const defaultComponents = {
    clientStorage: {
        className: ClientStorageComponent,
    },
    html: {
        className: HtmlComponent,
    },
    http: {
        className: HttpComponent,
    },
    locale: {
        className: LocaleComponent,
    },
    store: {
        className: StoreComponent,
    },
    ui: {
        className: UiComponent,
    },
};

export default (config: IApplicationHocConfig): any => WrappedComponent =>
    class ApplicationHoc extends React.PureComponent<IApplicationHocInput> {

        _components: any;

        static WrappedComponent = WrappedComponent;

        constructor(props) {
            super(props);

            // Create components
            this._components = {};
            const componentsConfig = _merge({}, defaultComponents, config.components);
            Object.keys(componentsConfig).forEach(name => {
                const {className, ...componentConfig} = componentsConfig[name];
                this._components[name] = new className(this._components, componentConfig);
            });

            // Init callback
            if (config.onInit) {
                config.onInit(this._components);
            }
        }

        render() {
            if (!process.env.IS_SSR) {
                return (
                    <Provider store={this._components.store.store}>
                        <ComponentsContext.Provider
                            value={{
                                components: this._components,
                            }}
                        >
                            <WrappedComponent {...this.props as IApplicationHocOutput} />
                        </ComponentsContext.Provider>
                    </Provider>
                );
            }
        }
    }
