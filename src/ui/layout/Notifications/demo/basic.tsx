import * as React from 'react';
import useDispatch from '../../../../hooks/useDispatch';
import Button from '../../../form/Button';
import {showNotification} from '../../../../actions/notifications';

export default () => {
    const dispatch = useDispatch();
    const notifications = {
        primary: 'Primary notification',
        secondary: 'Secondary notification',
        success: 'Success notification',
        danger: 'Danger notification',
        warning: 'Warning notification',
        info: 'Info notification',
        light: 'Light notification',
        dark: 'Dark notification',
    };

    return (
        <div
            style={{
                width: '30%',
                display: 'flex',
                flexFlow: 'column',
            }}
        >
            {Object.keys(notifications).map((level: string) => (
                [].concat(notifications[level] || [])
                    .map(message => (
                        <Button
                            key={level}
                            color={level}
                            label={__(`Уведомление типа "${level}"`)}
                            onClick={() => dispatch(showNotification(message, level, {timeOut: 2000}))}
                            style={{ margin: '10px 0' }}
                        />
                    ))
            ))}
        </div>
    );
};
