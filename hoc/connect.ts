//import {connect} from 'react-redux';
import multi from './multi';
import components from './components';
import Hoc from '../base/Hoc';
import {IBemHocInput, IBemHocPrivateProps} from './bem';

export type Dispatch = (any) => any;

/**
 * Connect HOC
 * Обертка над `connect()` из `react-redux` для упрощения импорта.
 */
export interface IConnectHocInput {
}

export interface IConnectHocOutput {
    dispatch?: Dispatch,
}

//export default require('react-redux').connect;

export default (mapStateToProps = null): any => WrappedComponent =>
    multi()(
        components()(
            class ConnectHoc extends Hoc<IBemHocInput & IBemHocPrivateProps> {
                static WrappedComponent = WrappedComponent;
                _reduxUnsubscribe: any;

                componentDidMount(): void {
                    if (!this._reduxUnsubscribe) {
                        if (this.props.components?.store) {
                            this._reduxUnsubscribe = this.props.components.store.subscribe(() => {
                                this.forceUpdate();
                            });
                        } else {
                            console.error('Not found store in connect()');
                        }
                    }
                }

                componentWillUnmount(): void {
                    if (this._reduxUnsubscribe) {
                        this._reduxUnsubscribe();
                    }
                }

                getProps() {
                    const newProps = this.props.components?.store && mapStateToProps
                        ? mapStateToProps(this.props.components.store.getState(), this.props)
                        : null;
                    if (!newProps && this.props['dispatch']) {
                        return this.props;
                    }

                    return {
                        ...this.props,
                        ...newProps,
                        dispatch: this.props.components.store.dispatch,
                    };
                }
            }
        )
    )
/**/