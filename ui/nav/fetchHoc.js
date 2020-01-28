import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {navigationAddConfigs, navigationRemoveConfigs, getConfigId} from '../../actions/navigation';
import {getCurrentRoute} from '../../reducers/navigation';

const stateMap = state => ({
    navigationData: state.navigation && state.navigation.data || null,
    route: getCurrentRoute(state),
});

export default (configsFunc, options = {}) => WrappedComponent => @connect(stateMap)
    class FetchHoc extends React.PureComponent {

    static WrappedComponent = WrappedComponent;

    /**
     * Proxy real name, prop types and default props for storybook
     */
    static displayName = WrappedComponent.displayName || WrappedComponent.name;

    static propTypes = {
        navigationData: PropTypes.object,
        route: PropTypes.shape({
            params: PropTypes.object,
        }),
    };

    constructor() {
        super(...arguments);

        this.state = {
            overwritedProps: null,
        };

        this._onUpdate = this._onUpdate.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(navigationAddConfigs(configsFunc({
            ...this.props,
            ...this.state.overwritedProps,
            params: this.props.route.params,
        })));
    }

    componentWillUnmount() {
        this.props.dispatch(navigationRemoveConfigs(configsFunc({
            ...this.props,
            ...this.state.overwritedProps,
            params: this.props.route.params,
        })));
    }

    componentDidUpdate(prevProps, prevState) {
        const prevConfigs = [].concat(configsFunc({
            ...prevProps,
            ...prevState.overwritedProps,
            params: prevProps.route.params,
        }));
        const nextConfigs = [].concat(configsFunc({
            ...this.props,
            ...this.state.overwritedProps,
            params: this.props.route.params,
        }));
        for (let i = 0; i < Math.max(prevConfigs.length, nextConfigs.length); i++) {
            if (getConfigId(prevConfigs[i]) !== getConfigId(nextConfigs[i])) {
                this.props.dispatch([
                    navigationRemoveConfigs(prevConfigs[i]),
                    navigationAddConfigs(nextConfigs[i]),
                ]);
            }
        }
    }

    render() {
        let isLoading = !this.props.navigationData;
        let dataProps = {};
        const configs = [].concat(configsFunc({
            ...this.props,
            ...this.state.overwritedProps,
            params: this.props.route.params,
        }));
        if (this.props.navigationData) {
            configs.forEach(config => {
                const dataItem = this.props.navigationData[getConfigId(config)];
                if (dataItem) {
                    if (config.key) {
                        dataProps[config.key] = dataItem;
                    } else {
                        dataProps = {...dataProps, ...dataItem};
                    }
                } else {
                    isLoading = true;
                }
            });
        }

        if (isLoading && options.waitLoading !== false) {
            // TODO Loader
            return null;
        }

        return (
            <WrappedComponent
                {...this.props}
                {...this.state.overwritedProps}
                {...dataProps}
                updateApiConfig={this._onUpdate}
            />
        );
    }

    _onUpdate(overwritedProps) {
        this.setState({overwritedProps});
    }

};
