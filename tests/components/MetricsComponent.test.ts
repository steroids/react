import MetricsComponent from '../../src/components/MetricsComponent';

describe('MetricsComponent history listen', () => {
    let subscribeCallback: () => void;
    let historyListenCallback: (location: {pathname: string, search: string, hash: string}) => void;
    let componentsMock: any;

    beforeEach(() => {
        subscribeCallback = null;
        historyListenCallback = null;
        (window as any).ym = jest.fn();

        componentsMock = {
            store: {
                subscribe: jest.fn(cb => {
                    subscribeCallback = cb;
                    return jest.fn();
                }),
                getState: jest.fn(() => ({
                    auth: {
                        isInitialized: true,
                    },
                })),
                history: {
                    listen: jest.fn(cb => {
                        historyListenCallback = cb;
                    }),
                },
            },
        };
    });

    it('subscribes to history and forwards pathname+search+hash to the page view handler', () => {
        const metrics = new MetricsComponent(componentsMock, {
            enable: true,
            counters: {
                yandexMetrika: 'test-counter-id',
            },
        });

        jest.spyOn(metrics, 'setCounters').mockImplementation(() => {
            (metrics as any)._yandexMetrika = 'test-counter-id';
        });

        subscribeCallback();

        expect(componentsMock.store.history.listen).toHaveBeenCalledTimes(1);

        const changePageViewSpy = jest.spyOn(metrics as any, '_changePageViewHandler');

        historyListenCallback({
            pathname: '/documents',
            search: '?page=2',
            hash: '#section',
        });

        expect(changePageViewSpy).toHaveBeenCalledWith('/documents?page=2#section');
    });

    it('does not listen to history if metrics are disabled', () => {
        const metrics = new MetricsComponent(componentsMock, {
            enable: false,
            counters: {
                yandexMetrika: 'test-counter-id',
            },
        });

        jest.spyOn(metrics, 'setCounters').mockImplementation(() => {
            (metrics as any)._yandexMetrika = 'test-counter-id';
        });

        subscribeCallback();

        expect(componentsMock.store.history.listen).not.toHaveBeenCalled();
    });
});
