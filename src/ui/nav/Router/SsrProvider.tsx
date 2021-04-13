import * as React from 'react';
import {Provider} from 'react-redux';

interface ISsrProviderContext {
    history?: any;
    staticContext?: any;
}

export const SsrProviderContext = React.createContext<ISsrProviderContext>(null);

interface ISsrProviderProps {
    history?: any;
    store?: any;
    staticContext?: any;
}

export default class SsrProvider extends React.PureComponent<ISsrProviderProps> {
    render() {
        return (
            <SsrProviderContext.Provider
                value={{
                    history: this.props.history,
                    staticContext: this.props.staticContext,
                }}
            >
                <Provider store={this.props.store}>
                    {this.props.children}
                </Provider>
            </SsrProviderContext.Provider>
        );
    }
}
