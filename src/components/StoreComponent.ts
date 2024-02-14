/* eslint-disable no-restricted-globals */
import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware, connectRouter} from 'connected-react-router';
import {
    createBrowserHistory,
    createMemoryHistory,
    createHashHistory,
} from 'history';
import _get from 'lodash-es/get';
import _merge from 'lodash-es/merge';
import _isPlainObject from 'lodash-es/isPlainObject';

declare global {
    interface Window {
        APP_REDUX_PRELOAD_STATES?: any,
        __REDUX_DEVTOOLS_EXTENSION__?: any,
    }
}

interface IStoreComponentConfig {
    initialState: any,
    history: any,
}

export interface IStoreComponent {
    /**
     * Редьюсеры
     */
    reducers: any,

    /**
     * Хранилище
     */
    store: any,

    /**
     * Инициализация
     */
    init(): void,

    /**
     * Инициализация хранилища
     */
    initStore(): void,

    /**
     * Конфигурация
     */
    configurate(): void,

    /**
     * Метод для dispatch
     * @param action Экшен для изменения состояния.
     */
    dispatch(action): void,

    /**
     * Получение состояния
     */
    getState(): void,

    /**
     * Подписка
     * @param handler Обработчик изменения состояния.
     */
    subscribe(handler): void,

    /**
     * Добавление редьюсеров
     * @param asyncReducers Коллекция редьюсеров.
     */
    addReducers(asyncReducers): void,

    /**
     * Метод, который вызывается при ошибке
     * @param error Объект ошибки.
     * @param action Callback функция вызываемая при ошибке.
     */
    errorHandler(error, action): void,

    [key: string]: any,
}

/**
 * Store Component
 * Обертка над Redux Store со встроенными middleware (thunk, multi, promise..) и react-router.
 */
export default class StoreComponent implements IStoreComponent {
    _asyncReducers: any;

    _components: any;

    reducers: any;

    _routerReducer: any;

    history: any;

    navigationNative: any;

    store: any;

    lastAction: string;

    constructor(components, config, lazyInit = false) {
        this._components = components;

        this.reducers = config.reducers;

        this.history = null;
        this.store = config.store || null;
        this.lastAction = null;
        this._asyncReducers = {};

        this.getState = this.getState.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.subscribe = this.subscribe.bind(this);

        if (!lazyInit) {
            this.initStore(config);
        }
    }

    init(config = {} as IStoreComponentConfig) {
        this.initStore(config);
        this.configurate();
    }

    initStore(config = {} as IStoreComponentConfig) {
        const initialState = {
            ...(process.env.IS_WEB
                ? _merge(...(window.APP_REDUX_PRELOAD_STATES || [{}]))
                : {}),
            ...config.initialState,
        };

        if (window?.APP_REDUX_PRELOAD_STATES) {
            delete window.APP_REDUX_PRELOAD_STATES;
        }

        if (process.env.PLATFORM !== 'mobile') {
            const createHistory: any = process.env.IS_SSR || typeof location === 'undefined'
                ? createMemoryHistory
                : location.protocol === 'file:'
                    ? createHashHistory
                    : createBrowserHistory;
            this.history = createHistory({
                ..._get(initialState, 'config.store.history', {}),
                ...config.history,
            });

            // Add '?' for fix connected-react-router
            if (process.env.IS_SSR && !this.history.location.search) {
                this.history.location.search = '?';
            }
            this._routerReducer = connectRouter(this.history);
        }

        if (!this.store) {
            this.store = createStore(
                //TODO TYPES
                //@ts-ignore
                this.reducers(
                    this._routerReducer ? {
                        router: this._routerReducer,
                    } : {},
                ),
                initialState,
                compose(
                    applyMiddleware(({getState}) => next => action => this._prepare(action, next, getState)),
                    applyMiddleware(routerMiddleware(this.history)),
                    !process.env.IS_SSR && window.__REDUX_DEVTOOLS_EXTENSION__ && process.env.PLATFORM !== 'mobile'
                        ? window.__REDUX_DEVTOOLS_EXTENSION__()
                        : f => f,
                ),
            );
        }
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

    subscribe(handler) {
        return this.store.subscribe(handler);
    }

    addReducers(asyncReducers) {
        this._asyncReducers = {
            router: this._routerReducer,
            ...this._asyncReducers,
            ...asyncReducers,
        };
        this.store.replaceReducer(this.reducers(this._asyncReducers));
    }

    errorHandler(error, action) {
        throw error;
    }

    _prepare(action, dispatch, getState) {
        // Multiple dispatch (redux-multi)
        if (Array.isArray(action)) {
            return action
                .filter(v => v)
                .map(p => this._prepare(p, dispatch, getState));
        }
        // Function wraper (redux-thunk)
        if (typeof action === 'function') {
            return action(
                p => this._prepare(p, dispatch, getState),
                getState,
                this._components,
            );
        }
        // Promise, detect errors on rejects
        // eslint-disable-next-line max-len
        // Detect action through instanceof Promise is not working in production mode, then used single detection by type
        if (
            typeof action === 'object'
            && typeof action.then === 'function'
            && typeof action.catch === 'function'
        ) {
            return action
                .then(payload => this._prepare(payload, dispatch, getState))
                .catch(e => {
                    this.errorHandler(e, p => this._prepare(p, dispatch, getState));
                });
        }
        // Default case
        if (_isPlainObject(action) && action.type) {
            this.lastAction = action.type;

            try {
                return dispatch(action);
            } catch (e) {
                this.errorHandler(e, p => this._prepare(p, dispatch, getState));
            }
        }
        return action;
    }
}
