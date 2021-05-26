import React, {useState, useCallback} from 'react'
import { useComponents } from '@steroidsjs/core/hooks';


interface IAlertProps {
    view?: any,
    type: 'success' | 'info' | 'warning' | 'error',
    message?: string,
    description?: string,
    style?: React.CSSProperties,
    showClose?: boolean,
    showIcon?: boolean,
    onClose?: () => void,
}

export interface IAlertViewProps extends IAlertProps {
    closed: boolean,
    onClose: () => void,
}

function Alert (props: IAlertViewProps) {
    const components = useComponents();

    const [closed, setClosed] = useState(false)

    const onClose = useCallback(() => {
        setClosed(true)
    }, [closed]);


    return components.ui.renderView(props.view || 'content.AlertView', {
        ...props,
        closed,
        onClose,
    });
}

Alert.defaultProps = {
    message: 'Success Tips',
    type: 'success',
    showClose: false,
    showIcon: true,
}

export default Alert;