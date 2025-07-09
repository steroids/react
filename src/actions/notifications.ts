import _uniqueId from 'lodash-es/uniqueId';

export const NOTIFICATIONS_SHOW = 'NOTIFICATIONS_SHOW';
export const NOTIFICATIONS_CLOSING = 'NOTIFICATIONS_CLOSING';
export const NOTIFICATIONS_CLOSE = 'NOTIFICATIONS_CLOSE';

export interface IShowNotificationParameters {
    position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | string,
    timeOut?: number,
}

const showNotificationDefaults: IShowNotificationParameters = {
    position: 'top-right',
    timeOut: 10000,
};

export const closeNotification = (id: string | null = null) => ({
    type: NOTIFICATIONS_CLOSE,
    id,
});

export const showNotification = (
    message: string,
    // eslint-disable-next-line default-param-last
    level: ColorName = null,
    params?: IShowNotificationParameters,
) => dispatch => {
    const {position, timeOut} = {
        ...showNotificationDefaults,
        ...params,
    } as IShowNotificationParameters;
    const id = _uniqueId();

    dispatch({
        type: NOTIFICATIONS_SHOW,
        id,
        message,
        level: level || 'success',
        position,
    });

    if (timeOut > 0) {
        setTimeout(() => dispatch(closeNotification(id)), timeOut);
    }
};

export const setFlashes = flashes => Object.keys(flashes).map((level: string) => []
    .concat(flashes[level] || [])
    .map(message => showNotification(message, level)));
