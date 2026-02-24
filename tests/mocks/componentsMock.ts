import {IComponents} from '../../src/providers/ComponentsProvider';

const componentsMock: IComponents = {
    clientStorage: {
        get: jest.fn(),
        set: jest.fn(),
        remove: jest.fn(),
    } as any,
    html: {
        bem: jest.fn(),
        classNames: jest.fn(),
    } as any,
    http: {
        setAccessToken: jest.fn(),
        removeAccessToken: jest.fn(),
        onLogout: jest.fn(),
        onLogin: jest.fn(),
        send: jest.fn(),
        getAxiosConfig: jest.fn(),
        setCsrfToken: jest.fn(),
        getAccessToken: jest.fn(),
        resetConfig: jest.fn(),
        getUrl: jest.fn(),
        getAxiosInstance: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
        afterRequest: jest.fn(),
    } as any,
    locale: {
        language: 'ru',
        t: jest.fn(),
        dayjs: jest.fn(),
    } as any,
    store: {
        store: {},
        reducers: {},
        init: jest.fn(),
    } as any,
    ui: {
        icons: {},
        fields: {},
        formatters: {},
        addViews: jest.fn(),
        renderView: jest.fn(),
        getView: jest.fn(),
        addFields: jest.fn(),
        addFormatters: jest.fn(),
    } as any,
    meta: {
        setModel: jest.fn(),
        getModel: jest.fn(),
        setType: jest.fn(),
        getType: jest.fn(),
        normalizeName: jest.fn(),
        normalizeModel: jest.fn(),
    } as any,
    metrics: {
        unsubscribe: jest.fn(),
        unlisten: jest.fn(),
        setCounters: jest.fn(),
    } as any,
};

(componentsMock.ui as any).components = componentsMock;

export default componentsMock;
