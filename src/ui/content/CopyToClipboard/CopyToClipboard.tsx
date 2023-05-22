import React, {useCallback, useRef, useState} from 'react';
import useDispatch from '../../../hooks/useDispatch';

import {showNotification} from '../../../actions/notifications';

interface ICopyToClipboardProps extends IUiComponent {
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
        timeOut?: string,
    },

    /**
     * Дочерние элементы
     */
    children?: React.ReactNode,
}

export default function CopyToClipboard(props: ICopyToClipboardProps) {
    const inputRef = useRef();
    const [isCopied, setIsCopied] = useState(false);
    const dispatch = useDispatch();

    const onClick = useCallback(async () => {
        if (!isCopied) {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(props.value);
            } else {
                const el: any = inputRef.current;
                if (el) {
                    el.focus();
                    el.select();
                }
                document.execCommand('copy');
            }
            if (props.notification) {
                const notification = {
                    level: 'info',
                    params: undefined,
                    ...(typeof props.notification === 'string' ? {message: props.notification} : props.notification),
                };
                dispatch(showNotification(notification.message, notification.level, notification.params));
            }

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        }
    }, [dispatch, isCopied, props.notification, props.value]);

    if (props.disabled) {
        return props.children;
    }

    return (
        <span
            className={props.className}
            onClick={onClick}
            aria-hidden='true'
        >
            {props.children}
            <input
                ref={inputRef}
                defaultValue={props.value}
                style={{
                    position: 'absolute',
                    height: 1,
                    width: 1,
                    top: 0,
                    opacity: 0,
                }}
            />
        </span>
    );
}
