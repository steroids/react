import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';

import ClientStorageComponent from '../components/ClientStorageComponent';
import HtmlComponent from '../components/HtmlComponent';
import HttpComponent from '../components/HttpComponent';
import LocaleComponent from '../components/LocaleComponent';
import StoreComponent from '../components/StoreComponent';
import UiComponent from '../components/UiComponent';

export default (config) => WrappedComponent => class ApplicationHoc extends React.PureComponent {

    static WrappedComponent = WrappedComponent;

    static childContextTypes = {
        components: PropTypes.object,
    };

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

    getChildContext() {
        return {
            components: this._components,
        };
    }

    render() {
        if (!process.env.IS_SSR) {
            return (
                <Provider store={this._components.store.store}>
                    <WrappedComponent
                        {...this.props}
                    />
                </Provider>
            );
        }
    }

};
