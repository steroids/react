/* eslint-disable no-unused-expressions */
import React, {useCallback, useMemo, useState} from 'react';
import {useComponents, useDispatch} from '../../../hooks';
import {showNotification, IShowNotificationParameters} from '../../../actions/notifications';

/**
 * CopyToClipboard
 *
 * Компонент, позволяющий копировать заданное значение в буфер обмена при клике.
 *
 * Компонент `CopyToClipboard` принимает значение `value` для копирования, а также
 * может отображать иконку, дополнительный текст или другие дочерние элементы.
 *
 * При успешном копировании значения, можно также отобразить уведомление с помощью
 * параметра `notification`. Можно задать текст уведомления, его уровень и параметры.
 *
 * Компонент также поддерживает обработчик `onCopy`, который вызывается при копировании.
 */
export interface ICopyToClipboardProps extends IUiComponent {

    /**
    * Значение, которое будет использоваться при копировании
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
    * @example
    * 'Some value has been copied to buffer'
    * @example
    * {
    *   message: 'Some value has been copied to buffer',
    *   level: 'info',
    *   params: {
    *     position: 'top-left',
    *     timeOut: 100,
    *   }
    * }
    */
    notification?: string | {
        message?: string,
        level?: string,
        params?: IShowNotificationParameters,
    },

    /**
    * Позволяет включить или выключить отображение иконки
    * @example false
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

    const viewProps = useMemo(() => ({
        disabled: props.disabled,
        showCopyIcon: props.showCopyIcon,
        icon: props.icon,
        children: props.children,
        className: props.className,
        style: props.style,
        onClick,
    }), [onClick, props.children, props.className, props.disabled, props.icon, props.showCopyIcon, props.style]);

    return components.ui.renderView(props.view || 'content.CopyToClipboardView', viewProps);
}

CopyToClipboard.defaultProps = {
    showCopyIcon: true,
};

export default CopyToClipboard;
