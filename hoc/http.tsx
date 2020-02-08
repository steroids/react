import * as React from 'react';
import axios from 'axios';
import _isFunction from 'lodash-es/isFunction';
import _isObject from 'lodash-es/isObject';
import components, {IComponentsHocInput} from './components';

export interface IHttpHocInput {
}

export interface IHttpHocOutput {
    fetch: (params: object) => Promise<any> | any,
}

interface IHttpHocPrivateProps extends IComponentsHocInput {
}

interface IHttpHocState {
    data?: any,
}

export default (requestFunc): any => WrappedComponent =>
    components()(
        class HttpHoc extends React.PureComponent<IHttpHocInput & IHttpHocPrivateProps, IHttpHocState> {
            static WrappedComponent = WrappedComponent;

            _isRendered = false;
            _cancels = [];

            constructor(props) {
                super(props);

                this._fetch = this._fetch.bind(this);
                this._createCancelToken = this._createCancelToken.bind(this);

                this.state = {
                    data: null,
                };
            }

            UNSAFE_componentWillMount() {
                this._fetch();
            }

            componentDidMount() {
                this._isRendered = true;
            }

            componentWillUnmount() {
                this._isRendered = false;
                this._cancels.forEach(cancel =>
                    cancel('Canceled on unmount component')
                );
            }

            render() {
                const outputProps = {
                    fetch: this._fetch,
                } as IHttpHocOutput;
                return (
                    <WrappedComponent
                        {...this.props}
                        {...this.state.data}
                        {...outputProps}
                    />
                );
            }

            _createCancelToken() {
                return new axios.CancelToken(cancel => {
                    this._cancels.push(cancel);
                });
            }

            _fetch(params = {}) {
                const result = requestFunc({
                    ...this.props,
                    ...params,
                    createCancelToken: this._createCancelToken
                });
                if (_isObject(result)) {
                    if (_isFunction(result.then)) {
                        return result.then(data => {
                            if (this._isRendered) {
                                this.setState({data});
                            }
                            return data;
                        });
                    } else {
                        this.setState({data: result});
                    }
                }
                return result;
            }
        }
    )

