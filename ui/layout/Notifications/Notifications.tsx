import * as React from 'react';
import {connect} from 'react-redux';
import {components, theme} from '../../../hoc';
import {
    setFlashes,
    closeNotification
} from '../../../actions/notifications';
import {getNotifications, getPosition} from '../../../reducers/notifications';
import {IConnectHocOutput} from '../../../hoc/connect';
import {IComponentsHocOutput} from '../../../hoc/components';
import _orderBy from 'lodash-es/orderBy';

interface INotificationItem {
    id?: number,

    /**
     * Цвет всплывающего уведомления
     * @example warning
     */
    level?: ColorName,

    /**
     * Сообщение во всплывающем уведомлении
     * @example Сохранено!
     */
    message?: string,
    isClosing?: boolean
}

export interface INotificationsProps {
    initialFlashes?: {
        [key: string]: string | any,
    };
    notifications?: INotificationItem[];
    closeTimeoutMs?: number;
    className?: CssClassName;
    view?: any;
    itemView?: any;
    position?: string;
    [key: string]: any;
}

export interface INotificationsViewProps {
    notifications?: INotificationItem[];
    className?: CssClassName;
    position: string;
}

export interface INotificationsItemViewProps extends INotificationItem {
    isClosing: boolean;
    onClose: () => void;
    position: string;
}

interface INotificationsPrivateProps extends IConnectHocOutput, IComponentsHocOutput {

}

interface INotificationsState  {
    notifications: INotificationItem[];
    closing: INotificationItem[];
    position: string;
}

@connect(state => ({
    notifications: getNotifications(state),
    position: getPosition(state)
}))
@theme()
@components('ui')
export default class Notifications extends React.PureComponent<INotificationsProps & INotificationsPrivateProps, INotificationsState> {

    static defaultProps = {
        closeTimeoutMs: 1500,
    };

    constructor(props) {
        super(props);

        this.state = {
            notifications: [].concat(this.props.notifications),
            closing: [],
            position: this.props.position
        };
    }

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

    componentDidUpdate(prevProps: INotificationsProps & INotificationsPrivateProps) {
        if (prevProps.notifications !== this.props.notifications) {
            const propsIds: number[] = this.props.notifications.map(item => item.id);
            const toClose: INotificationItem[] = this.state.notifications.filter(item => !propsIds.includes(item.id));

            this.setState({
                notifications: [].concat(this.props.notifications),
                closing: this.state.closing.concat(this.state.notifications.filter(item => !propsIds.includes(item.id))),
            });

            if (toClose.length > 0) {
                setTimeout(() => {
                    this.setState({
                        closing: (this.state.closing).filter(item => !toClose.includes(item)),
                    });
                }, this.props.closeTimeoutMs);
            }
        }
    }

    render() {
        const NotificationsView = this.props.view || this.props.ui.getView('layout.NotificationsView');
        const NotificationsItemView = this.props.itemView || this.props.ui.getView('layout.NotificationsItemView');

        const closingIds = this.state.closing.map(item => item.id);
        const notifications = _orderBy([].concat(this.state.notifications).concat(this.state.closing),['id'],'asc') ;

        return (
            <NotificationsView {...this.props}>
                {notifications.map(notification => (
                    <NotificationsItemView
                        {...notification}
                        key={notification.id}
                        position={notification.position}
                        isClosing={closingIds.includes(notification.id)}
                        onClose={this._onClose.bind(this, notification.id)}
                    />
                ))}
            </NotificationsView>
        );
    }

    _onClose(notificationId) {
        this.props.dispatch(closeNotification(notificationId));
    }
}
