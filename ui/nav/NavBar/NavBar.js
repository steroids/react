import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {components} from '../../../hoc';
import {setFlashes, setClosing, closeNotification} from '../../../actions/notifications';
import {getNotifications} from '../../../reducers/notifications';

@connect(
    state => ({
        notifications: getNotifications(state),
    })
)
@components('ui')
export default class NavBar extends React.PureComponent {

    static propTypes = {
        initialFlashes: PropTypes.object,
        notifications: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            level: PropTypes.oneOf([
                'primary',
                'secondary',
                'success',
                'danger',
                'warning',
                'info',
                'light',
                'dark',
            ]),
            message: PropTypes.string,
            isClosing: PropTypes.bool,
        })),
        className: PropTypes.string,
        view: PropTypes.elementType,
        itemView: PropTypes.elementType,
    };

    componentDidMount() {
        if (this.props.initialFlashes) {
            this.props.dispatch(setFlashes(this.props.initialFlashes));

            // Disable scroll or scroll to top on show notifications
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            } else {
                setTimeout(() => window.scrollTo(0, 0), 1000);
            }
        }
    }

    render() {
        const NotificationsView = this.props.view || this.props.ui.getView('layout.NotificationsView');
        const NotificationsItemView = this.props.itemView || this.props.ui.getView('layout.NotificationsItemView');

        return (
            <NotificationsView {...this.props}>
                {this.props.notifications.map(notification => (
                    <NotificationsItemView
                        {...notification}
                        key={notification.id}
                        onClosing={this._onClosing.bind(this, notification.id)}
                        onClose={this._onClose.bind(this, notification.id)}
                    />
                ))}
            </NotificationsView>
        );
    }

    _onClosing(notificationId) {
        this.props.dispatch(setClosing(notificationId));
    }

    _onClose(notificationId) {
        this.props.dispatch(closeNotification(notificationId));
    }

}
