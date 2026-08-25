import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import useSelector from '../../src/hooks/useSelector';

interface IState {
    counter: {
        value: number,
    },
}

const initialState: IState = {
    counter: {
        value: 0,
    },
};

// eslint-disable-next-line default-param-last
function reducer(state: IState = initialState, action: any): IState {
    switch (action.type) {
        case 'INCREMENT':
            return {
                ...state,
                counter: {
                    value: state.counter.value + 1,
                },
            };
        case 'REPLACE_WITH_SHALLOW_EQUAL_SLICE':
            // New object reference, but shallow-equal to the previous `counter` slice
            return {
                ...state,
                counter: {
                    ...state.counter,
                },
            };
        default:
            return state;
    }
}

let renderCount = 0;

function CounterDisplay() {
    renderCount += 1;
    const counter = useSelector((state: IState) => state.counter);
    return <div data-testid='value'>{counter.value}</div>;
}

describe('hook useSelector', () => {
    beforeEach(() => {
        renderCount = 0;
    });

    it('reads the selected slice from the store through Provider context', () => {
        const store = createStore(reducer);

        render(
            <Provider store={store}>
                <CounterDisplay />
            </Provider>,
        );

        expect(screen.getByTestId('value')).toHaveTextContent('0');
    });

    it('re-renders when the selected slice changes', () => {
        const store = createStore(reducer);

        render(
            <Provider store={store}>
                <CounterDisplay />
            </Provider>,
        );

        act(() => {
            store.dispatch({
                type: 'INCREMENT',
            });
        });

        expect(screen.getByTestId('value')).toHaveTextContent('1');
    });

    it('does not re-render when the dispatch produces a shallow-equal but new object for the selected slice', () => {
        const store = createStore(reducer);

        render(
            <Provider store={store}>
                <CounterDisplay />
            </Provider>,
        );

        const renderCountAfterMount = renderCount;

        act(() => {
            store.dispatch({
                type: 'REPLACE_WITH_SHALLOW_EQUAL_SLICE',
            });
        });

        expect(renderCount).toBe(renderCountAfterMount);
        expect(screen.getByTestId('value')).toHaveTextContent('0');
    });
});
