import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import useDispatch from '../../src/hooks/useDispatch';

interface IState {
    count: number,
}

const initialState: IState = {
    count: 0,
};

// eslint-disable-next-line default-param-last
function reducer(state: IState = initialState, action: any): IState {
    switch (action.type) {
        case 'INCREMENT':
            return {
                count: state.count + 1,
            };
        default:
            return state;
    }
}

let capturedDispatch: any;

function DispatchProbe() {
    capturedDispatch = useDispatch();
    return null;
}

describe('hook useDispatch', () => {
    beforeEach(() => {
        capturedDispatch = undefined;
    });

    it('returns the same function reference as store.dispatch', () => {
        const store = createStore(reducer);

        render(
            <Provider store={store}>
                <DispatchProbe />
            </Provider>,
        );

        expect(capturedDispatch).toBe(store.dispatch);
    });

    it('dispatching through it updates the store state', () => {
        const store = createStore(reducer);

        render(
            <Provider store={store}>
                <DispatchProbe />
            </Provider>,
        );

        act(() => {
            capturedDispatch({
                type: 'INCREMENT',
            });
        });

        expect(store.getState().count).toBe(1);
    });
});
