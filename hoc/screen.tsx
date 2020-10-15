import * as React from 'react';
import {connect} from 'react-redux';
import _isObject from 'lodash-es/isObject';
import {setWidth, setMedia} from '../actions/screen';
import {IConnectHocOutput} from './connect';

/**
 * Screen HOC
 * Компонент подписывается на изменения размера экрана и обновляет ее в Redux Store.
 */
export interface IScreenHocInput {

}

export interface IScreenHocOutput {

}

interface IScreenWatcherHocPrivateProps extends IConnectHocOutput {
}

export default (media): any => WrappedComponent =>
    connect()(
        class ScreenWatcherHoc extends React.PureComponent<IScreenHocInput & IScreenWatcherHocPrivateProps> {
            static WrappedComponent = WrappedComponent;
            /**
             * Proxy real name, prop types and default props for storybook
             */
            static displayName = WrappedComponent.displayName || WrappedComponent.name;

            constructor(props) {
                super(props);
                this._onResize = this._onResize.bind(this);
            }

            UNSAFE_componentWillMount() {
                if (typeof window !== 'undefined') {
                    this.props.dispatch(setWidth(window.innerWidth, true));
                    if (_isObject(media)) {
                        this.props.dispatch(setMedia(media));
                    }
                }
            }

            componentDidMount() {
                if (typeof window !== 'undefined') {
                    window.addEventListener('resize', this._onResize, false);
                }
            }

            componentWillUnmount() {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('resize', this._onResize);
                }
            }

            render() {
                return <WrappedComponent {...this.props} />;
            }

            _onResize() {
                this.props.dispatch(setWidth(window.innerWidth));
            }
        }
    )

