/* eslint-disable no-unused-expressions */
import React, {useCallback, useRef, useState} from 'react';
import {useComponents, useDispatch} from '../../../hooks';

import {showNotification, IShowNotificationParameters} from '../../../actions/notifications';

export interface ICopyToClipboardProps extends IUiComponent {
    /**
    * Значение, которое будет установлено в буфер обмена
    * @example 'Steroids.js'
    */
    value: string,

    /**
    * Переводит состояние компонента в выключенное
    * @example true
    */
    disabled?: boolean,

    /**
    * Параметры для уведомления, которое появляется после копирования
    */
    notification?: string | {
        message?: string,
        level?: string,
        params?: IShowNotificationParameters,
    },

    /**
    * Позволяет включить или выключить отображение иконки
    * @example showCopyIcon: false
    */
    showCopyIcon?: boolean,

    /**
    * Иконка
    * @example calendar-day
    */
    icon?: string | React.ReactElement,

    /**
    * Дочерний элемент
    * @example <h1>This message will be copied!</h1>
    */
    children?: React.ReactNode,

    /**
    * Callback который вызывается при копировании
    */
    onCopy?: VoidFunction,
}

export interface ICopyToClipboardViewProps extends ICopyToClipboardProps {
    onClick: () => void,
}

const DEFAULT_NOTIFICATION_LEVEL = 'info';

function CopyToClipboard(props: ICopyToClipboardProps) {
    const components = useComponents();
    const [isCopied, setIsCopied] = useState(false);
    const dispatch = useDispatch();

    const {notification} = props;

    const onClick = useCallback(async () => {
        if (props.disabled) {
            return;
        }

        if (!isCopied) {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(props.value);

                if (props.onCopy) {
                    props.onCopy();
                }
            }
            if (notification) {
                typeof notification === 'string'
                    ? dispatch(showNotification(
                        notification,
                        DEFAULT_NOTIFICATION_LEVEL,
                    ))
                    : dispatch(showNotification(
                        notification.message,
                        notification.level || DEFAULT_NOTIFICATION_LEVEL,
                        notification.params,
                    ));
            }

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        }
    }, [dispatch, isCopied, notification, props]);

    return components.ui.renderView(props.view || 'content.CopyToClipboardView', {
        ...props,
        onClick,
    });
}

CopyToClipboard.defaultProps = {
    showCopyIcon: true,
};

export default CopyToClipboard;
