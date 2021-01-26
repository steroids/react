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

let connectHoc;

if (process.env.APP_MULTI_HOC) {
    const shallowEqual = require('react-redux/lib/utils/shallowEqual').default;
    connectHoc = (mapStateToProps = null, listenedReducers: string[] = null): any => WrappedComponent =>
        multi()(
            components()(
                class ConnectHoc extends Hoc<IBemHocInput & IBemHocPrivateProps> {
                    static WrappedComponent = WrappedComponent;
                    _reduxUnsubscribe: any;
                    _state: any;

                    constructor(props) {
                        super(props);

                        this._state = null;

                        if (!this._reduxUnsubscribe && mapStateToProps) {
                            if (this.props.components.store) {
                                this._reduxUnsubscribe = this.props.components.store.subscribe(() => {
                                    /*if (listenedReducers && this.props.components.store.lastAction) {
                                        let lastAction = this.props.components.store.lastAction
                                            .replace('redux-form', 'form')
                                            .replace(/^@*([a-z-]+).*$/i, '$1');
                                        console.log(24652435, listenedReducers, lastAction)
                                        if (lastAction && !listenedReducers.includes(lastAction)) {
                                            return;
                                        }
                                    }*/

                                    //const t = performance.now();
                                    const newState = mapStateToProps(this.props.components.store.getState(), this.props);
                                    const hasChanges = !shallowEqual(this._state, newState);
                                    //window['t'] = (window['t'] || 0) + (performance.now() - t);

                                    if (hasChanges) {
                                        this._state = newState;
                                        this.forceUpdate();
                                    }
                                });
                            } else {
                                console.error('Not found store in connect()');
                            }
                        }
                    }

                    componentWillUnmount(): void {
                        this._state = null;
                        if (this._reduxUnsubscribe) {
                            this._reduxUnsubscribe();
                        }
                    }

                    _getProps() {
                        if (!mapStateToProps && this.props['dispatch']) {
                            return this.props;
                        }

                        if (mapStateToProps && this.props.components.store && this._state === null) {
                            this._state = mapStateToProps(this.props.components.store.getState(), this.props);
                        }

                        return {
                            ...this.props,
                            ...this._state,
                            dispatch: this.props.components.store.dispatch,
                        };
                    }
                }
            )
        );
} else {
    connectHoc = (mapStateToProps = undefined, mapDispatchToProps = undefined, mergeProps = undefined, options = undefined) => {
        if (Array.isArray(mapDispatchToProps)) {
            mapDispatchToProps = undefined;
        }
        return require('react-redux').connect(mapStateToProps, mapDispatchToProps, mergeProps, options);
    };
}

export default connectHoc;