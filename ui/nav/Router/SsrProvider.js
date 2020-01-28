import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';

export default class SsrProvider extends React.PureComponent {

    static propTypes = {
        history: PropTypes.object,
        store: PropTypes.object,
        staticContext: PropTypes.object,
    };

    static childContextTypes = {
        history: PropTypes.object,
        staticContext: PropTypes.object,
    };

    getChildContext() {
        return {
            history: this.props.history,
            staticContext: this.props.staticContext,
        };
    }

    render() {
        return (
            <Provider store={this.props.store}>
                {this.props.children}
            </Provider>
        );
    }

}
