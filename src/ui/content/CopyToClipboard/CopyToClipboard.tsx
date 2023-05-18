/* eslint-disable no-unused-expressions */
import React, {useCallback, useRef, useState} from 'react';
import {useComponents, useDispatch} from '../../../hooks';

import {showNotification, IShowNotificationParameters} from '../../../actions/notifications';

export interface ICopyToClipboardProps extends IUiComponent {

    /**
    * Значение, которое будет использоваться при копировании
    * @example value: 'Steroids.js'
    */
    value: string,

    /**
    * Флаг, который отвечает за выключение функции копирования
    * @example disabled: false
    */
    disabled?: boolean,

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
    * Callback функция, которая вызывается при копировании
    * @example {}
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
