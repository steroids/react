import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import _uniqueId from 'lodash-es/uniqueId';

export type TNotificationsStore = {
    items: any[];
    position: string;
 };

export interface IShowNotificationParameters {
    position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | string;
    timeOut?: number;
}

const showNotificationDefaults: IShowNotificationParameters = {
    position: 'top-right',
    timeOut: 3000,
};

// Отдельный store для уведомлений. Не требует подключения через провайдер, можно сразу использовать в компонентах
// Для подключения дополнительных store в проекте не требуется комбинировать редьюсеры
export const useNotificationsStore = create<TNotificationsStore>()(
    // использование immer позволяет не клонировать предыдущие вложенные состояния. (кстати, его можно использовать и с redux)
    immer(() => ({
        items: [],
        position: '',
    })),
);

export const closeNotification = (id: string) => {
    useNotificationsStore.setState(state => ({
        // не требуется строка ...state, потому что состояние копируется под капотом функции setState
        items: state.items.filter(item => item.id !== id),
    }));
};

// такие функции также можно объявить внутри useNotificationsStore
export const showNotification = (
    message: string,
    level: ColorName = null,
    params: IShowNotificationParameters = showNotificationDefaults,
) => {
    const {position, timeOut} = params as IShowNotificationParameters;
    const id = _uniqueId();

    useNotificationsStore.setState(state => ({
        items: [
            ...state.items,
            {
                id,
                level: level || 'info',
                message,
                isClosing: false,
                position,
            },
        ],
        position,
    }));

    if (timeOut > 0) {
        setTimeout(() => closeNotification(id), timeOut);
    }
};
