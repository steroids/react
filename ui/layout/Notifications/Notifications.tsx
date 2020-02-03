import * as React from 'react';
import {connect} from 'react-redux';
import {components} from '../../../hoc';
import {
    setFlashes,
    setClosing,
    closeNotification
} from '../../../actions/notifications';
import {getNotifications} from '../../../reducers/notifications';

interface INotificationsProps {
    initialFlashes?: any;
    notifications?: {
        id?: number,
        level?:
            | 'primary'
            | 'secondary'
            | 'success'
            | 'danger'
            | 'warning'
            | 'info'
            | 'light'
            | 'dark',
        message?: string,
        isClosing?: boolean
    }[];
    className?: string;
    view?: any;
    itemView?: any;
    dispatch?: any;
    map?: any;
    getView?: any;
    ui?: any;
}

@connect(state => ({
    notifications: getNotifications(state)
}))
@components('ui')
export default class Notifications extends React.PureComponent<INotificationsProps,
    {}> {
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
        const NotificationsView =
            this.props.view || this.props.ui.getView('layout.NotificationsView');
        const NotificationsItemView =
            this.props.itemView ||
            this.props.ui.getView('layout.NotificationsItemView');
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
