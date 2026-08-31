import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';

import StoreComponent from '../../../../src/components/StoreComponent';
import ComponentsProvider from '../../../../src/providers/ComponentsProvider';
import SsrProvider from '../../../../src/providers/SsrProvider';
import reducers from '../../../../src/reducers/index';
import Router from '../../../../src/ui/nav/Router';

// Pins the full SsrProvider -> Router.tsx `<StaticRouter context=...>` integration:
// react-router v5's StaticRouter records navigation by mutating the plain `context`
// object passed in from the host app, which is read back after renderToString to
// decide the response status code. This integration point (StaticRouter's `context`
// prop) has no v6 equivalent and is removed in MR2, so this pins today's exact
// mutation shape (`context.action`/`context.url`) as the truth table for whatever
// replaces it.
describe('Router SSR integration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = {
            ...originalEnv,
            IS_SSR: 'true',
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    const renderSsr = (routes, staticContext, initialEntries = ['/']) => {
        const store = new StoreComponent({} as any, {
            reducers,
            history: {
                initialEntries,
            },
        } as any);
        const components = {
            store,
        };

        return render(
            <Provider store={store.store}>
                <ComponentsProvider components={components}>
                    <SsrProvider staticContext={staticContext}>
                        <Router
                            wrapperView='test-wrapper'
                            routes={routes}
                        />
                    </SsrProvider>
                </ComponentsProvider>
            </Provider>,
        );
    };

    it('renders the matched page through StaticRouter without touching the static context', () => {
        const pageText = 'SSR page content';
        const staticContext: any = {};

        const {getByText} = renderSsr({
            id: 'home',
            path: '/',
            exact: true,
            component: () => <div>{pageText}</div>,
        }, staticContext);

        expect(getByText(pageText)).toBeInTheDocument();
        expect(staticContext.url).toBeUndefined();
        expect(staticContext.action).toBeUndefined();
    });

    it('mutates the static context with the redirect target when a redirectTo route matches', () => {
        // <Redirect> only records the navigation on the static context (via history.replace,
        // which StaticRouter intercepts) - it does not re-render the matched target's content,
        // since StaticRouter can't actually change location. This is exactly why the host app
        // must read `context.url` after renderToString instead of inspecting the rendered markup.
        const targetText = 'SSR redirect target';
        const staticContext: any = {};

        renderSsr({
            id: 'home',
            path: '/',
            exact: true,
            redirectTo: '/target',
            items: [
                {
                    id: 'target',
                    path: '/target',
                    component: () => <div>{targetText}</div>,
                },
            ],
        }, staticContext);

        expect(staticContext.action).toBe('REPLACE');
        expect(staticContext.url).toBe('/target');
    });
});
