import React, {useCallback, useRef, useState} from 'react';
import {IBemHocOutput} from '../../../hoc/bem';
import {IConnectHocOutput} from '../../../hoc/connect';
import useDispatch from '../../../hooks/useDispatch';

import {showNotification} from '../../../actions/notifications';

interface ICopyToClipboardProps extends IBemHocOutput, IConnectHocOutput {
    value: string,
    disabled?: boolean,
    notification?: string | {
        message?: string,
        level?: string,
        timeOut?: string,
    },
    className?: string,
    children?: any,
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
                //TODO Remove @ts-ignore
                //@ts-ignore
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
