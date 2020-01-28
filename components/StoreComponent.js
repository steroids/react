import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware, connectRouter} from 'connected-react-router';
import {createBrowserHistory, createMemoryHistory, createHashHistory} from 'history';
import _get from 'lodash-es/get';
import _merge from 'lodash-es/merge';
import _isPlainObject from 'lodash-es/isPlainObject';

import reducers from 'reducers';

export default class StoreComponent {

    constructor(components, lazyInit = false) {
        this._components = components;

        this.history = null;
        this.store = null;
        this._asyncReducers = {};

        if (!lazyInit) {
            this.initStore();
        }
    }

    init(config = {}) {
        this.initStore(config);
        this.configurate();
    }

    initStore(config = {}) {
        const initialState = {
            ...(!process.env.IS_SSR ? _merge(...(window.APP_REDUX_PRELOAD_STATES || [{}])) : {}),
            ...config.initialState,
        };
        const createHistory = process.env.IS_SSR
            ? createMemoryHistory
            : location.protocol === 'file:'
                ? createHashHistory
                : createBrowserHistory;
        this.history = createHistory({
            ..._get(initialState, 'config.store.history', {}),
            ...config.history
        });

        // Add '?' for fix connected-react-router
        if (process.env.IS_SSR && !this.history.location.search) {
            this.history.location.search = '?';
        }

        this._routerReducer = connectRouter(this.history);
        this.store = createStore(
            reducers({
                router: this._routerReducer,
            }),
            initialState,
            compose(
                applyMiddleware(({getState}) => next => action => this._prepare(action, next, getState)),
                applyMiddleware(routerMiddleware(this.history)),
                !process.env.IS_SSR && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
            )
        );
    }

    configurate() {
        // Apply configuration
        const customConfig = this.getState().config || {};
        const components = this._components;
        _merge(components.clientStorage, customConfig.clientStorage);
        _merge(components.html, customConfig.html);
        _merge(components.http, customConfig.http);
        _merge(components.locale, customConfig.locale);
        _merge(components.resource, customConfig.resource);
        _merge(components.store, customConfig.store);
        _merge(components.ui, customConfig.ui);
        _merge(components.widget, customConfig.widget);
    }

    dispatch(action) {
        return this.store.dispatch(action);
    }

    getState() {
        return this.store.getState();
    }

    addReducers(asyncReducers) {
        this._asyncReducers = {
            router: this._routerReducer,
            ...this._asyncReducers,
            ...asyncReducers,
        };

        this.store.replaceReducer(reducers(this._asyncReducers));
    }

    errorHandler(error) {
        throw error;
    }

    _prepare(action, dispatch, getState) {
        // Multiple dispatch (redux-multi)
        if (Array.isArray(action)) {
            return action.filter(v => v).map(p => this._prepare(p, dispatch, getState));
        }

        // Function wraper (redux-thunk)
        if (typeof action === 'function') {
            return action(p => this._prepare(p, dispatch, getState), getState, this._components);
        }

        // Promise, detect errors on rejects
        // Detect action through instanceof Promise is not working in production mode, then used single detection by type
        if (typeof action === 'object' && typeof action.then === 'function' && typeof action.catch === 'function') {
            return action
                .then(payload => this._prepare(payload, dispatch, getState))
                .catch(e => {
                    this.errorHandler(e, p => this._prepare(p, dispatch, getState));
                });
        }

        // Default case
        if (_isPlainObject(action) && action.type) {
            try {
                return dispatch(action);
            } catch (e) {
                this.errorHandler(e, p => this._prepare(p, dispatch, getState));
            }
        }

        return action;
    }

}
