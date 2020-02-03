import * as React from 'react';
import {Provider} from 'react-redux';
import ClientStorageComponent from '../components/ClientStorageComponent';
import HtmlComponent from '../components/HtmlComponent';
import HttpComponent from '../components/HttpComponent';
import LocaleComponent from '../components/LocaleComponent';
import StoreComponent from '../components/StoreComponent';
import UiComponent from '../components/UiComponent';
import {ComponentsContext} from './components';

export default (config): any => WrappedComponent =>
    class ApplicationHoc extends React.PureComponent {

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
                            <WrappedComponent {...this.props} />
                        </ComponentsContext.Provider>
                    </Provider>
                );
            }
        }
    }

