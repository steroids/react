/* eslint-disable no-unused-expressions */
import React, {useCallback, useRef, useState} from 'react';
import {useComponents, useDispatch} from '../../../hooks';

import {showNotification, IShowNotificationParameters} from '../../../actions/notifications';

export interface ICopyToClipboardProps extends IUiComponent {
    value: string,
    disabled?: boolean,
    notification?: string | {
        message?: string,
        level?: string,
        params?: IShowNotificationParameters,
    },
    showCopyIcon?: boolean,
    children?: React.ReactNode,
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
                    ? dispatch(showNotification(notification, DEFAULT_NOTIFICATION_LEVEL, undefined))
                    : dispatch(showNotification(notification.message, notification.level, notification.params));
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
