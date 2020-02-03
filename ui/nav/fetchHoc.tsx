import * as React from 'react';
import {connect} from 'react-redux';
import {
    navigationAddConfigs,
    navigationRemoveConfigs,
    getConfigId
} from '../../actions/navigation';
import {getCurrentRoute} from '../../reducers/navigation';
import {IConnectProps} from '../../components/StoreComponent';

interface IFetchHocProps extends IConnectProps {
    /*
      navigationData: PropTypes.object,
      route: PropTypes.shape({
          params: PropTypes.object
      })
     */
    navigationData?: any,
    route?: any,
}

interface IFetchHocState {
    overwritedProps?: any,
}

interface IFetchHocOptions {
    waitLoading?: any,
}

const stateMap = state => ({
    navigationData: (state.navigation && state.navigation.data) || null,
    route: getCurrentRoute(state)
});
export default (configsFunc, options = {} as IFetchHocOptions): any => WrappedComponent =>
    connect(stateMap)(
        class FetchHoc extends React.PureComponent<IFetchHocProps, IFetchHocState> {
            static WrappedComponent = WrappedComponent;

            constructor(props) {
                super(props);
                this.state = {
                    overwritedProps: null
                };
                this._onUpdate = this._onUpdate.bind(this);
            }

            UNSAFE_componentWillMount() {
                this.props.dispatch(
                    navigationAddConfigs(
                        configsFunc({
                            ...this.props,
                            ...this.state.overwritedProps,
                            params: this.props.route.params
                        })
                    )
                );
            }

            componentWillUnmount() {
                this.props.dispatch(
                    navigationRemoveConfigs(
                        configsFunc({
                            ...this.props,
                            ...this.state.overwritedProps,
                            params: this.props.route.params
                        })
                    )
                );
            }

            componentDidUpdate(prevProps, prevState) {
                const prevConfigs = [].concat(
                    configsFunc({
                        ...prevProps,
                        ...prevState.overwritedProps,
                        params: prevProps.route.params
                    })
                );
                const nextConfigs = [].concat(
                    configsFunc({
                        ...this.props,
                        ...this.state.overwritedProps,
                        params: this.props.route.params
                    })
                );
                for (
                    let i = 0;
                    i < Math.max(prevConfigs.length, nextConfigs.length);
                    i++
                ) {
                    if (getConfigId(prevConfigs[i]) !== getConfigId(nextConfigs[i])) {
                        this.props.dispatch([
                            navigationRemoveConfigs(prevConfigs[i]),
                            navigationAddConfigs(nextConfigs[i])
                        ]);
                    }
                }
            }

            render() {
                let isLoading = !this.props.navigationData;
                let dataProps = {};
                const configs = [].concat(
                    configsFunc({
                        ...this.props,
                        ...this.state.overwritedProps,
                        params: this.props.route.params
                    })
                );
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
        }
    )
