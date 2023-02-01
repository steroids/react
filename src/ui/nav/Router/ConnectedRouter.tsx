import * as React from 'react';
import {Router} from 'react-router';
import isEqualWith from 'lodash-es/isEqualWith';
import {onLocationChanged} from 'connected-react-router/lib/actions';
import createSelectors from 'connected-react-router/lib/selectors';
import structure from 'connected-react-router/lib/structure/plain';

interface IConnectedRouterProps {
    store?: any,
    history?: any,
}

export default class ConnectedRouter extends React.PureComponent<React.PropsWithChildren<IConnectedRouterProps>> {
    inTimeTravelling?: any;

    unsubscribe?: any;

    unlisten?: any;

    constructor(props) {
        super(props);

        const {store, history, stateCompareFunction} = props;

        this.inTimeTravelling = false;

        // Subscribe to store changes to check if we are in time travelling
        this.unsubscribe = store.subscribe(() => {
            // Extract store's location
            const {
                pathname: pathnameInStore,
                search: searchInStore,
                hash: hashInStore,
                state: stateInStore,
            } = createSelectors(structure).getLocation(store.getState());
            // Extract history's location
            const {
                pathname: pathnameInHistory,
                search: searchInHistory,
                hash: hashInHistory,
                state: stateInHistory,
            } = history.location;

            // If we do time travelling, the location in store is changed but location in history is not changed
            if (
                props.history.action === 'PUSH'
                && (pathnameInHistory !== pathnameInStore
                    || searchInHistory !== searchInStore
                    || hashInHistory !== hashInStore
                    || !isEqualWith(stateInStore, stateInHistory, stateCompareFunction))
            ) {
                this.inTimeTravelling = true;
                // Update history's location to match store's location
                history.push({
                    pathname: pathnameInStore,
                    search: searchInStore,
                    hash: hashInStore,
                    state: stateInStore,
                });
            }
        });

        const handleLocationChange = (location, action, isFirstRendering = false) => {
            // Dispatch onLocationChanged except when we're in time travelling
            if (!this.inTimeTravelling) {
                this.props.store.dispatch(onLocationChanged(location, action, isFirstRendering));
            } else {
                this.inTimeTravelling = false;
            }
        };

        // Listen to history changes
        this.unlisten = history.listen(handleLocationChange);

        if (!props.noInitialPop) {
            // Dispatch a location change action for the initial location.
            // This makes it backward-compatible with react-router-redux.
            // But, we add `isFirstRendering` to `true` to prevent double-rendering.
            handleLocationChange(history.location, history.action, true);
        }
    }

    componentWillUnmount() {
        this.unlisten();
        this.unsubscribe();
    }

    render() {
        return (
            <Router history={this.props.history}>
                {this.props.children}
            </Router>
        );
    }
}
