import * as React from 'react';
import _orderBy from 'lodash-es/orderBy';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useMount, usePrevious, useUpdateEffect} from 'react-use';
import useDispatch from '../../../hooks/useDispatch';
import {useComponents, useSelector} from '../../../hooks';
import {setFlashes, closeNotification} from '../../../actions/notifications';
import {getNotifications, getPosition} from '../../../reducers/notifications';

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
    children?: React.ReactNode,
}

export interface INotificationsItemViewProps extends INotificationItem {
    isClosing: boolean;
    onClose: () => void;
    position: string;
}

function Notifications(props:INotificationsProps): JSX.Element {
    const {notifications, position} = useSelector(state => ({
        notifications: getNotifications(state),
        position: getPosition(state),
    }));

    const components = useComponents();
    const [innerNotifications, setInnerNotifications] = useState(props.notifications || []);
    const [closing, setClosing] = useState([]);

    const dispatch = useDispatch();
    useMount(() => {
        if (props.initialFlashes) {
            dispatch(setFlashes(props.initialFlashes));

            // Disable scroll or scroll to top on show notifications
            if (typeof window !== 'undefined') {
                if ('scrollRestoration' in window.history) {
                    window.history.scrollRestoration = 'manual';
                } else {
                    setTimeout(() => window.scrollTo(0, 0), 1000);
                }
            }
        }
    });

    const prevNotifications = usePrevious(notifications);
    useUpdateEffect(() => {
        if (prevNotifications !== notifications) {
            const propsIds: number[] = notifications.map(item => item.id);
            const toClose: INotificationItem[] = innerNotifications.filter(item => !propsIds.includes(item.id));

            setInnerNotifications([].concat(notifications));
            setClosing(closing.concat(innerNotifications.filter(item => !propsIds.includes(item.id))));

            if (toClose.length > 0) {
                setTimeout(() => setClosing(closing.filter(item => !toClose.includes(item))), props.closeTimeoutMs);
            }
        }
    }, [closing, innerNotifications, notifications, prevNotifications, props.closeTimeoutMs]);

    const onClose = useCallback(
        notificationId => dispatch(closeNotification(notificationId)),
        [dispatch],
    );

    const closingIds = closing.map(item => item.id);

    const items = useMemo(() => (
        _orderBy([].concat(innerNotifications).concat(closing), ['id'], 'asc')
            .map(item => ({
                ...item,
                isClosing: closingIds.includes(item.id),
                onClose: () => onClose(item.id),
            }))
    ),
    [innerNotifications, closing, closingIds, onClose]);

    const NotificationsItemView = props.itemView || components.ui.getView('layout.NotificationsItemView');
    return components.ui.renderView(props.view || 'layout.NotificationsView', {
        ...props,
        position: position || '',
        children: items.map(item => (
            <NotificationsItemView
                key={item.id}
                {...item}
            />
        )),
    });
}

Notifications.defaultProps = {
    closeTimeoutMs: 1500,
};

export default Notifications;
