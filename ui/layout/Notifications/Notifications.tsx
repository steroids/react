import * as React from 'react';
import {connect} from 'react-redux';
import {components, theme} from '../../../hoc';
import {
    setFlashes,
    setClosing,
    closeNotification
} from '../../../actions/notifications';
import {getNotifications} from '../../../reducers/notifications';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';

interface INotificationItem {
    id?: number,
    level?: ColorName,
    message?: string,
    isClosing?: boolean
}

export interface INotificationsProps {
    initialFlashes?: {
        [key: string]: string | any,
    };
    notifications?: INotificationItem[];
    className?: string;
    view?: any;
    itemView?: any;
}

export interface INotificationsViewProps {
    notifications?: INotificationItem[];
}

export interface INotificationsItemViewProps extends INotificationItem {
    onClosing: (notificationId: number) => void,
    onClose: (notificationId: number) => void,
}

interface INotificationsPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

@connect(state => ({
    notifications: getNotifications(state)
}))
@theme()
@components('ui')
export default class Notifications extends React.PureComponent<INotificationsProps & INotificationsPrivateProps> {

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
