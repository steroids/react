let ID_COUNTER = 0;
export const NOTIFICATIONS_SHOW = 'NOTIFICATIONS_SHOW';
export const NOTIFICATIONS_CLOSING = 'NOTIFICATIONS_CLOSING';
export const NOTIFICATIONS_CLOSE = 'NOTIFICATIONS_CLOSE';

export interface IShowNotificationParameters {
    position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | string;
    timeOut?: number;
}

const showNotificationDefaults: IShowNotificationParameters = {
    position: 'top-right',
    timeOut: 10000,
};

export const showNotification = (message: string, level: ColorName = 'success', params: IShowNotificationParameters = {}) => dispatch => {
    const {position, timeOut} = {...showNotificationDefaults, ...params} as IShowNotificationParameters;
    const id = ++ID_COUNTER;

    dispatch({ type: NOTIFICATIONS_SHOW, id, message, level, position});

    if(timeOut > 0){
        setTimeout(() => dispatch(closeNotification(id)), timeOut);
    }
};

export const closeNotification = (id = null) => ({
    type: NOTIFICATIONS_CLOSE,
    id
});

export const setFlashes = flashes =>
    Object.keys(flashes).map((level: string) => {
        return []
            .concat(flashes[level] || [])
            .map(message => showNotification(message, level));
    });
