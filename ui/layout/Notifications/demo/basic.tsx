import * as React from 'react';

import Notifications from '../Notifications';
import Button from '../../../form/Button';
import {showNotification} from '../../../../actions/notifications';
import {connect} from '../../../../hoc';
import {IConnectHocOutput} from '../../../../hoc/connect';


@connect()
export default class NotificationsDemo extends React.PureComponent<IConnectHocOutput> {

    render() {
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
                    flexFlow: 'column'
                }}
            >
                {Object.keys(notifications).map((level: string) => (
                    [].concat(notifications[level] || [])
                        .map(message => (
                            <Button
                                key={level}
                                color={level}
                                label={__(`Уведомление типа "${level}"`)}
                                onClick={() => this.props.dispatch(showNotification(message, {level}))}
                                style={{  margin: '10px 0' }}
                            />
                            ))
                ))}
            </div>
        );
    }
}