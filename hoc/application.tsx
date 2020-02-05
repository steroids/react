import * as React from 'react';
import {Provider} from 'react-redux';
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
    onInit?: (...args: any) => any,
}

export const ComponentsContext = React.createContext({} as IComponentsHocOutput);

export default (config: IApplicationHocConfig): any => WrappedComponent =>
    class ApplicationHoc extends React.PureComponent<IApplicationHocInput> {

        _components: any;

        static WrappedComponent = WrappedComponent;

        constructor(props) {
            super(props);
            // Create components
            this._components = {};
            this._components.clientStorage = new ClientStorageComponent(this._components);
            this._components.html = new HtmlComponent(this._components);
            this._components.http = new HttpComponent(this._components);
            this._components.locale = new LocaleComponent(this._components);
            this._components.store = new StoreComponent(this._components);
            this._components.ui = new UiComponent(this._components);
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
