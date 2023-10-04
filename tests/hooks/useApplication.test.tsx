import '@testing-library/jest-dom';
import React from 'react';
import {render, renderHook} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import {useApplication} from '../../src/hooks';
import * as router from '../../src/ui/nav/Router/Router';
import * as themeProvider from '../../src/providers/ThemeProvider';
import * as screenProvider from '../../src/providers/ScreenProvider';
import * as componentsProvider from '../../src/providers/ComponentsProvider';
import ClientStorageComponent from '../../src/components/ClientStorageComponent';
import HtmlComponent from '../../src/components/HtmlComponent';
import JwtHttpComponent from '../../src/components/JwtHttpComponent';
import LocaleComponent from '../../src/components/LocaleComponent';
import MetaComponent from '../../src/components/MetaComponent';
import UiComponent from '../../src/components/UiComponent';
import StoreComponent from '../../src/components/StoreComponent';
import MetricsComponent from '../../src/components/MetricsComponent';
import {IRouteItem} from '../../src/ui/nav/Router/Router';

jest.mock('../../src/components/ClientStorageComponent');
jest.mock('../../src/components/HtmlComponent');
jest.mock('../../src/components/JwtHttpComponent');
jest.mock('../../src/components/LocaleComponent');
jest.mock('../../src/components/MetaComponent');
jest.mock('../../src/components/UiComponent');
jest.mock('../../src/components/MetricsComponent');
jest.mock('../mocks/mockLayout');

jest.mock('react-redux', () => ({
    __esModule: true,
    // @ts-ignore
    ...jest.requireActual('react-redux'),
}));

const componentsProviderSpy = jest.spyOn(componentsProvider, 'default');
const themeProviderSpy = jest.spyOn(themeProvider, 'default');
const screenProviderSpy = jest.spyOn(screenProvider, 'default');
const routerProviderSpy = jest.spyOn(router, 'default');
const storeProviderSpy = jest.spyOn(reactRedux, 'Provider');

describe('useApplication Hook', () => {
    const mockedUiComponent = (props: React.PropsWithChildren<any>) => <div>{props.children}</div>;

    const mockedRoutes = {
        id: 'route',
        exact: true,
        path: '/',
        component: () => mockedUiComponent,
        roles: [null],
    } as IRouteItem;

    const config = {
        screen: {
            media: {},
        },
        theme: {
            themes: {},
        },
        routes: () => (mockedRoutes),
        layoutView: () => require('../mocks/mockLayout').default,
        components: {
            http: {
                apiUrl: 'https://kozhin.dev',
                refreshTokenRequest: {
                    url: '/refresh',
                    method: 'post',
                },
                className: JwtHttpComponent,
            },
            locale: LocaleComponent,
            store: {
                reducers: require('../../src/reducers/index').default,
            },
        },
        onInit: jest.fn(),
    };

    const componentsStub = expect.any(Object);

    beforeEach(() => {
        jest.clearAllMocks();
        global.window.SteroidsComponents = undefined;
    });

    afterAll(() => jest.restoreAllMocks());

    it('should create "http" component', () => {
        const expectedConfigForHttpComponentConstructor = {
            apiUrl: 'https://kozhin.dev',
            refreshTokenRequest: {
                url: '/refresh',
                method: 'post',
            },
        };

        const {result} = renderHook(() => useApplication(config));

        expect(JwtHttpComponent).toHaveBeenCalledWith(componentsStub, expectedConfigForHttpComponentConstructor);
        expect(result.current.components.http).toBeInstanceOf(JwtHttpComponent);
    });

    it('should add className field if components config field is function', () => {
        const {result} = renderHook(() => useApplication(config));

        const {locale} = result.current.components;

        expect(LocaleComponent).toHaveBeenCalled();
        expect(locale).toBeInstanceOf(LocaleComponent);
    });

    it('should create store component', () => {
        const {result} = renderHook(() => useApplication(config));

        const {store} = result.current.components;

        expect(store).toBeInstanceOf(StoreComponent);
    });

    it('should take "client storage component" from default components and create', () => {
        const {result} = renderHook(() => useApplication(config));

        expect(ClientStorageComponent).toHaveBeenCalled();
        expect(result.current.components.clientStorage).toBeInstanceOf(ClientStorageComponent);
    });

    it('should take "html" from default components and create', () => {
        const {result} = renderHook(() => useApplication(config));

        const {html} = result.current.components;

        expect(HtmlComponent).toHaveBeenCalled();
        expect(html).toBeInstanceOf(HtmlComponent);
    });

    it('should take "meta" from default components and create', () => {
        const {result} = renderHook(() => useApplication(config));

        const {meta} = result.current.components;

        expect(MetaComponent).toHaveBeenCalled();
        expect(meta).toBeInstanceOf(MetaComponent);
    });

    it('should take "ui" from default components and create', () => {
        const {result} = renderHook(() => useApplication(config));

        const {ui} = result.current.components;

        expect(UiComponent).toHaveBeenCalled();
        expect(ui).toBeInstanceOf(UiComponent);
    });

    it('should take "metrics" from default components and create', () => {
        const {result} = renderHook(() => useApplication(config));

        const {metrics} = result.current.components;

        expect(MetricsComponent).toHaveBeenCalled();
        expect(metrics).toBeInstanceOf(MetricsComponent);
    });

    it('should save created components into window.SteroidsComponents', () => {
        const {result} = renderHook(() => useApplication(config));

        expect(global.window.SteroidsComponents).toEqual(result.current.components);
    });

    it('should not create components if they exist in the window.SteroidsComponents', () => {
        const expectedComponentsCreationBlockCallsCount = 1;

        const {result, rerender} = renderHook(() => useApplication(config));

        expect(global.window.SteroidsComponents).toEqual(result.current.components);
        expect(config.onInit).toHaveBeenCalledTimes(expectedComponentsCreationBlockCallsCount);

        rerender();

        expect(config.onInit).toHaveBeenCalledTimes(expectedComponentsCreationBlockCallsCount);
    });

    it('should call onInit callback', () => {
        renderHook(() => useApplication(config));

        expect(config.onInit).toHaveBeenCalled();
    });

    it('should add router provider', () => {
        const {result} = renderHook(() => useApplication(config));
        render(result.current.renderApplication());

        expect(routerProviderSpy).toHaveBeenCalled();
    });

    it('should add screen provider', () => {
        const {result} = renderHook(() => useApplication(config));
        render(result.current.renderApplication());

        expect(screenProviderSpy).toHaveBeenCalled();
    });

    it('should add theme provider', () => {
        const {result} = renderHook(() => useApplication(config));
        render(result.current.renderApplication());

        expect(themeProviderSpy).toHaveBeenCalled();
    });

    it('should add components provider', () => {
        const {result} = renderHook(() => useApplication({...config, useGlobal: false}));
        render(result.current.renderApplication());

        expect(componentsProviderSpy).toHaveBeenCalled();
    });

    it('should add store provider', () => {
        const {result} = renderHook(() => useApplication(config));
        render(result.current.renderApplication());

        expect(storeProviderSpy).toHaveBeenCalled();
    });
});
