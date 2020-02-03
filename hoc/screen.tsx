import * as React from 'react';
import {connect} from 'react-redux';
import _isObject from 'lodash/isObject';
import {setWidth, setMedia} from '../actions/screen';
import {Dispatch} from '../components/StoreComponent';

interface IScreenWatcherHocProps {
    dispatch: Dispatch,
}

export default (media): any => WrappedComponent =>
    connect()(
        class ScreenWatcherHoc extends React.PureComponent<IScreenWatcherHocProps> {
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

