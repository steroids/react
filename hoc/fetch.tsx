import * as React from 'react';
import {connect} from 'react-redux';
import {navigationAddConfigs, navigationRemoveConfigs, getConfigId} from '../actions/router';
import {getRouteParams} from '../reducers/router';
import {IConnectHocOutput} from './connect';

export type IFetchHocConfig = (props: any) => object | object[];

interface IFetchHocInput {
    navigationData?: object,
    routeParams?: object,
}

interface IFetchHocOutput {
}

interface IFetchHocPrivateProps extends IConnectHocOutput {

}

interface IFetchHocState {
    overwriteProps?: any,
}

interface IFetchHocOptions {
    waitLoading?: any,
}

const stateMap = state => ({
    navigationData: (state.navigation && state.navigation.data) || null,
    routeParams: getRouteParams(state)
});
export default (configsFunc: IFetchHocConfig, options = {} as IFetchHocOptions): any => WrappedComponent =>
    connect(stateMap)(
        class FetchHoc extends React.PureComponent<IFetchHocInput & IFetchHocPrivateProps, IFetchHocState> {

            static WrappedComponent = WrappedComponent;

            constructor(props) {
                super(props);
                this.state = {
                    overwriteProps: null
                };
                this._onUpdate = this._onUpdate.bind(this);
            }

            UNSAFE_componentWillMount() {
                this.props.dispatch(
                    navigationAddConfigs(
                        configsFunc({
                            ...this.props,
                            ...this.state.overwriteProps,
                            params: this.props.routeParams
                        })
                    )
                );
            }

            componentWillUnmount() {
                this.props.dispatch(
                    navigationRemoveConfigs(
                        configsFunc({
                            ...this.props,
                            ...this.state.overwriteProps,
                            params: this.props.routeParams
                        })
                    )
                );
            }

            componentDidUpdate(prevProps, prevState) {
                const prevConfigs = [].concat(
                    configsFunc({
                        ...prevProps,
                        ...prevState.overwriteProps,
                        params: prevProps.routeParams
                    })
                );
                const nextConfigs = [].concat(
                    configsFunc({
                        ...this.props,
                        ...this.state.overwriteProps,
                        params: this.props.routeParams
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
                        ...this.state.overwriteProps,
                        params: this.props.routeParams
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

                const outputProps = {
                    ...this.props,
                    ...this.state.overwriteProps,
                    ...dataProps,
                    updateApiConfig: this._onUpdate,
                } as IFetchHocOutput;

                return (
                    <WrappedComponent {...outputProps}/>
                );
            }

            _onUpdate(overwriteProps) {
                this.setState({overwriteProps});
            }
        }
    )
